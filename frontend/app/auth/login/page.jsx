'use client';
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";

export const Login = (props) => {
  const router = useRouter();
  const [isButtonDisabled , setIsButtonDisabled] = useState(false);

  const validPassword = (string) => {
      return /^[\w\-.]{1,127}$/.test(string);
  };

  const validEmail = (string) => {
      return /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(string);
  }

  const encodeFormData = (data)=>{
      const formBody = new URLSearchParams();
      
      for (const key in data) {
          formBody.append(key, data[key]);
      }
      
      return formBody.toString();
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsButtonDisabled(true);

      const email = e.target.elements.email.value;
      const password = e.target.elements.password.value;
      const cookies = new Cookies();

      if(!(validEmail(email) && validPassword(password))){
          alert("The email or password entered is invalid. Please make sure they contain lowercase letters, digits, or one of these special characters['_', '-', '.'] as well as between 1 and 127 characters.");
          return;
      }

      const formData = {
          grant_type: '',
          username: email,
          password: password,
          scope: '',
          client_id: '',
          client_secret: '',
      };

      try {
          const response = await fetch('http://localhost:8000/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'accept': 'application/json',
              },
              body: encodeFormData(formData),
          });

          if (response.ok) {
            const result = await response.json();

            const accessToken = result.access_token;
            const researcherID = result.researcher_id
            const firstName = result.researcher_name
            const email = result.researcher_email

            cookies.set("authenticated", true, { path: "/" });
            cookies.set("researcherID", researcherID, { path: "/" });
            cookies.set("firstName", firstName, { path: "/" });
            cookies.set("email", email, { path: "/" });

            router.push('/assessments')
          } else {
              console.error('Failed to make POST request');
          }
      } catch (error) {
          console.error('Error:', error);
      }
  
  };

  return (
    <div className="hero min-h-screen bg-base-200 flex flex-col">
        <img className="hero-content mt-8 lg:w-1/2 w-2/3 flex self-center" src="/images/digital-neurology-logo-dark.png" alt="Digital Neurology" />
        <div className="hero-content flex-col lg:flex-row max-w-4xl">
            <div className="text-center lg:text-left">
                <h1 className="text-6xl lg:text-5xl font-bold text-stone-700">Welcome</h1>
                <p className="py-6 text-stone-500 lg:text-sm text-lg font-bold">This platform allows researchers with limited technical skills to be able to create assessments or surveys easily and efficiently so they can collect patient data.</p>
            </div>
            <div className="card flex-shrink-0 w-full max-w-2xl shadow-2xl bg-base-100 lg:max-w-xl">
                <form className="px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email"/>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
                        {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                    </div>
                    <div className="flex justify-center">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
                        Log In
                        </button>
                    </div>
                    <div className="flex items-center justify-between my-3">
                        <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/auth/register">
                        Don't Have An Account?
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

export default Login;
