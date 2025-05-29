import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const Signin = () => {
    const navigate=useNavigate()
    const[input,setInput]=useState(
        {
          "email": "",
        "password": ""
        }
    )
    const inputhandller=(event)=>{
        setInput({...input,[event.target.name]:event.target.value})
    }
    const readvalues=()=>{
        axios.post("http://localhost:3030/signin",input).then((response)=>{
          if (response.data.status=="incorrect password") {
            alert("incorrect password")
          } else if(response.data.status=="invalid email"){
            alert("invalid email")
          }else{
            let token=response.data.token
            let userId=response.data.userId
            console.log(token)
            console.log(userId)
            sessionStorage.setItem("UserId",userId)
            sessionStorage.setItem("token",token)
            axios.get(`http://localhost:3030/user/${userId}`, { headers: { token } })
              .then((userRes) => {
                if (userRes.data.status === "success") {
                  sessionStorage.setItem("name", userRes.data.user.name);
                  navigate("/User")
                } else {
                  alert("Error getting user info")
                }
              })
              .catch((err) => {
                console.log("User fetch error:", err.message)
                alert("Error getting user info")
              });
          }
        }).catch((error)=>{
          console.log("Signin error:", error.message)
        })
        console.log(input)
    }
  return (
    <div>
      <h1 className="text-center mb-4">TaskTide Login</h1>
      <div className="container">
        <div className="row">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div className="row g-3">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Email</label>
                        <input type="text" className="form-control" name='email' value={input.email} onChange={inputhandller} />
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                           <label htmlFor="" className="form-label">Password</label>
                        <input type="text" className="form-control" name='password' value={input.password} onChange={inputhandller} />
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                       <button onClick={readvalues} className="btn btn-success">signin</button>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                          <a href="/Signup" className="btn btn-secondary">new user</a>
                    </div>
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                          <button onClick={() => navigate('/')} className="btn btn-secondary">Back</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Signin;