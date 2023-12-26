import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Link, Navigate } from 'react-router-dom';
import "./Signup.css";


export default function Signup() {
    const clientId = "759644824374-v4olseg4mjm8marhh6hqmrq5r4kcqqp4.apps.googleusercontent.com";
    const callbackUri = process.env.REACT_APP_BASE_BACKEND + "/auth/oauth2_google/callback/";
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const [emailVerifier, setEmailVerifier] = useState(false);
    const [otp, setOTP] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            (async () => {
                try {
                    const { data } = await axios.get(process.env.REACT_APP_BASE_BACKEND + "/api/profile/", {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    if (data.is_email_verified) {
                        window.location.hash = "/";
                    } else {
                        setEmailVerifier(true);
                    }
                } catch (e) {
                    console.log(e);
                }
            })();
        }
    }, []);

    const signupSubmit = async (e) => {
        e.preventDefault();


        let content = new FormData();
        content.append('name', name);
        content.append('username', username);
        content.append('password', password);
        content.append('email', email);
        if (profile) content.append('profile', profile);

        const request = await axios.post(
            process.env.REACT_APP_BASE_BACKEND + "/auth/signup/",
            content,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            { withCredentials: true }
        );
        if (request.status === 201) {
            setEmailVerifier(true);
            localStorage.clear();
            localStorage.setItem("access_token", request.data.access);
            localStorage.setItem("refresh_token", request.data.refresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${request.data["access"]}`;
        } else setErrors(request.response.data)

    };

    const otpSubmit = async () => {

        const request = await axios.post(
            process.env.REACT_APP_BASE_BACKEND + "/auth/activate_account/",
            { OTP: otp }
        );
        if (request.status === 200) {
            setSuccessMessage('OTP verified successfully')
            window.location.hash = "/";
        } else setErrors(request.response.data)
    };

    const resendOTP = async () => {
        const request = await axios.patch(
            process.env.REACT_APP_BASE_BACKEND + "/auth/activate_account/");
        if (request.status === 200) {
            setSuccessMessage('OTP resend successfully')
        } else setErrors(request.response.data)
    };


    return (
        <div className="signup-page">
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            <p className="success-message">{successMessage}</p>
            {!emailVerifier ?
                <form className="signup-form" onSubmit={signupSubmit}>
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
                        <label htmlFor="profile">Don't be blue. Click here to choose your own avatar.</label>
                        <input id="profile" type="file" accept="image/*" className="file-hidden" onChange={(event) => setProfile(event.target.files[0])} />
                    </div>
                    <div className="form-group">
                        <button type="submit">Signup</button>
                    </div>
                    <div className="login">
                        <Link to="/login">Login</Link>
                    </div>
                    <div className="social-login">
                        <div className='google-login'>
                            <div id="g_id_onload"
                                data-client_id={clientId}
                                data-context="signin"
                                data-ux_mode="popup"
                                data-login_uri={callbackUri}
                                data-auto_prompt="false">
                            </div>

                            <div class="g_id_signin"
                                data-type="standard"
                                data-shape="pill"
                                data-theme="filled_black"
                                data-text="signin_with"
                                data-size="large"
                                data-logo_alignment="left">
                            </div>
                        </div>
                    </div>
                </form>
                :
                <div className="signup-form">
                    <div className="form-group">
                        <input
                            type="number"
                            placeholder="OTP"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                        />
                    </div>
                    <div className="resend-otp">
                        <Link to="#" onClick={resendOTP}>Resend OTP</Link>
                    </div>
                    <div className="form-group">
                        <button onClick={otpSubmit}>Submit</button>
                    </div>
                </div>}
        </div>
    );
};