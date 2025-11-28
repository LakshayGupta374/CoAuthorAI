import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stories, setStories] = useState([]);
  const [title, setTitle] = useState("");

  const fetchStories = async () => {
    const res = await api.get("/stories");
    setStories(res.data);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const createStory = async () => {
    if (!title.trim()) return alert("Enter title");

    const res = await api.post("/stories", { title });
    setStories([...stories, res.data]);
    setTitle("");
  };

  return (
    <div className="container mt-5">

      {/* Create Box */}
      <div className="card p-4 shadow-sm mb-4" style={{ borderRadius: "12px" }}>
        <h4>Create New Story</h4>
        <div className="input-group mt-3">
          <input
            className="form-control"
            placeholder="Enter story title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="btn btn-primary" onClick={createStory}>
            Create
          </button>
        </div>
      </div>

      {/* Story List */}
      <h4 className="mb-3">Your Stories</h4>

      <div className="row">
        {stories.map((story, index) => (
          <div
            className="col-md-4"
            key={story._id}
            style={{ animation: `fadeIn .4s ease ${index * 0.1}s` }}
          >
            <div className="card shadow-sm mb-4 p-3 story-card-hover">
              <h5>{story.title}</h5>
              <Link
                to={`/editor/${story._id}`}
                className="btn btn-outline-primary mt-3"
              >
                Open Editor
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .story-card-hover:hover {
          transform: translateY(-5px);
          transition: .2s;
          box-shadow: 0px 6px 16px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
}