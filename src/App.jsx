
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask() {
    if (task.trim() === '') return

    const newTask = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
    }

    setTasks([...tasks, newTask])
    setTask('')
  }

  function deleteTask(idToDelete) {
    setTasks(tasks.filter((item) => item.id !== idToDelete))

    if (editingId === idToDelete) {
      setEditingId(null)
      setEditText('')
    }
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    )
  }

  function startEditing(item) {
    setEditingId(item.id)
    setEditText(item.text)
  }

  function saveEdit(id) {
    if (editText.trim() === '') return

    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, text: editText.trim() }
          : item
      )
    )

    setEditingId(null)
    setEditText('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  const completedCount = tasks.filter(
    (item) => item.completed
  ).length

  return (
    <div className="todo-container">
      <h1>My To-Do List 📝</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />

        <button onClick={addTask}>Add Task</button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty-message">
          No tasks yet. Add your first task!
        </p>
      ) : (
        <ul>
          {tasks.map((item) => (
            <li key={item.id}>
              {editingId === item.id ? (
                <div className="edit-container">
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(item.id)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                  />

                  <button onClick={() => saveEdit(item.id)}>
                    Save
                  </button>

                  <button
                    className="cancel-button"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleTask(item.id)}
                    />

                    <span
                      className={item.completed ? 'completed' : ''}
                    >
                      {item.text}
                    </span>
                  </label>

                  <div className="task-actions">
                    <button
                      className="edit-button"
                      onClick={() => startEditing(item)}
                      disabled={item.completed}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteTask(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="task-count">
        Total tasks: {tasks.length} | Completed: {completedCount}
      </p>
    </div>
  )
}

export default App
