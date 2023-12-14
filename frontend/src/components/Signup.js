import React, { useState } from 'react';
import axios from "axios";
import "./Signup.css";


export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const submit = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            email: email,
            name: name,
            password: password,
        };

        const { data } = await axios.post(
            "http://localhost:8000/auth/signup/",
            user,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
            { withCredentials: true }
        );

        localStorage.clear();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;
        // window.location.href = '/';
    };


    return (
        <div className="signup-page">
            <form className="signup-form" onSubmit={submit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">

                    <button type="submit">Signup</button>
                </div>
                <div className="login">
                    <a href="#">Login</a>
                </div>
                <div className="social-login">
                    {/* Implement social login buttons here */}
                </div>
            </form>
        </div>
    );
};