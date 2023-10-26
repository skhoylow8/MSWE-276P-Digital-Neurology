import React, { useState } from "react";
// import Axios from 'axios';
import logo from '../logo.jpg';
import { useNavigate } from "react-router-dom";
import { Input } from '@qualtrics/ui-react';

export const Login = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authenticated, setAuthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated")|| false));
    // const navigate = useNavigate();

    const validateInput = (string) => {
        return /^[\w\-.]{1,127}$/.test(string);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(email, password)
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
            <h1 className="welcome">Welcome</h1>
            <p className="subscript"><i>This platform will allow researchers with limited technical skills to be able to create assessments or surveys easily and efficiently that they can then give to their patients.</i></p>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="form__title">Login</h2>
                <Input placeholder="Email" type="text" full style={{ width: "95%"}} className="login__input" value = {email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder="Password" type="password" full style={{ width: "95%" }} className="login__input" value = {password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="login__btn">Sign In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Create account</button>
            <button className="link-btn" onClick={() => props.onFormSwitch('forgot-password')}>Forgot Password?</button>
        </div>
    )
}