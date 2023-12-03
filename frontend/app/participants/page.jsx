'use client';
import React, { useEffect} from 'react'
import Table from '@/app/components/Table';
import NavBar from '@/app/components/NavBar';
import isAuth from '@/app/components/isAuth';


const Participant = (props) => {
    const date = new Date(); 

    const participantsData = [
        { participantID: '1', assessmentName: 'Assessment 1', status: 'completed', completedOn: date },
        { participantID: '2', assessmentName: 'Assessment 2', status: 'completed', completedOn: date },
        { participantID: '3', assessmentName: 'Assessment 1', status: 'incompleted', completedOn: date },
        { participantID: '4', assessmentName: 'Assessment 1', status: 'completed', completedOn: date },
        { participantID: '5', assessmentName: 'Assessment 2', status: 'incompleted', completedOn: date },
    ]

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
                        <Table page="participants" data={participantsData} />
                    </div>
                    </div>
                
            </main>
        </div>
    )
}

export default isAuth(Participant);