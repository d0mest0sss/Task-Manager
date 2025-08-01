import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import Register from './components/Register';
import BoardList from './components/BoardList';
import BoardView from './components/BoardView';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [currentBoard, setCurrentBoard] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/auth/status", {
      withCredentials: true,
    })
    .then(() => setIsLoggedIn(true))
    .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/logout", {}, {
        withCredentials: true
      });
      setIsLoggedIn(false);
      setCurrentBoard(null);
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggedIn(false);
      setCurrentBoard(null);
    }
  };

  const handleBoardNameChange = async (boardId, newName) => {
    try {
      console.log("Before update - currentBoard:", currentBoard);
      
      await axios.put(`http://localhost:8080/api/boards/${boardId}`, 
        { name: newName }, 
        { withCredentials: true }
      );

      setCurrentBoard(prevBoard => {
        console.log("Previous board state:", prevBoard);
        if (prevBoard && prevBoard.id === boardId) {
          const updatedBoard = {
            ...prevBoard,
            name: newName
          };
          console.log("Updated board state:", updatedBoard);
          return updatedBoard;
        }
        return prevBoard;
      });
    } catch (err) {
      console.error("Failed to update board name:", err);
    }
  };

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={
              currentBoard ? (
                  <BoardView 
                    boardId={currentBoard.id} 
                    boardName={currentBoard.name}
                    onBack={() => setCurrentBoard(null)}
                    onBoardNameChange={handleBoardNameChange}
                  />
            ) : (
              <BoardList 
                onSelectBoard={(board) => setCurrentBoard(board)}
                onLogout={handleLogout}
              />
            )
          } />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginForm onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;