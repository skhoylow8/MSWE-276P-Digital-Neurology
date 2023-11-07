'use client';
import React, { useEffect } from 'react';
import Table from '../components/Table';
import NavBar from '../components/NavBar';
import Cookie from 'universal-cookie';
import { useRouter } from 'next/navigation';

const Dashboard = (props) => {
    const date = new Date(); 

    const dashboardData = [
        { id: '1', name: 'Assessment 1', status: 'completed', completedOn: date },
        { id: '2', name: 'Assessment 2', status: 'incomplete', completedOn: date },
        { id: '3', name: 'Assessment 1', status: 'completed', completedOn: date },
        { id: '4', name: 'Assessment 1', status: 'completed', completedOn: date },
        { id: '5', name: 'Assessment 2', status: 'completed', completedOn: date },
    ]
    const router = useRouter();

    const handleGetAssessments = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/survey');

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => { 
        if(!window.localStorage.getItem('authenticated')){
            router.push('/');
        }
     }, []);

    return (
        <div className="min-h-full bg-gray-50">
            <NavBar page="dashboard"/>
            <header className="bg-white shadow ">
                <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome</h1>
                </div>
            </header>
            <main>
                <div className="card bg-base-100 drop-shadow-xl m-5">
                    <div className="card-body">
                        <h2 className="card-title text-stone-900 text-2xl">Participants</h2>
                        <p className='text-stone-900 text-sm'>Most recently updated patients.</p>
                        <Table page="dashboard" data={dashboardData} />
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard;