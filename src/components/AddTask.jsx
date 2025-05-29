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
  const fetchTitles = () => {
    const token = sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('UserId');
    if (!token) {
      alert('Please log in first');
      return;
    }
    console.log('Fetching titles for userId:', userId);
    axios.get('http://localhost:3030/titles', {
      headers: { token }
    }).then(response => {
      console.log('Titles response:', response.data);
      if (response.data.status === 'success' && Array.isArray(response.data.titles)) {
        setTitles(response.data.titles);
        if (response.data.titles.length === 0) {
          console.log('No titles found for userId:', userId);
        }
      } else {
        console.log('Invalid titles response:', response.data);
        alert('No titles available');
        setTitles([]);
      }
    }).catch(error => {
      console.log('Error fetching titles:', error.message, error.response?.status);
      alert('Cannot load titles. Please try again.');
      setTitles([]);
    });
  };
  useEffect(() => {
    fetchTitles();
  }, []);
  const titleInputHandler = (event) => {
    setTitleInput({ title: event.target.value.trim() });
  };
  const taskInputHandler = (event) => {
    setTaskInput({ ...taskInput, [event.target.name]: event.target.value });
  };

  const addTitle = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }
    if (!titleInput.title) {
      alert('Enter a title');
      return;
    }
    console.log('Adding title:', titleInput);
    axios.post('http://localhost:3030/addtitle', titleInput, {
      headers: { token }
    }).then(response => {
      console.log('Add title response:', response.data);
      if (response.data.status === 'success') {
        alert('Title added');
        fetchTitles(); 
        setTitleInput({ title: '' });
      } else {
        alert(response.data.message || 'Cannot add title');
      }
    }).catch(error => {
      console.log('Error adding title:', error.message);
      alert('Error adding title');
    });
  };
  const addTask = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please log in first');
      return;
    }
    if (!taskInput.taskId || !taskInput.description || !taskInput.deadline) {
      alert('Fill all task fields');
      return;
    }
    console.log('Adding task:', taskInput);
    axios.post('http://localhost:3030/addtask', taskInput, {
      headers: { token }
    }).then(response => {
      console.log('Add task response:', response.data);
      if (response.data.status === 'success') {
        alert('Task added');
        setTaskInput({ taskId: '', description: '', deadline: '' });
        fetchTitles();
      } else {
        alert(response.data.message || 'Cannot add task');
      }
    }).catch(error => {
      console.log('Error adding task:', error.message);
      alert('Error adding task');
    });
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="row g-3">
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <label htmlFor="title" className="form-label">Add New Title</label>
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
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <label htmlFor="taskId" className="form-label">Select Existing Title</label>
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
                  placeholder="Enter task (e.g., Buy milk)"
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
                  min={new Date().toISOString().split('T')[0]}
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