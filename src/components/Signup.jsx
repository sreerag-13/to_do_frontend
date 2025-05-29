import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        gender: "",
        address: ""
    });
    const inputHandler = (event) => {
        setInput({ ...input, [event.target.name]: event.target.value });
    };
    const readValues = () => {
        if (!input.name || !input.phone || !input.email || !input.password || !input.gender || !input.address) {
            alert("All fields are required");
            return;
        }
        if (!/^[a-zA-Z\s]*$/.test(input.name)) {
            alert("Name should contain only letters and spaces");
            return;
        }
        if (!/^\d{10}$/.test(input.phone)) {
            alert("Phone number must be 10 digits");
            return;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)) {
            alert("Please enter a valid email");
            return;
        }
        let newinput = {
            name: input.name,
            phone: input.phone,
            email: input.email,
            password: input.password,
            gender: input.gender,
            address: input.address
        };
        console.log(newinput);
        axios.post("http://localhost:3030/signup", newinput)
            .then((response) => {
                if (response.data.status === "success") {
                    alert("Register success");
                    navigate('/signin');
                } else {
                    alert("Email already exists");
                }
            })
            .catch((error) => {
                console.log("Error:", error.message);
                alert("Registration failed");
            });
    };
    const goBack = () => {
        navigate('/');
    };
    return (
        <div>
            <h1 className="text-center mb-4">TaskTide Registration</h1>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="row g-3">
                            <div className="col-12 col-sm-6">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={input.name}
                                    onChange={inputHandler}
                                />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={input.phone}
                                    onChange={inputHandler}
                                />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label className="form-label">Email</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    value={input.email}
                                    onChange={inputHandler}
                                />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={input.password}
                                    onChange={inputHandler}
                                />
                            </div>
                            <div className="col-12 col-sm-6">
                                <label className="form-label">Gender</label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="gender"
                                            id="male"
                                            value="male"
                                            checked={input.gender === "male"}
                                            onChange={inputHandler}
                                        />
                                        <label className="form-check-label" htmlFor="male">Male</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="gender"
                                            id="female"
                                            value="female"
                                            checked={input.gender === "female"}
                                            onChange={inputHandler}
                                        />
                                        <label className="form-check-label" htmlFor="female">Female</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="gender"
                                            id="other"
                                            value="other"
                                            checked={input.gender === "other"}
                                            onChange={inputHandler}
                                        />
                                        <label className="form-check-label" htmlFor="other">Other</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6">
                                <label className="form-label">Address</label>
                                <textarea
                                    className="form-control"
                                    name="address"
                                    value={input.address}
                                    onChange={inputHandler}
                                ></textarea>
                            </div>
                            <div className="col-12 col-sm-6">
                                <button onClick={readValues} className="btn btn-success">Register</button>
                            </div>
                            <div className="col-12 col-sm-6">
                                <button onClick={goBack} className="btn btn-secondary">Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;