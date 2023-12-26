import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from "axios";
import "./Login.css";


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [errors, setErrors] = useState({});
    const clientId = "759644824374-v4olseg4mjm8marhh6hqmrq5r4kcqqp4.apps.googleusercontent.com";
    const callbackUri = process.env.REACT_APP_BASE_BACKEND + "/auth/oauth2_google/callback/";


    useEffect(() => {
        if (localStorage.getItem("access_token")) {
            window.location.hash = "/";
        }
        if (searchParams.get('access') && searchParams.get('refresh')) {
            localStorage.setItem("access_token", searchParams.get('access'));
            localStorage.setItem("refresh_token", searchParams.get('refresh'));
            axios.defaults.headers.common["Authorization"] = `Bearer ${searchParams.get('access')}`;
            window.location.hash = '/';
        }
    }, []);


    const submit = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            password: password,
        };

        const request = await axios.post(
            process.env.REACT_APP_BASE_BACKEND + "/auth/login/",
            user,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
            { withCredentials: true }
        );
        if (request.data) {
            localStorage.clear();
            localStorage.setItem("access_token", request.data.access);
            localStorage.setItem("refresh_token", request.data.refresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${request.data["access"]}`;
            window.location.hash = '/';
        } else setErrors(request.response.data)

    };


    return (
        <div className="login-page">
            <div className='error'>
                {Object.entries(errors).map(([key, message]) => (
                    <p className="error-message">{`${key}: ${message}`}</p>
                ))}
            </div>
            <form className="login-form" onSubmit={submit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                    <button type="submit">Login</button>
                </div>
                <div className="forgot-password">
                    <Link to="/reset_password">Forgot password?</Link>
                </div>
                <div className="signup">
                    <Link to="/signup">Signup</Link>
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
        </div>
    );
};

export default Login;
