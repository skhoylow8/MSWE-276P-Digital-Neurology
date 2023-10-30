"use client";

import React, { useState } from "react";
// import Axios from 'axios';

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
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row max-w-4xl">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-stone-700">Sign Up</h1>
          <p className="py-6 text-stone-500">This platform allows researchers with limited technical skills to be able to create assessments or surveys easily and efficiently so they can collect patient data.</p>
        </div>
        <div className="card flex-wrap-row flex-shrink-0 w-full max-w-2xl shadow-2xl bg-base-100 lg:max-w-xl">
          <form class="px-8 pt-6 pb-8 mb-4">
            <div class="flex flex-row justify-around">
              <div class="mb-4 px-2">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="firstName">
                  First Name
                </label>
                <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstName" type="text" placeholder="First Name" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="lastName">
                  Last Name
                </label>
                <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lastName" type="text" placeholder="Last Name" />
              </div>
            </div>
            <div class="flex flex-row justify-around">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                  Email
                </label>
                <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="researcherID">
                  Researcher ID
                </label>
                <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="researcherID" type="text" placeholder="Researcher ID" />
              </div>
            </div>
            <div class="flex flex-row justify-around">
              <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                  Password
                </label>
                <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="confirmPassword">
                  Confirm Password
                </label>
                <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="confirmPassword" type="password" placeholder="******************" />
                {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
              </div>
            </div>
            <div class="flex justify-center">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                Sign Up
              </button>
            </div>
            <div class="flex items-center justify-between my-3">
              <Link class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/auth/login">
                Have An Account?
              </Link>
              <Link class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/auth/forgot">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div> 
  );
};

export default Register;
