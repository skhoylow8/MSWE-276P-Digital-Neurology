'use client';
import React, { useEffect} from 'react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Table from '../components/Table';
import Cookies from 'universal-cookie';

const Dashboard = (props) => {
    const router = useRouter();
    const cookies = new Cookies();

    const handleLogout = (e) =>{
        cookies.remove('authenticated');
        router.push('/');
    }

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
        if(!cookies.get('authenticated')){
            router.push('/');
        }
     }, []);

    return (
        cookies.get('authenticated') && <>
            <div className="drawer">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <div className="navbar bg-base-100 shadow-lg">
                        <button className="btn btn-square btn-ghost">
                            <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current text-stone-800"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>  
                            </label>
                        </button>
                        <div className="flex-1">
                            <a className="normal-case text-bold text-xl text-stone-800">Digital Neurology</a>
                        </div>
                        <button className="flex flex-end btn text-stone-800" onClick={handleLogout}>Logout</button>
                    </div>
                    <h1 className='text-stone-900 text-5xl m-5'>Welcome</h1>
                    <div className="card bg-base-100 drop-shadow-xl m-5">
                        <div className="card-body">
                            <h2 className="card-title text-stone-900 text-2xl">Participants</h2>
                            <p className='text-stone-900 text-sm'>Most recently updated patients.</p>
                            <Table />
                            <button className="btn btn-primary" onClick={handleGetAssessments}>Get Surveys</button>
                        </div>
                    </div>
                </div> 
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    {/* Sidebar content here */}
                    <li><Link href="/">Dashboard</Link></li>
                    <li><Link href="/assessments">Assessment</Link></li>
                    <li><Link href="/participants">Participants</Link></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Dashboard