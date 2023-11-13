'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NavBar = (props) => {
    const router = useRouter();

    const handleLogout = (e) =>{
        window.localStorage.setItem("token", null);
        window.localStorage.setItem("authenticated", false);
        window.localStorage.setItem("researcherID", null);
        window.localStorage.setItem("firstName", null);
        window.localStorage.setItem("email", null);
        router.push('/')
    }

    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center absolute left-0 pl-5">
                        <div className="flex-shrink-0">
                            <img className="h-10" src="/images/digital-neurology-logo.png" alt="Digital Neurology" />
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                                <Link href="/dashboard" className={props.page=="dashboard"?"bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium": "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"} aria-current="page">Dashboard</Link>
                                <Link href="/assessments" className={props.page=="assessments"?"bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium": "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"}>Assessments</Link>
                                <Link href="/participants" className={props.page=="participants"?"bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium": "text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"}>Participants</Link>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block absolute right-0 pr-5">
                        <div className="ml-4 flex items-center md:ml-6">
                            {/* <!-- Profile dropdown --> */}
                            <details className="dropdown relative ml-3">
                                <summary className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                    {/* <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" /> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </summary>

                                {/* <!--
                                    Dropdown menu, show/hide based on menu state.

                                    Entering: "transition ease-out duration-100"
                                    From: "transform opacity-0 scale-95"
                                    To: "transform opacity-100 scale-100"
                                    Leaving: "transition ease-in duration-75"
                                    From: "transform opacity-100 scale-100"
                                    To: "transform opacity-0 scale-95"
                                --> */}
                                <ul className="menu dropdown-content absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" aria-hidden="true" tabIndex="-1">
                                    {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                                    {/* <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-0">Your Profile</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-1">Settings</a> */}
                                    <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sign out</a>
                                </ul>
                            </details>
                        </div>
                    </div>

                    {/* <!-- Mobile menu --> */}
                    <details className="dropdown md:dropdown-end md:hidden">
                        <summary className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white" aria-controls="mobile-menu" aria-expanded="false">
                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </summary>
                        <ul id="mobile-menu" className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                                <Link href="/dashboard" className={props.page=="dashboard" ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" : "text-gray-500 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"} aria-current="page">Dashboard</Link>
                                <Link href="/assessments" className={props.page=="assessments" ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" : "text-gray-500 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"}>Assessments</Link>
                                <Link href="/participants" className={props.page=="participants" ? "bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" : "text-gray-500 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"}>Participants</Link>
                            </div>
                            <div className="border-t border-gray-700 pb-3 pt-4">
                                <div className="flex flex-col px-5">
                                    <div className="text-base font-medium leading-none text-gray-400 py-1">Tom Cook</div>
                                    <div className="text-sm font-medium leading-none text-gray-400">tom@example.com</div>
                                </div>
                                <div className="mt-3 space-y-1 px-2">
                                    <a href="#" onClick={handleLogout} className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-700 hover:text-white">Sign out</a>
                                </div>
                            </div>
                        </ul>
                    </details>
                </div>
            </div>
        </nav>
    )
}

export default NavBar