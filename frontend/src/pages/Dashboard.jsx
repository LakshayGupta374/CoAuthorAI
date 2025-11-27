import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState("");

  const loadStories = async () => {
    const res = await api.get("/stories");
    setStories(res.data);
  };

  const createStory = async () => {
    const res = await api.post("/stories", { title });
    setStories([res.data, ...stories]);
  };

  useEffect(() => {
    loadStories();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Stories</h2>

      <input
        placeholder="New story title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createStory}>Create</button>

      <ul style={{ marginTop: "20px" }}>
        {stories.map((story) => (
          <li key={story._id}>
            <Link to={`/editor/${story._id}`}>{story.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
