import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
const User = () => {
  const [list, setList] = useState({});
  const [token] = useState(sessionStorage.getItem('token'));
  const [alerts, setAlerts] = useState([]);
  const [name] = useState(sessionStorage.getItem('name') || 'Guest');
  const getTasks = () => {
    if (!token) {
      alert('Please login first');
      return;
    }
    axios.get('http://localhost:3030/titles', { headers: { token } })
      .then(res => {
        if (res.data.status === 'success') {
          let all = [];
          const titles = res.data.titles;
          titles.forEach(title => {
            axios.get(`http://localhost:3030/api/tasks/${title.id}`, { headers: { token } })
              .then(res => {
                if (res.data.status === 'success') {
                  res.data.tasks.forEach(task => {
                    task.title = title.title;
                    task.titleId = title.id;
                    task.percent = title.completionPercentage || 0;
                    all.push(task);
                  });
                  let byDate = {};
                  let dueSoon = [];
                  all.forEach(task => {
                    let date = new Date(task.deadline).toLocaleDateString();
                    if (!byDate[date]) {
                      byDate[date] = [];
                    }
                    byDate[date].push(task);
                    let due = new Date(task.deadline);
                    let now = new Date();
                    let days = (due - now) / (1000 * 60 * 60 * 24);
                    if (days >= 0 && days <= 3 && !task.isCompleted) {
                      dueSoon.push(task);
                    }
                  });
                  setList(byDate);
                  setAlerts(dueSoon);
                }
              })
              .catch(err => {
                console.log('Task error:', err.message);
              });
          });
        } else {
          alert('No tasks found');
          setList({});
          setAlerts([]);
        }
      })
      .catch(err => {
        console.log('Title error:', err.message);
        alert('No tasks found');
      });
  };

  const getPercent = (items) => {
    if (!items || items.length === 0) {
      return 0;
    }
    let done = 0;
    items.forEach(item => {
      if (item.isCompleted) {
        done++;
      }
    });
    return (done / items.length) * 100;
  };
  const getDaysLeft = (date) => {
    let due = new Date(date);
    let now = new Date();
    let days = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (days >= 0) {
      return days;
    }
    return 'Overdue';
  };

  useEffect(() => {
    getTasks();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Welcome, {name}</h2>
        <h3>Due Soon</h3>
        {alerts.length > 0 ? (
          <div className="alert alert-warning">
            <h5>Alerts</h5>
            <ul className="list-group">
              {alerts.map((task, i) => (
                <li key={i} className="list-group-item">
                  Task "{task.description}" in "{task.title}" due on {new Date(task.deadline).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="alert alert-info">
            No tasks due within 3 days.
          </div>
        )}
        <h3>My Tasks</h3>
        {Object.keys(list).sort().map((date, i) => (
          <div key={i} className="card mb-2">
            <div className="card-body">
              <h5>Due: {date} ({getPercent(list[date]).toFixed(1)}% Done)</h5>
              <ul className="list-group">
                {list[date].sort((a, b) => a.title.localeCompare(b.title)).map((task, j) => (
                  <li key={j} className="list-group-item">
                    <strong>{task.title}: {task.description}</strong>
                    <br />
                    Days Left: {getDaysLeft(task.deadline)}
                    <br />
                    Title Progress: {task.percent.toFixed(1)}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {Object.keys(list).length === 0 && <p>No tasks to show.</p>}
      </div>
    </div>
  );
};

export default User;