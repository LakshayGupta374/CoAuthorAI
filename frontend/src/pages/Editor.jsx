import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { socket } from "../sockets/socket";

export default function Editor() {
  const { id } = useParams(); // storyId
  const [content, setContent] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const loadStory = async () => {
    const res = await api.get(`/stories/${id}`);
    setContent(res.data.content);
  };

  useEffect(() => {
    loadStory();

    socket.emit("story:join", { storyId: id });

    socket.on("story:suggestion", (data) => {
      setSuggestion(data.suggestion);
    });

    return () => {
      socket.off("story:suggestion");
    };
  }, []);

  // Send updates to server when typing
  const handleChange = (e) => {
    const text = e.target.value;
    setContent(text);

    socket.emit("story:update", { storyId: id, content: text });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Editor</h2>

      <textarea
        value={content}
        onChange={handleChange}
        style={{ width: "100%", height: "300px", fontSize: "16px" }}
      />

      <h3>AI Suggestion</h3>
      <div
        style={{
          padding: "10px",
          background: "#f4f4f4",
          borderRadius: "5px",
          minHeight: "100px",
        }}
      >
        {suggestion || "Waiting for suggestion..."}
      </div>
    </div>
  );
}
