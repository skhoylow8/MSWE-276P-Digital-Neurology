"use client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Cookies from "universal-cookie";
import Script from "next/script";

export default function isAuth(Component) {
  return function IsAuth(props) {
    const cookies = new Cookies();
    const auth = cookies.get("authenticated");
    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => { // fixes hydration warning
        setIsSSR(false);
    }, []);


    useEffect(() => {
      if (!auth || auth === null) {
        return redirect("/");
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