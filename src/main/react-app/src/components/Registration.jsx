import React from 'react';
import '../style/login-registration.scss';

function Registration() {
    return (
        <div className="login-container"> {}
            <form className="login-form"> {}
                <h1>Create Account</h1>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" required />
                </div>
                <div className="input-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" required />
                </div>
                <a href="/home" role="button" className="login-button">
                    Register
                </a>

                <a href="/login" role="button" className="register-button">
                    Already have an account? Log in
                </a>
            </form>
        </div>
    );
}

export default Registration;
