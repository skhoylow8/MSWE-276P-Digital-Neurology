import React, { useState } from "react";
// import Axios from 'axios';
import logo from '../logo.svg';
import { useNavigate } from "react-router-dom";

export const ForgotPassword = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated")|| false));
    // const navigate = useNavigate();

    const validateInput = (string) => {
        return /^[\w\-.]{1,127}$/.test(string);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        alert("Submitted!")
        // if(!(validateInput(username) && validateInput(password))){
        //     alert("The username or password entered is invalid. Please make sure they contain lowercase letters, digits, or one of these special characters['_', '-', '.'] as well as between 1 and 127 characters.");
        //     return;
        // }

        // Axios.post("http://localhost:8080/account/login", {
        //     "username": username,
        //     "password": password
        // }).then((res) => {
        //     setAuthenticated(true)
        //     localStorage.setItem("authenticated", true);
        //     navigate("/dashboard", {"state": {"username": username, "token": res.data.access_token}});
        // }).catch((e) => {
        //     if(e.response.status == 401){
        //         alert(e.response.data.message);
        //         console.log(e.response.data);
        //     }
        // })
    }

    return (
        <div className="auth-form-container">
            <img src={logo} className="logo" />
            <h1 className="login__title">Reset Password</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    value = {username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Username"
                    minLength="1"
                    maxLength="127"
                    className="login__input login__input--user"
                    name="username"
                    id="username"
                />          
                <input
                    value = {password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                    minLength="1"
                    maxLength="127"
                    className="login__input login__input--password"
                    name="password"
                    is="password"
                />
                <button type="submit" className="login__btn">Sign In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Create account</button>
            <button className="link-btn" onClick={() => props.onFormSwitch('forgot-password')}>Forgot Password?</button>
        </div>
    )
}