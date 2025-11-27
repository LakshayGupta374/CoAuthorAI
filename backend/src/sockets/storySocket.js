const Story = require('../models/Story');
const axios = require('axios');
const jwt = require('jsonwebtoken');

// Optional: JWT auth on socket connection
const authenticateSocket = (token) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // userId
  } catch {
    return null;
  }
};

module.exports = function initStorySocket(io) {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);

    // Optional: send JWT in query: ?token=XXX
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    const userId = authenticateSocket(token);

    if (!userId) {
      console.log('❌ Socket auth failed');
      socket.disconnect(true);
      return;
    }

    // Join a room for a specific story
    socket.on('story:join', ({ storyId }) => {
      socket.join(storyId);
      console.log(`✅ Socket ${socket.id} joined story room ${storyId}`);
    });

    // Handle live text updates from client
    socket.on('story:update', async ({ storyId, content }) => {
      try {
        // update DB (optional: you can throttle this in real app)
        await Story.findByIdAndUpdate(storyId, {
          content,
          lastEditedBy: userId
        });

        // broadcast the updated content to others in room (for future collab features)
        socket.to(storyId).emit('story:updatedFromServer', { content });

        // Call OpenAI for suggestion based on current content
        const prompt = `Continue this story in the same style, suggest the next 2-3 lines:\n\n${content}`;

        const openaiRes = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a helpful story co-writer.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 120,
            temperature: 0.9
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const suggestion = openaiRes.data.choices[0].message.content;

        // Send suggestion back to same room
        io.to(storyId).emit('story:suggestion', {
          storyId,
          suggestion
        });

      } catch (err) {
        console.error('Socket story:update error:', err.response?.data || err.message);
        socket.emit('story:error', { message: 'Error generating suggestion' });
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });
};
