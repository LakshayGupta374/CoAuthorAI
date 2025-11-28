import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useParams } from "react-router-dom";

export default function Editor() {
  const { id } = useParams();
  const [story, setStory] = useState("");
  const [suggestion, setSuggestion] = useState("Waiting for suggestion...");

  // Fetch story
  const fetchStory = async () => {
    const res = await api.get(`/stories/${id}`);
    setStory(res.data.content);
  };

  // AI Suggestion  
  const getSuggestion = async (text) => {
    try {
      setSuggestion("Thinking...");

      const res = await api.post("/ai/suggest", { prompt: text });

      setSuggestion(res.data.suggestion);
    } catch (err) {
      console.error("AI error:", err);
      setSuggestion("AI failed to generate suggestion");
    }
  };

  useEffect(() => {
    fetchStory();
  }, []);

  return (
    <div className="container mt-4">
      {/* Editor Box */}
      <div className="card p-4 shadow-sm mb-4" style={{ borderRadius: "12px" }}>
        <h4>Editor</h4>

        <textarea
          className="form-control mt-3"
          rows={12}
          value={story}
          onChange={(e) => {
            setStory(e.target.value);
            getSuggestion(e.target.value); // live suggestions
          }}
        />
      </div>

      {/* Suggestion Box */}
      <div className="card p-4 shadow-sm" style={{ borderRadius: "12px" }}>
        <h4>AI Suggestion</h4>
        <div className="mt-3 bg-light p-3 rounded">
          {suggestion}
        </div>
      </div>
    </div>
  );
}