import axios from 'axios'
import React, { useState } from 'react'

const Signup = () => {
    const [input, setInput] = new useState({
        "name": "",
        "phone": "",
        "email": "",
        "password": "",
        "gender": "",
        "address": ""
    })
    const inputhandller = (event) => {
        setInput({ ...input, [event.target.name]: event.target.value })
    }
    const readvalue = () => {

        let newinput = {
            "name": input.name,
            "phone": input.phone,
            "email": input.email,
            "password": input.password,
            "gender": input.gender,
            "address": input.address
        }
        console.log(newinput)
        axios.post("http://localhost:3030/signup", newinput).then((response) => {
            if (response.data.status == "success") {
                alert("register success")
            } else {
                alert("Email alraedy exist")
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <div className="row g-3">
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Name</label>
                                <input type="text" className="form-control" name='name' value={input.name} onChange={inputhandller} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Phone</label>
                                <input type="text" className="form-control" name='phone' value={input.phone} onChange={inputhandller} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Email</label>
                                <input type="text" className="form-control" name='email' value={input.email} onChange={inputhandller} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-label">Password</label>
                                <input type="text" className="form-control" name='password' value={input.password} onChange={inputhandller} />
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label className="form-label">Gender</label><br />

                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="genderMale"
                                        value="male"
                                        checked={input.gender === "male"}
                                        onChange={inputhandller}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="genderMale">Male</label>
                                </div>

                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="genderFemale"
                                        value="female"
                                        checked={input.gender === "female"}
                                        onChange={inputhandller}
                                    />
                                    <label className="form-check-label" htmlFor="genderFemale">Female</label>
                                </div>

                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="genderOther"
                                        value="other"
                                        checked={input.gender === "other"}
                                        onChange={inputhandller}
                                    />
                                    <label className="form-check-label" htmlFor="genderOther">Other</label>
                                </div>
                            </div>

                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <label htmlFor="" className="form-labe">address</label>
                                <textarea id="" className="form-control" name='address' value={input.address} onChange={inputhandller}></textarea>
                            </div>
                            <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <button onClick={readvalue} className="btn btn-success">register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup