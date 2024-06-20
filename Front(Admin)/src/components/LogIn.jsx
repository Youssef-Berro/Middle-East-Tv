import React, { useState, useEffect } from 'react'
import './../css/LogIn.css'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { isEmpty } from '../Validations'

function LogIn() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const path = useNavigate()



    useEffect(() => {
        if(sessionStorage.getItem('token'))    path('/homepage');
    }, [])

    const loginRequest = async () => {
        if((isEmpty(name, 'name')) || (isEmpty(password, 'password')))  return;

        try {
            const res = await axios.post('http://localhost:8000/api/admin/log-in', {
                name, password});

            sessionStorage.setItem('token', res.data.token);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Login successfully',
                showConfirmButton: false,
                timer: 1000
            })
            path('/homepage');
        }catch(err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'incorrect name or password',
                showConfirmButton: false,
                timer: 2000
            })
        }
    }

    return (
        <div className="log-in-container">
            <div className="form">
                    <div className="form-title">Login</div>
                    <input 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Admin Name" 
                        type="text" />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" 
                        type="password" />
                    <button 
                        onClick={loginRequest}
                        className="log-in-btn">Login</button>
            </div>
            <img src="./../../img/utils/hamas.jpg" alt="not found" />
        </div>
    )
}

export default LogIn