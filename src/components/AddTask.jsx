import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const AddTask = () => {
  const [titleInput, setTitleInput] = useState({ title: '' });
  const [taskInput, setTaskInput] = useState({
    taskId: '',
    description: '',
    deadline: ''
  });
  const [titles, setTitles] = useState([]);

  // Fetch titles on component mount
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }
    axios.get('http://localhost:3030/api/titles', {
      headers: { token }
    }).then(response => {
      if (response.data.status === 'success') {
        setTitles(response.data.titles);
      } else {
        alert(response.data.message);
      }
    }).catch(error => {
      console.log(error);
      alert('Failed to fetch titles');
    });
  }, []);

  // Handle title input
  const titleInputHandler = (event) => {
    setTitleInput({ title: event.target.value });
  };

  // Handle task input
  const taskInputHandler = (event) => {
    setTaskInput({ ...taskInput, [event.target.name]: event.target.value });
  };

  // Add new title
  const addTitle = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }
    if (!titleInput.title) {
      alert('Please enter a title');
      return;
    }
    axios.post('http://localhost:3030/api/addtitle', titleInput, {
      headers: { token }
    }).then(response => {
      if (response.data.status === 'success') {
        alert('Title added successfully');
        setTitles([...titles, { id: response.data.title.id, title: response.data.title.title }]);
        setTitleInput({ title: '' });
      } else {
        alert(response.data.message);
      }
    }).catch(error => {
      console.log(error);
      alert('Failed to add title');
    });
  };

  // Add new task
  const addTask = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }
    if (!taskInput.taskId || !taskInput.description || !taskInput.deadline) {
      alert('Please fill all task fields');
      return;
    }
    console.log('Adding task:', taskInput); // Debug
    axios.post('http://localhost:3030/api/addtask', taskInput, {
      headers: { token }
    }).then(response => {
      if (response.data.status === 'success') {
        alert('Task added successfully');
        setTaskInput({ taskId: '', description: '', deadline: '' });
      } else {
        alert(response.data.message);
      }
    }).catch(error => {
      console.log(error);
      alert('Failed to add task');
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="row g-3">
              {/* Title Form */}
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <label htmlFor="title" className="form-label">Add Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={titleInput.title}
                  className="form-control"
                  onChange={titleInputHandler}
                  placeholder="Enter title (e.g., Grocery)"
                />
              </div>
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <button onClick={addTitle} className="btn btn-success">Add Title</button>
              </div>
              {/* Task Form */}
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <label htmlFor="taskId" className="form-label">Select Title</label>
                <select
                  id="taskId"
                  name="taskId"
                  value={taskInput.taskId}
                  className="form-control"
                  onChange={taskInputHandler}
                >
                  <option value="">Choose a title</option>
                  {titles.map(title => (
                    <option key={title.id} value={title.id}>{title.title}</option>
                  ))}
                </select>
              </div>
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <label htmlFor="description" className="form-label">Task Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={taskInput.description}
                  className="form-control"
                  onChange={taskInputHandler}
                  placeholder="Enter task description (e.g., Buy milk)"
                />
              </div>
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <label htmlFor="deadline" className="form-label">Task Deadline</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={taskInput.deadline}
                  className="form-control"
                  onChange={taskInputHandler}
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                />
              </div>
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <button onClick={addTask} className="btn btn-success">Add Task</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;