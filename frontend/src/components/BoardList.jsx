import { useEffect, useState } from "react";
import axios from "axios";
import "./BoardList.css";

const BoardList = ({ onSelectBoard, onLogout }) => {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState("");
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/boards", {
      withCredentials: true,
    })
    .then(res => setBoards(res.data))
    .catch(err => {
      console.error("Failed to fetch boards:", err);
      setError("You must be logged in to view boards.");
    });
  }, []);

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    try {
      const res = await axios.post("http://localhost:8080/api/boards", 
        { name: newBoardName },
        { withCredentials: true }
      );
      setBoards(prev => [...prev, res.data]);
      setNewBoardName("");
    } catch (err) {
      console.error("Failed to create board", err);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/boards/${boardId}`, {
        withCredentials: true
      });
      setBoards(prev => prev.filter(board => board.id !== boardId));
    } catch (err) {
      console.error("Failed to delete board", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="board-list-container">
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
      <h1 className="main-title">Task Manager</h1>
      <h2 className="boards-title">Boards</h2>
      
      <form onSubmit={handleCreateBoard} className="board-form">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Enter board name..."
          className="board-input"
        />
        <button type="submit" className="add-board-btn">Add Board</button>
      </form>

      <div className="boards-grid">
        {boards.map(board => (
          <div
  key={board.id}
  className="board-card"
  onClick={() => onSelectBoard(board)}
  style={{ cursor: "pointer" }}
>
  <div className="board-content">
    <h3 className="board-name">
      {board.name}
    </h3>
    <div className="board-meta">
      <p className="board-date">
        Created: {new Date(board.createdAt).toLocaleString()}
      </p>
    </div>
  </div>
  <div
    className="board-actions"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      className="edit-btn"
      onClick={() => onSelectBoard(board)}
    >
      Edit
    </button>
    <button
      className="delete-btn"
      onClick={() => handleDeleteBoard(board.id)}
    >
      Delete
    </button>
  </div>
</div>
        ))}
      </div>
    </div>
  );
};

export default BoardList;