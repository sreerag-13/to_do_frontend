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
            navigate("/User")
          }
        }).catch((error)=>{

        })
        console.log(input)
    }
  return (
    <div>
    <div className="container">
        <div className="row">
            <div className="cols col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 colxxl-12">
                <div className="row g-3">
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        <label htmlFor="" className="form-label">Email</label>
                        <input type="text" className="form-control" name='email' value={input.email} onChange={inputhandller} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                           <label htmlFor="" className="form-label">Password</label>
                        <input type="text" className="form-control" name='password' value={input.password} onChange={inputhandller} />
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                       <button onClick={readvalues} className="btn btn-success">signin</button>
                    </div>
                    <div className="col col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                          <a href="/Signup" className="btn btn-secondary">new user</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Signin