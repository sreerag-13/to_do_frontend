import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const ViewTask = () => {
  const [tasksByDate, setTasksByDate] = useState({});
  const [token] = useState(sessionStorage.getItem('token'));

  const fetchData = () => {
    if (!token) {
      alert('Please log in first');
      return;
    }
    axios.get('http://localhost:3030/titles', {
      headers: { token }
    }).then(response => {
      console.log('Got titles:', response.data);
      if (response.data.status === 'success') {
        const titles = response.data.titles;
        let allTasks = [];
        titles.forEach(title => {
          axios.get(`http://localhost:3030/api/tasks/${title.id}`, {
            headers: { token }
          }).then(taskRes => {
            console.log(`Got tasks for title ${title.id}:`, taskRes.data);
            if (taskRes.data.status === 'success') {
              const tasksWithTitle = taskRes.data.tasks.map(task => ({
                ...task,
                titleId: title.id,
                titleName: title.title,
                completionPercentage: title.completionPercentage || 0
              }));
              allTasks = [...allTasks, ...tasksWithTitle];
              const tasksByDateObj = {};
              allTasks.forEach(task => {
                const date = new Date(task.deadline).toLocaleDateString();
                if (!tasksByDateObj[date]) {
                  tasksByDateObj[date] = [];
                }
                tasksByDateObj[date].push(task);
              });
              setTasksByDate(tasksByDateObj);
            }
          }).catch(error => {
            console.log(`Error getting tasks for title ${title.id}:`, error.message);
          });
        });
      } else {
        alert('Could not load titles');
        setTasksByDate({});
      }
    }).catch(error => {
      console.log('Error getting titles:', error.message);
      alert('Could not load titles');
    });
  };

  const calculateDeadlinePercentage = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    return (completedTasks / tasks.length) * 100;
  };

  const toggleTask = (taskId, titleId) => {
    if (!token) {
      alert('Please log in first');
      return;
    }
    axios.post(`http://localhost:3030/tasks/${taskId}/toggle`, {}, {
      headers: { token }
    }).then(response => {
      console.log('Toggle response:', response.data);
      if (response.data.status === 'success') {
        setTasksByDate(prev => {
          const newTasksByDate = { ...prev };
          for (const date in newTasksByDate) {
            newTasksByDate[date] = newTasksByDate[date].map(task => {
              if (task.id === taskId && task.titleId === titleId) {
                return {
                  ...task,
                  isCompleted: response.data.task.isCompleted,
                  completionPercentage: parseFloat(response.data.task.percentage) || 0
                };
              }
              return task;
            });
          }
          return newTasksByDate;
        });
      } else {
        alert('Could not update task');
      }
    }).catch(error => {
      console.log('Error toggling task:', error.message);
      alert('Could not update task');
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3>Tasks by Due Date</h3>
            <div className="row g-3">
              {Object.keys(tasksByDate).sort().map((date, index) => (
                <div key={index} className="col-12">
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">
                        Due: {date} ({calculateDeadlinePercentage(tasksByDate[date]).toFixed(1)}% Complete)
                      </h5>
                      <ul className="list-group">
                        {tasksByDate[date]
                          .sort((a, b) => a.titleName.localeCompare(b.titleName))
                          .map((task, taskIndex) => (
                            <li key={taskIndex} className="list-group-item">
                              <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={() => toggleTask(task.id, task.titleId)}
                                className="me-2"
                              />
                              <strong>{task.titleName}: {task.description}</strong>
                              <br />
                              Title Completion: {task.completionPercentage.toFixed(1)}%
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
              {Object.keys(tasksByDate).length === 0 && <p>No tasks found.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewTask;