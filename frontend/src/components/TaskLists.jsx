import { useEffect, useState, useRef } from "react";
import Tasks from "./Tasks";
import axios from "axios";
import "./TaskLists.css";

const TaskLists = ({ boardId }) => {
  const [taskLists, setTaskLists] = useState([]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const prevBoardIdRef = useRef(boardId);

  console.log("TaskLists rendering with boardId:", boardId, "taskLists count:", taskLists.length);

  useEffect(() => {
    console.log("TaskLists useEffect triggered for boardId:", boardId);
    
    axios.get(`http://localhost:8080/api/tasklists/board/${boardId}`, {
      withCredentials: true
    })
    .then(res => {
      console.log("TaskLists loaded:", res.data);
      setTaskLists(res.data);
    })
    .catch(err => {
      console.error("Failed to load task lists - Full error:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
    });
  }, [boardId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/tasklists?boardId=${boardId}`,
        { name: newListName },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      setTaskLists(prev => [...prev, res.data]);
      setNewListName("");
      setIsAddingList(false);
    } catch (err) {
      console.error("Failed to create task list", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreate(e);
    } else if (e.key === 'Escape') {
      setIsAddingList(false);
      setNewListName("");
    }
  };

  const handleCancelAdd = () => {
    setIsAddingList(false);
    setNewListName("");
  };

  const handleDeleteList = async (listId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasklists/${listId}`, {
        withCredentials: true
      });
      setTaskLists(prev => prev.filter(list => list.id !== listId));
    } catch (err) {
      console.error("Failed to delete task list", err);
    }
  };

  const startEditingList = (listId, currentName) => {
    setEditingListId(listId);
    setEditingListName(currentName);
  };

  const handleUpdateListName = async (listId) => {
    if (!editingListName.trim()) {
      cancelEditingList();
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/tasklists/${listId}`,
        { name: editingListName.trim() },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );
      
      setTaskLists(prev => prev.map(list => 
        list.id === listId 
          ? { ...list, name: editingListName.trim() }
          : list
      ));
      
      cancelEditingList();
    } catch (err) {
      console.error("Failed to update task list name", err);
      cancelEditingList();
    }
  };

  const cancelEditingList = () => {
    setEditingListId(null);
    setEditingListName("");
  };

  const handleEditKeyPress = (e, listId) => {
    if (e.key === 'Enter') {
      handleUpdateListName(listId);
    } else if (e.key === 'Escape') {
      cancelEditingList();
    }
  };

  return (
    <div className="task-lists-container">
      {taskLists.map(list => (
        <div key={list.id} className="task-list">
          <div className="task-list-header">
            {editingListId === list.id ? (
              <div className="edit-list-container">
                <input
                  type="text"
                  value={editingListName}
                  onChange={(e) => setEditingListName(e.target.value)}
                  onKeyDown={(e) => handleEditKeyPress(e, list.id)}
                  onBlur={() => handleUpdateListName(list.id)}
                  className="edit-list-input"
                  autoFocus
                />
                <button
                  onClick={cancelEditingList}
                  className="cancel-edit-btn"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <h3 
                  className="list-title"
                  onClick={() => startEditingList(list.id, list.name)}
                  title="Click to edit list name"
                >
                  {list.name}
                </h3>
                <button
                  onClick={() => handleDeleteList(list.id)}
                  className="delete-list-btn"
                  title="Delete list"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
          <Tasks taskListId={list.id} listName={list.name} />
        </div>
      ))}
      
      <div className="add-list-container">
        {isAddingList ? (
          <div className="add-list-form-container">
            <form onSubmit={handleCreate}>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter list title..."
                autoFocus
                className="new-list-input"
              />
              <div className="form-actions">
                <button 
                  type="submit"
                  className="add-list-submit-btn"
                >
                  Add list
                </button>
                <button 
                  type="button"
                  onClick={handleCancelAdd}
                  className="cancel-add-btn"
                >
                  ×
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingList(true)}
            className="add-list-trigger-btn"
          >
            <span className="plus-icon">+</span>
            Add {taskLists.length === 0 ? 'a list' : 'another list'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskLists;