import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../Signup/signup.css";
import background from '../assets/background.png';

function Login() {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const goToSignup = () => {
        navigate('/signup');
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(email, password)
        axios.post("http://localhost:3001/login", {email, password}, {
            headers:
            {'Content-Type': "application/json"}
        })
        .then(result => {
            console.log(result)
            if(result.data.message === "Success"){
                navigate(`/${result.data.username}/home`)
            }else if(result.data.message === "The password is incorrect"){
                alert("Incorrect password")
            }else{
                navigate("/signup")
                alert("You are not registered to this service")
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="signup-container" style={{ backgroundImage: `url(${background})` }}>
            <h1 className="app-name">WELCOME!</h1>
            <div className="signup-box">
                <div className="tabs">
                    <button className="tab active">Login</button>
                    <button className="tab inactive" onClick={goToSignup}>Sign Up</button>
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
                        <label>Password</label>
                        <input type="password"
                        placeholder="Type in your password"
                        autoComplete="off"
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <button type="submit" className="enter-button">Enter</button>
                </form>

                <p>Not have an account yet?</p>
                <Link to="/signup" className="login-link">
                    Sign Up
                </Link>
            </div>
        </div>
    );
}

export default Login;