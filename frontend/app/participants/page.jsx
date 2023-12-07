'use client';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr'; 
import { useRouter } from 'next/navigation';
import Table from '@/app/components/Table';
import NavBar from '@/app/components/NavBar';
import Cookies from 'universal-cookie';

const fetcher = async (url) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    return await response.json();
}

const Participant = (props) => {
    const { data, error, isLoading } = useSWR('http://localhost:8000/participant/', fetcher);

    return (
        <div className="min-h-full bg-gray-50">
            <NavBar page="participants"/>
            <header className="bg-white shadow ">
                <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, {window.localStorage.getItem("firstName")}</h1>
                </div>
            </header>
            <main>
                <div className="card bg-base-100 drop-shadow-xl m-5">
                    <div className="card-body">
                        <h2 className="card-title text-stone-900 text-2xl">Participants</h2>
                        {!isLoading && <Table page="participants" data={data} />}
                        {!isLoading && data !== undefined && data.length == 0 && <p className="text-stone-900 text-center">No participants found.</p>}
                        {isLoading && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
                    </div>
                    </div>
                
            </main>
        </div>
    )
}

export default Participant;