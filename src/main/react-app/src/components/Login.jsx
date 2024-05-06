import React, {useState} from 'react';
import '../style/login-registration.scss';
import {userAPI} from "../apis/userAPI";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const trySend = async () => {
        const response = await userAPI.login(email, password);
        if(response.status === 200) {
            window.location.href = "/home";
        }
        else {
            // TODO: throw error
        }
    }

    return (
        <div className="login-container">
            <form className="login-form">
                <h1>Welcome!</h1>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={e => setPassword(e.target.value)} required />
                </div>
                <div className="login-button" onClick={trySend}>
                    Login
                </div>
            </form>
        </div>
    );
}

export default Login;