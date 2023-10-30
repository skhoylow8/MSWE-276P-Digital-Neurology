"use client";
import React, { useState } from "react";
import backgroundImg from "../../../public/background.jpg";

import Link from "next/link";

export const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem(localStorage.getItem("authenticated") || false)
  );
  // const navigate = useNavigate();

  const myStyle = {
    backgroundImage: "url(" + backgroundImg + ")", // <a href="https://www.freepik.com/free-vector/ai-technology-brain-background-vector-digital-transformation-concept_16268324.htm#query=digital%20brain&position=33&from_view=search&track=ais">Image by rawpixel.com</a> on Freepik
  };

  const validateInput = (string) => {
    return /^[\w\-.]{1,127}$/.test(string);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email, password);
    alert("Submitted!");
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
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row max-w-4xl">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-stone-700">Welcome</h1>
          <p className="py-6 text-stone-500">This platform allows researchers with limited technical skills to be able to create assessments or surveys easily and efficiently so they can collect patient data.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-2xl shadow-2xl bg-base-100 lg:max-w-xl">
          <form class="px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                Email
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email"/>
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                Password
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
              {/* <p class="text-red-500 text-xs italic">Please choose a password.</p> */}
            </div>
            <div class="flex justify-center">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button">
                Log In
              </button>
            </div>
            <div class="flex items-center justify-between my-3">
              <Link class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/auth/register">
                Don't Have An Account?
              </Link>
              <Link class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/auth/forgot">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div> 
    // <div className="container flex flex-col justify-center max-w-md">
    //   <h1 className="text-6xl text-center">Welcome</h1>
    //   <p className="text-lg pt-2">
    //     <i>
    //       This platform will allow researchers with limited technical skills to
    //       be able to create assessments or surveys easily and efficiently that
    //       they can then give to their patients.
    //     </i>
    //   </p>
    //   <form className="flex flex-col p-2" onSubmit={handleSubmit}>
    //     <h2 className="text-3xl">Login</h2>
    //     <Input
    //       placeholder="Email"
    //       type="text"
    //       full
    //       style={{ width: "95%" }}
    //       className="login__input"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //     <Input
    //       placeholder="Password"
    //       type="password"
    //       full
    //       style={{ width: "95%" }}
    //       className="login__input"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     <button type="submit" className="login__btn">
    //       Sign In
    //     </button>
    //   </form>
    //   <div className="mx-auto text-center">
    //     <Link href="/auth/register" className="underline block">
    //         Don't have an account? Create one.
    //     </Link>
    //     <Link href="/auth/forgot" className="underline block">
    //       Forgot Password?
    //     </Link>
    //   </div>
    // </div>
  );
};

export default Login;
