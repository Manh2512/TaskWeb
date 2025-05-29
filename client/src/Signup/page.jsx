import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./signup.css";
import background from '../assets/background.png';

function Signup() {
    const [email, setEmail] = useState()
    const [name, setName] = useState()
    const [password, setPassword] = useState()
    const tasks = [];
    const navigate = useNavigate()

    const goToLogin = () => {
        navigate('/login');
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(name, email, password, tasks)
        axios.post("http://localhost:3001/signup", {email, name, password, tasks}, {
            headers:
            {'Content-Type': "application/json"}
        })
        .then(result => {
            console.log(result)
            navigate("/login")
        })
        .catch(error => {
            console.error("Error Details:", error);
            if (error.response) {
                console.error("Response Error:", error.response.data);
                console.error("Status:", error.response.status);
            } else if (error.request) {
                console.error("Request Error:", error.request);
            } else {
                console.error("Error Message:", error.message);
            }
        })
    }

    return (
        <div className="signup-container" style={{ backgroundImage: `url(${background})` }}>
            <h1 className="app-name">WELCOME!</h1>
            <div className="signup-box">
                <div className="tabs">
                    <button className="tab active">Sign Up</button>
                    <button className="tab inactive" onClick={goToLogin}>Login</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email"
                        placeholder="Type in your email"
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text"
                        placeholder="Type in your username"
                        autoComplete="off"
                        onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password"
                        placeholder="Type in your password"
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <button type="submit" className="enter-button">Enter</button>
                </form>

                <p>Already have an account?</p>
                <Link to="/login" className="login-link">
                    Login
                </Link>
            </div>
        </div>
    );
}

export default Signup;