const axios = require('axios');

exports.getSuggestions = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Example using OpenAI API (chat completion)
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini', // or gpt-3.5-turbo, etc.
        messages: [
          { role: 'system', content: 'You are a helpful creative writing assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
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
    res.json({ suggestion });
  } catch (err) {
    console.error('AI suggestion error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI service error' });
  }
};
