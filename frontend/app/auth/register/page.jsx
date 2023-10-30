"use client";

import React, { useState } from "react";
// import Axios from 'axios';
// import logo from "../logo.svg";
import { Input } from "@qualtrics/ui-react";

import "../page.css";
import Link from "next/link";

export const Register = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [researcherID, setResearcherID] = useState();

  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem(localStorage.getItem("authenticated") || false)
  );
  // const navigate = useNavigate();

  const validateInput = (string) => {
    return /^[\w\-.]{1,127}$/.test(string);
  };

  const validateAmountInput = (amount) => {
    return (
      /^(?!0\d)\d*(\.\d+)?$/.test(amount) && /^\d+(\.\d{2})?$/.test(amount)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      researcherID
    );
    alert("Submitted!");
    // if(!(validateInput(username) && validateInput(password) && validateAmountInput(amount))){
    //     alert("The username or password entered is invalid. Please make sure they contain lowercase letters, digits, or one of these special characters['_', '-', '.'] as well as between 1 and 127 characters.");
    //     return;
    // }

    // if(password == confirmPassword){
    //     Axios.post("http://localhost:8080/account", {
    //         "username": username,
    //         "password": password,
    //         "balance": amount
    //     }).then((res) => {
    //         console.log(res);
    //         setAuthenticated(true)
    //         localStorage.setItem("authenticated", true);
    //         navigate("/dashboard", {"state": {"username": username, "token": res.data.access_token}});
    //     }).catch((error) => {
    //         alert(error.response.data.message);
    //     })
    // } else {
    //     alert("Something went wrong with the username or password");
    // }
  };

  return (
    <div className="auth-form-container">
      <h1 className="welcome">Sign Up</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* <h2 className="form__title">Create An Account</h2> */}
        <Input
          placeholder="First Name"
          type="text"
          full
          style={{ width: "95%" }}
          className="login__input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="Last Name"
          type="text"
          full
          style={{ width: "95%" }}
          className="login__input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          placeholder="Email"
          type="text"
          full
          style={{ width: "95%" }}
          className="login__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          full
          style={{ width: "95%" }}
          className="login__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          full
          style={{ width: "95%" }}
          className="login__input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Input
          placeholder="Researcher ID"
          type="number"
          full
          style={{ width: "95%" }}
          className="login__input"
          value={researcherID}
          onChange={(e) => setResearcherID(e.target.value)}
        />
        <button type="submit" className="login__btn">
          Sign Up
        </button>
      </form>
      <div className="mx-auto text-center">
        <Link className="underline block" href="/auth/login">
          Have an account already? Sign In.
        </Link>
        <Link className="underline block" href="/auth/forgot">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Register;
