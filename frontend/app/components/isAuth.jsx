"use client";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Cookies from "universal-cookie";

/**
 * A higher-order component (HOC) that wraps a component and ensures authentication.
 *
 * @param {JSX.Element} Component - The React component to be wrapped.
 * @returns {Function} - A function that, when called, returns the wrapped component.
 */
export default function isAuth(Component) {
  /**
   * Wrapped component that ensures authentication before rendering.
   *
   * @component
   * @param {Object} props - The props passed to the wrapped component.
   * @returns {JSX.Element|null} - Returns the wrapped component if authenticated, otherwise null.
   */
  return function IsAuth(props) {
    const cookies = new Cookies();
    const router = useRouter();
    const auth = cookies.get("authenticated");
    const isLoggedIn = cookies.get("loggedIn");
    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => { // fixes hydration warning
        setIsSSR(false);
    }, []);


    useEffect(() => {
      if ((!auth || auth === null) && isLoggedIn) { // if not authenticated but logged in
        // Call logout endpoint and clear cookies
        fetch("http://localhost:8000/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
          .then((res) => { 
            if (res.status === 200) {
              // Successful logout
              cookies.set("authenticated", false, { path: '/' });
              cookies.set("researcherID", null, { path: '/' });
              cookies.set("firstName", null, { path: '/' });
              cookies.set("email", null, { path: '/' });
            } else {
                // Failed logout
                throw new Error("Failed to logout");
            }
          })
          .catch((err) => {
            console.error(err);
          }).finally(() => {
            router.push("/");
          });
      } else if ((!auth || auth === null) && !isLoggedIn) { // if not authenticated and not logged in redirect to login page
        router.push("/");
      }
    }, []);


    if (!auth) {
      return null;
    }

    return (
        <>
            {!isSSR && <Component {...props} suppressHydrationWarning={true} /> }
        </>
    );
  };
}