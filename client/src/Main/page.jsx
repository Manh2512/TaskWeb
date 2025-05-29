import React, { useState } from "react";
import "./main.css";
import { useNavigate } from "react-router-dom";
import background from '../assets/background.png';

function Main() {
    const navigate = useNavigate()

    const goToSignup = () => {
        navigate('/signup');
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="main-container" style={{ backgroundImage: `url(${background})` }}>
            <h1 className="app-name">WELCOME!</h1>
            <div className="main-box">
                <button onClick={goToLogin}>Login</button>
                <button onClick={goToSignup}>Sign Up</button>
            </div>
        </div>
    );
}

export default Main;