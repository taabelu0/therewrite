import React, {useEffect, useState} from 'react';
import '../style/login-registration.scss';
import {userAPI} from "../apis/userAPI";

function Registration() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [emailValid, setEmailValid] = useState(false);
    const [usernameValid, setUsernameValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordConfirmationValid, setPasswordConfirmationValid] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        setIsFormValid(emailValid && usernameValid && passwordValid && passwordConfirmationValid);
    }, [emailValid, usernameValid, passwordValid, passwordConfirmationValid]);

    const validateEmail = (email) => {
        const hasWhitespace = /\s/.test(email);
        const hasAtSymbol = email.includes('@');
        setEmailValid(hasAtSymbol && !hasWhitespace);
    }

    const validateUsername = (username) => {
        setUsernameValid(username.length >= 2);
    }

    const validatePassword = (password) => {
        setPasswordValid(password.length >= 8);
    }

    const validatePasswordConfirmation = (passwordConfirmation) => {
        setPasswordConfirmationValid(passwordConfirmation === password);
    }

    const trySend = async () => {
        if(password !== passwordConfirmation) {
            // TODO: throw error
        }
        else {
            const response = await userAPI.createUser(username, email, password);
            if(response.status === 200) {
                window.location.href = "/login";
            }
            else {
                // TODO: throw error
            }
        }
    }

    return (
        <div className="login-container">
            <form className="login-form">
                <h1>Create Account</h1>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" onChange={e => {
                        setUsername(e.target.value);
                        validateUsername(e.target.value);
                    }} className={usernameValid ? "valid" : "invalid"} required/>
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" onChange={e => {
                        setEmail(e.target.value);
                        validateEmail(e.target.value);
                    }} className={emailValid ? "valid" : "invalid"} required/>
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={e => {
                        setPassword(e.target.value);
                        validatePassword(e.target.value);
                    }} className={passwordValid ? "valid" : "invalid"} required/>
                </div>
                <div className="input-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" onChange={e => {
                        setPasswordConfirmation(e.target.value);
                        validatePasswordConfirmation(e.target.value);
                    }} className={passwordConfirmationValid ? "valid" : "invalid"} required/>
                </div>
                <div className={`login-button ${isFormValid ? "" : "disabled"}`} onClick={isFormValid ? trySend : null}>
                    Register
                </div>

                <a href="/login" role="button" className="register-button">
                    Already have an account? Log in
                </a>
            </form>
        </div>
    );
}

export default Registration;