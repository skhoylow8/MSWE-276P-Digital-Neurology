'use client';
import React, { useEffect, useState} from 'react'
import Table from '../components/Table';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import { MultiSelect } from "react-multi-select-component";
import useSWR from 'swr'; 
import { useRouter } from 'next/navigation';

const fetcher = async (url) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return await response.json();
}

const Surveys = () => {
    const { data, error, isLoading } = useSWR('http://localhost:8000/survey', fetcher)
    const router = useRouter();

    useEffect(() => { 
        if(!window.localStorage.getItem("authenticated")){
            router.push('/')
        }
    }, []);

    const handleCreateSurvey = () => {
        router.push("/surveys/create");
    }

    return (
        <div className="min-h-full bg-gray-50">
            <NavBar page="surveys"/>
            <header className="bg-white shadow ">
                <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome</h1>
                </div>
            </header>
            <main>
                <div className="card bg-base-100 drop-shadow-xl m-5">
                    <div className="card-body">
                        <div className='flex flex-row justify-between'>
                            <h2 className="card-title text-stone-900 text-2xl">Surveys</h2>
                            <button className="shadow-lg w-8 h-8 rounded-full flex items-center cursor-pointer hover:bg-stone-200 hover:shadow" onClick={handleCreateSurvey}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-900 mx-auto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                        {!isLoading && <Table page="surveys" data={data} />}
                        {isLoading && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
                    </div>
                </div>
            </main>
        </div>
    )
}
export default Surveys;