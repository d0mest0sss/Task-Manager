import { useEffect, useState } from "react";
import axios from "axios";
import "./Tasks.css";

const Tasks = ({ taskListId, listName }) => {
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8080/api/tasks/list/${taskListId}`, {
      withCredentials: true,
    })
    .then(res => setTasks(res.data))
    .catch(err => console.error("Failed to load tasks", err));
  }, [taskListId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/api/tasks?taskListId=${taskListId}`,
        { title: newTaskName },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTasks(prev => [...prev, res.data]);
      setNewTaskName("");
      setIsAddingTask(false);
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask(e);
    } else if (e.key === 'Escape') {
      setIsAddingTask(false);
      setNewTaskName("");
    }
  };

  const handleCancelAdd = () => {
    setIsAddingTask(false);
    setNewTaskName("");
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setEditingTitle(task.title);
    setEditingDescription(task.description || "");
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setEditingTitle("");
    setEditingDescription("");
  };

  const handleSaveTask = async () => {
    if (!editingTitle.trim()) return;

    try {
      const res = await axios.put(
        `http://localhost:8080/api/tasks/${selectedTask.id}`,
        { 
          title: editingTitle,
          description: editingDescription 
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id ? res.data : task
      ));
      
      handleCloseModal();
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${selectedTask.id}`, {
        withCredentials: true
      });
      
      setTasks(prev => prev.filter(task => task.id !== selectedTask.id));
      handleCloseModal();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <div className="tasks-container">
      {tasks.map(task => (
        <div 
          key={task.id} 
          onClick={() => handleTaskClick(task)}
          className="task-card"
        >
          {task.title}
        </div>
      ))}

      {isAddingTask ? (
        <div className="add-task-form">
          <form onSubmit={handleAddTask}>
            <textarea
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter a title for this card..."
              autoFocus
              className="new-task-textarea"
            />
            <div className="add-task-actions">
              <button 
                type="submit"
                className="add-task-submit-btn"
              >
                Add card
              </button>
              <button 
                type="button"
                onClick={handleCancelAdd}
                className="cancel-task-btn"
              >
                ×
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="add-task-trigger-btn"
        >
          <span className="plus-icon">+</span>
          Add a card
        </button>
      )}

      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-section">
                <span className="task-icon">📄</span>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="modal-title-input"
                />
              </div>
              <p className="task-list-info">
                in list <span className="list-name-underline">{listName}</span>
              </p>
            </div>

            <div className="modal-body">
              <div className="description-section">
                <div className="description-header">
                  <span className="description-icon">📝</span>
                  <h3 className="description-title">
                    Description
                  </h3>
                </div>
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="description-textarea"
                />
              </div>

              <div className="modal-actions">
                <button
                  onClick={handleSaveTask}
                  className="save-btn"
                >
                  Save
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="delete-btn"
                >
                  Delete
                </button>
                <button
                  onClick={handleCloseModal}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>

            <button
              onClick={handleCloseModal}
              className="modal-close-btn"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;