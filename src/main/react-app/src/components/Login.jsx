import React from 'react';
import '../style/login-registration.scss';


function Login() {
    return (
        <div className="login-container">
            <form className="login-form">
                <h1>Welcome!</h1>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" required />
                </div>
                <a href="/home" role="button" className="login-button">
                    Login
                </a>
            </form>
        </div>
    );
}

export default Login;