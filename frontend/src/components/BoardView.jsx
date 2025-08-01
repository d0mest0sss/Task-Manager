import { useState } from "react";
import TaskLists from "./TaskLists";

const BoardView = ({ boardId, boardName, onBack, onBoardNameChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(boardName);

  const handleNameClick = () => {
    setIsEditing(true);
    setEditName(boardName);
  };

  const handleNameSave = () => {
    if (editName.trim() && editName !== boardName) {
      onBoardNameChange(boardId, editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(boardName);
      setIsEditing(false);
    }
  };

  const handleInputBlur = () => {
    handleNameSave();
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden' 
    }}>
      {}
      <div style={{ 
        flexShrink: 0,
        zIndex: 10,
        backgroundColor: 'inherit',
        paddingBottom: '10px'
      }}>
        <div style={{ position: 'absolute', top: '5px', left: '5px' }}>
          <button onClick={onBack}>← Back to Boards</button>
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
          height: '60px',
          marginTop: '40px'
        }}>
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              autoFocus
              style={{
                fontSize: '1.5em',
                fontWeight: 'bold',
                position: 'relative',
                top: '21px',
                outline: 'none',
                background: 'black',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                height: '40px',
                boxSizing: 'border-box',
              }}
            />
          ) : (
            <h2 
              onClick={handleNameClick}
              style={{ 
                fontSize: '1.5em',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'inline-block',
                padding: '1px 8px',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                height: '40px',
                lineHeight: '40px',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b095ffff'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              title="Click to edit board name"
            >
              {boardName}
            </h2>
          )}
        </div>
      </div>

      {}
      <div 
        className="custom-scrollbar"
        style={{
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          minHeight: 0,
        }}
      >
        <style jsx>{`
          .custom-scrollbar {
            scrollbar-color: #8b5fbf #2a2a2a;
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            height: 12px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: linear-gradient(90deg, #1a1a2e, #16213e);
            border-radius: 10px;
            margin: 0 20px;
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #8b5fbf, #b095ff, #d4a5ff);
            border-radius: 10px;
            border: 2px solid transparent;
            background-clip: padding-box;
            box-shadow: 0 2px 6px rgba(139, 95, 191, 0.4);
            transition: all 0.3s ease;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, #a673d9, #c4a9ff, #e4b5ff);
            transform: scaleY(1.2);
            box-shadow: 0 4px 12px rgba(139, 95, 191, 0.6);
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:active {
            background: linear-gradient(90deg, #7a52a8, #9f87e8, #c49aff);
            transform: scaleY(1.1);
          }
          
          .custom-scrollbar::-webkit-scrollbar-corner {
            background: transparent;
          }
          
          /* Add subtle animation to the scrollbar */
          @keyframes scrollbar-glow {
            0%, 100% { box-shadow: 0 2px 6px rgba(139, 95, 191, 0.4); }
            50% { box-shadow: 0 2px 8px rgba(139, 95, 191, 0.6); }
          }
          
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            animation: scrollbar-glow 2s ease-in-out infinite;
          }
        `}</style>
        <TaskLists boardId={boardId} />
      </div>
    </div>
  );
};

export default BoardView;