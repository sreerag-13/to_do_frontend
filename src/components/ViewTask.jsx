import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
const ViewTask = () => {
  const [tasks, setTasks] = useState({});
  const [token] = useState(sessionStorage.getItem('token'));
  const [edit, setEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toDelete, setToDelete] = useState(null); 
  const getTasks = () => {
    if (!token) {
      alert('Please login first');
      return;
    }
    axios.get('http://localhost:3030/titles', { headers: { token } })
      .then(res => {
        if (res.data.status === 'success') {
          const titles = res.data.titles;
          let allTasks = [];
          titles.forEach(title => {
            axios.get(`http://localhost:3030/api/tasks/${title.id}`, { headers: { token } })
              .then(taskRes => {
                if (taskRes.data.status === 'success') {
                  const tasksWithTitle = taskRes.data.tasks.map(task => ({
                    ...task,
                    titleId: title.id,
                    title: title.title,
                    percent: title.completionPercentage || 0
                  }));
                  allTasks = [...allTasks, ...tasksWithTitle];
                  const taskGroups = {};
                  allTasks.forEach(task => {
                    const date = new Date(task.deadline).toLocaleDateString();
                    if (!taskGroups[date]) taskGroups[date] = [];
                    taskGroups[date].push(task);
                  });
                  setTasks(taskGroups);
                }
              })
              .catch(err => console.log('Error fetching tasks:', err.message));
          });
        } else {
          alert('Failed to load titles');
          setTasks({});
        }
      })
      .catch(err => {
        console.log('Error fetching titles:', err.message);
        alert('Failed to load titles');
      });
  };
  const getPercent = (taskList) => {
    if (!taskList || taskList.length === 0) return 0;
    const done = taskList.filter(t => t.isCompleted).length;
    return (done / taskList.length) * 100;
  };
  const toggle = (taskId, titleId) => {
    if (!token) {
      alert('Please login first');
      return;
    }
    axios.post(`http://localhost:3030/tasks/${taskId}/toggle`, {}, { headers: { token } })
      .then(res => {
        if (res.data.status === 'success') {
          setTasks(prev => {
            const newTasks = { ...prev };
            for (const date in newTasks) {
              newTasks[date] = newTasks[date].map(t => {
                if (t.id === taskId && t.titleId === titleId) {
                  return {
                    ...t,
                    isCompleted: res.data.task.isCompleted,
                    percent: parseFloat(res.data.task.percentage) || 0
                  };
                }
                return t;
              });
            }
            return newTasks;
          });
        } else {
          alert('Failed to update task');
        }
      })
      .catch(err => {
        console.log('Error toggling task:', err.message);
        alert('Failed to update task');
      });
  };
  const deleteTask = () => {
    if (!toDelete) return;
    axios.delete(`http://localhost:3030/tasks/${toDelete.id}`, { headers: { token } })
      .then(res => {
        if (res.data.status === 'success') {
          setTasks(prev => {
            const newTasks = { ...prev };
            for (const date in newTasks) {
              newTasks[date] = newTasks[date].filter(t => t.id !== toDelete.id);
              if (newTasks[date].length === 0) {
                delete newTasks[date];
              } else {
                newTasks[date] = newTasks[date].map(t => {
                  if (t.titleId === toDelete.titleId) {
                    return { ...t, percent: parseFloat(res.data.completionPercentage) || 0 };
                  }
                  return t;
                });
              }
            }
            return newTasks;
          });
        } else {
          alert('Failed to delete task');
        }
        setShowModal(false);
        setToDelete(null);
      })
      .catch(err => {
        console.log('Error deleting task:', err.message);
        alert('Failed to delete task');
        setShowModal(false);
        setToDelete(null);
      });
  };
  const saveTask = (taskId, titleId, desc, due) => {
    axios.put(`http://localhost:3030/tasks/${taskId}`, {
      description: desc,
      deadline: due
    }, { headers: { token } })
      .then(res => {
        if (res.data.status === 'success') {
          setTasks(prev => {
            const newTasks = { ...prev };
            const oldDate = Object.keys(newTasks).find(d => 
              newTasks[d].some(t => t.id === taskId)
            );
            if (oldDate) {
              newTasks[oldDate] = newTasks[oldDate].filter(t => t.id !== taskId);
              if (newTasks[oldDate].length === 0) {
                delete newTasks[oldDate];
              }
            }
            const newDate = new Date(due).toLocaleDateString();
            if (!newTasks[newDate]) newTasks[newDate] = [];
            newTasks[newDate].push({
              ...res.data.task,
              titleId: titleId,
              title: tasks[oldDate].find(t => t.id === taskId).title,
              percent: tasks[oldDate].find(t => t.id === taskId).percent
            });
            setEdit(null);
            return newTasks;
          });
        } else {
          alert('Failed to update task');
        }
      })
      .catch(err => {
        console.log('Error updating task:', err.message);
        alert('Failed to update task');
      });
  };
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <h3>Tasks by Due Date</h3>
        <div className="row g-3">
          {Object.keys(tasks).sort().map((date, i) => (
            <div key={i} className="col-12">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">
                    Due: {date} ({getPercent(tasks[date]).toFixed(1)}% Done)
                  </h5>
                  <ul className="list-group">
                    {tasks[date]
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map((task, j) => (
                        <li key={j} className="list-group-item">
                          {edit && edit.id === task.id ? (
                            <div>
                              <input
                                type="text"
                                className="form-control mb-2"
                                value={edit.desc}
                                onChange={e => setEdit({ ...edit, desc: e.target.value })}
                              />
                              <input
                                type="date"
                                className="form-control mb-2"
                                value={edit.due}
                                onChange={e => setEdit({ ...edit, due: e.target.value })}
                              />
                              <button
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => saveTask(task.id, task.titleId, edit.desc, edit.due)}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEdit(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => toggle(task.id, task.titleId)}
                                className="me-1"
                              />
                              <strong>{task.title}: {task.description}</strong>
                              <button
                                className="btn btn-danger btn-sm float-end ms-1"
                                onClick={() => {
                                  setToDelete({ id: task.id, titleId: task.titleId });
                                  setShowModal(true);
                                }}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-warning btn-sm float-end"
                                onClick={() => setEdit({
                                  id: task.id,
                                  desc: task.description,
                                  due: new Date(task.deadline).toISOString().split('T')[0]
                                })}
                              >
                                Edit
                              </button>
                              <br />
                              Title Completion: {task.percent.toFixed(1)}%
                            </>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
          {Object.keys(tasks).length === 0 && <p>No tasks found.</p>}
        </div>
      </div>
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: showModal ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this task?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger" onClick={deleteTask}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;