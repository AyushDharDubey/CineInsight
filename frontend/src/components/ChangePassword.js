<div className="profile-password">
                        <p>New password: <input type="text" onChange={(e) => setName(e.target.value)} /></p>
                        <p>Confirm password: <input type="text" onChange={(e) => setName(e.target.value)} /></p>
                    </div>

import React, { useState } from 'react';
import axios from "axios";
import "./ChangePassword.css";


export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    const submit = async (e) => {
        
    };


    return (
        <div className="change-password-page">
            <form className="change-password-form" onSubmit={submit}>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={password}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={password}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <button type="submit">Login</button>
                </div>
                <div className="forgot-password">
                    <a href="#">Forgot password?</a>
                </div>
                <div className="signup">
                    <a href="/signup">Signup</a>
                </div>
                <div className="social-login">
                    {/* Implement social login buttons here */}
                </div>
            </form>
        </div>
    );
};

