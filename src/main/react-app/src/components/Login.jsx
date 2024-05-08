import React, {useState} from 'react';
import '../style/login-registration.scss';
import {userAPI} from "../apis/userAPI";


function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const trySend = async () => {
        const response = await userAPI.login(username, password);
        console.log(response)
        if(response.status === 200) {
            // window.location.href = "/home";
            console.log(response.data)
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
                    <label htmlFor="username">Username</label>
                    <input type="username" id="username" onChange={e => setUsername(e.target.value)} required />
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