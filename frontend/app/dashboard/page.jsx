'use client';
import React, { useEffect} from 'react'
import Table from '../components/Table';
import NavBar from '../components/NavBar';

const Dashboard = (props) => {
    useEffect(() => { 
        if(!window.localStorage.getItem("authenticated")){
            router.push('/')
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
                        <Table page="dashboard" />
                    </div>
                    </div>
                
            </main>
        </div>
    )
}

export default Dashboard;