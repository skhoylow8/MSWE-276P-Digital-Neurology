"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "universal-cookie";

export const Register = (props) => {
  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const validName = (string) => {
    return /^[A-Za-z]+$/.test(string); 
  };

  const validPassword = (string) => {
    return /^[\w\-.]{1,127}$/.test(string);
  };

  const validEmail = (string) => {
    return /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(string);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);

    const firstName = e.target.elements.firstName.value;
    const lastName = e.target.elements.lastName.value;
    const email = e.target.elements.email.value; 
    const confirmEmail = e.target.elements.confirmEmail.value;
    const password = e.target.elements.password.value;
    const confirmPassword = e.target.elements.confirmPassword.value;

    if(!(validName(firstName) && validName(lastName) && validPassword(password) && validEmail(email) && validEmail(confirmEmail))){
        alert("The information entered is invalid.");
        return;
    }

    if(password == confirmPassword && email == confirmEmail){
      try {
        const response = await fetch('http://localhost:8000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "first_name": firstName,
              "last_name": lastName,
              "email": email,
              "confirm_email": confirmEmail,
              "password": password,
              "confirm_password": confirmPassword
            }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail);
        } 

        const result = await response.json();
        
        const researcherID = result.researcher_id
        const firstNameRes = result.researcher_name
        const emailRes = result.researcher_email

        const cookies = new Cookies();
        cookies.set("authenticated", true, { path: "/" });
        cookies.set("researcherID", researcherID, { path: "/" });
        cookies.set("firstName", firstNameRes, { path: "/" });
        cookies.set("email", ememailResail, { path: "/" });

        router.push('/assessments')

      } catch (error) {
        alert(error.message)
        setIsButtonDisabled(false);
      }
    } else {
        alert("Something went wrong with the information entered. Please try again.");
        setIsButtonDisabled(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200 flex flex-col">
      <img className="hero-content mt-8 lg:w-1/2 w-2/3 flex self-center" src="/images/digital-neurology-logo-dark.png" alt="Digital Neurology" />
      <div className="hero-content flex-col lg:flex-row max-w-4xl">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-stone-700">Sign Up</h1>
          <p className="py-6 text-stone-500 lg:text-sm text-lg font-bold">This platform allows researchers with limited technical skills to be able to create assessments or surveys easily and efficiently so they can collect patient data.</p>
        </div>
        <div className="card flex-wrap-row flex-shrink-0 w-full max-w-2xl shadow-2xl bg-base-100 lg:max-w-xl">
          <form className="px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="flex flex-row justify-around">
              <div className="mb-4 px-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                  First Name
                </label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="firstName" type="text" placeholder="First Name" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lastName" type="text" placeholder="Last Name" />
              </div>
            </div>
            <div className="flex flex-row justify-around">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmEmail">
                  Confirm Email
                </label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="confirmEmail" type="text" placeholder="Confirm Email" />
              </div>
            </div>
            <div className="flex flex-row justify-around">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />
                {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="confirmPassword" type="password" placeholder="******************" />
                {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
              </div>
            </div>
            <div className="flex justify-center">
                {isButtonDisabled && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit" disabled >
                    <div className='flex justify-center'><span className="text-white-900 loading loading-spinner loading-md"></span></div>
                  </button>}
                {!isButtonDisabled && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
                    Sign Up
                  </button>}
            </div>
            <div className="flex items-center justify-between my-3">
              <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/auth/login">
                Have An Account?
              </Link>
              {/* <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/auth/forgot">
                Forgot Password?
              </Link> */}
            </div>
          </form>
        </div>
      </div>
    </div> 
  );
};

export default Register;
