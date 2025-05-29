import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Navbar from './Navbar';

const History = () => {
  const [tasks, setTasks] = useState([]); 
  const [token] = useState(sessionStorage.getItem('token'));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [titleSearch, setTitleSearch] = useState('');
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
                    title: title.title,
                    percent: title.completionPercentage || 0
                  }));
                  allTasks = [...allTasks, ...tasksWithTitle];
                  setTasks(allTasks);
                }
              })
              .catch(err => console.log('Error getting tasks:', err.message));
          });
        } else {
          alert('Failed to load tasks');
          setTasks([]);
        }
      })
      .catch(err => {
        console.log('Error getting titles:', err.message);
        alert('Failed to load tasks');
      });
  };
  const filterTasks = (task) => {
    const taskDate = new Date(task.deadline);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const titleMatch = titleSearch ? task.title.toLowerCase().includes(titleSearch.toLowerCase()) : true;
    
    const dateMatch = (!start || taskDate >= start) && (!end || taskDate <= end);
    return titleMatch && dateMatch;
  };
  const completed = tasks.filter(t => t.isCompleted && filterTasks(t));
  const notCompleted = tasks.filter(t => !t.isCompleted && filterTasks(t));
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <Navbar/>
      <div className="container">
        <h3>Task History</h3>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Filter Tasks</h5>
            <div className="row g-2">
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  placeholder="Start Date"
                />
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  placeholder="End Date"
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  value={titleSearch}
                  onChange={e => setTitleSearch(e.target.value)}
                  placeholder="Search Title"
                />
              </div>
            </div>
          </div>
        </div>

        <h4>Completed Tasks</h4>
        <div className="card mb-3">
          <div className="card-body">
            <ul className="list-group">
              {completed.length > 0 ? (
                completed.map((task, i) => (
                  <li key={i} className="list-group-item">
                    <strong>{task.title}: {task.description}</strong>
                    <br />
                    Due: {new Date(task.deadline).toLocaleDateString()}
                    <br />
                    Title Completion: {task.percent.toFixed(1)}%
                  </li>
                ))
              ) : (
                <p>No completed tasks found.</p>
              )}
            </ul>
          </div>
        </div>

        <h4>Not Completed Tasks</h4>
        <div className="card mb-3">
          <div className="card-body">
            <ul className="list-group">
              {notCompleted.length > 0 ? (
                notCompleted.map((task, i) => (
                  <li key={i} className="list-group-item">
                    <strong>{task.title}: {task.description}</strong>
                    <br />
                    Due: {new Date(task.deadline).toLocaleDateString()}
                    <br />
                    Title Completion: {task.percent.toFixed(1)}%
                  </li>
                ))
              ) : (
                <p>No incomplete tasks found.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;