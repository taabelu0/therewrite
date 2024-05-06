import React, {useState} from 'react';
import '../style/login-registration.scss';
import {commentAPI} from "../apis/commentAPI";
import {userAPI} from "../apis/userAPI";

function Registration() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

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
        <div className="login-container"> {}
            <form className="login-form"> {}
                <h1>Create Account</h1>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" id="confirm-password" onChange={e => setPasswordConfirmation(e.target.value)} required />
                </div>
                <div className="login-button" onClick={trySend}>
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
