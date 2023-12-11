'use client';
import React, { useEffect, useState} from 'react'
import Table from '@/app/components/Table';
import NavBar from '@/app/components/NavBar';
import Modal from "@/app/components/Modal"
import isAuth from '@/app/components/isAuth';
import useSWR from 'swr'; 
import { useRouter } from 'next/navigation';

/**
 * Fetches data from the given URL.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} - A promise that resolves to the fetched JSON data.
 */
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

/**
 * Surveys component for displaying a list of surveys.
 *
 * @returns {JSX.Element} - The JSX element representing the Surveys component.
 */
const Surveys = () => {
    const { data, error, isLoading } = useSWR('http://localhost:8000/survey', fetcher)
    const router = useRouter();

    /**
     * Handles the creation of a new survey.
     *
     * @param {Event} e - The submit event triggered by the form.
     */
    const handleCreateSurvey = (e) => {
        e.preventDefault();
        const surveyName = e.target.elements.surveyName.value;
        const surveyDesc = e.target.elements.surveyDesc.value;

        router.push(`/surveys/create?data=${encodeURIComponent(surveyName + "_" + surveyDesc)}`);
    }

    return (
        <div className="min-h-full bg-gray-50">
            <NavBar page="surveys"/>
            <header className="bg-white shadow ">
                <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, {window.localStorage.getItem("firstName")}</h1>
                </div>
            </header>
            <main>
                <div className="card bg-base-100 drop-shadow-xl m-5">
                    <div className="card-body">
                        <div className='flex flex-row justify-between'>
                            <h2 className="card-title text-stone-900 text-2xl">Surveys</h2>
                            <button className="shadow-lg w-8 h-8 rounded-full flex items-center cursor-pointer hover:bg-stone-200 hover:shadow" onClick={()=>document.getElementById("create-survey-modal").showModal()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-900 mx-auto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                        {!isLoading && <Table page="surveys" data={data} />}
                        {!isLoading && data.length==0 && <p className="text-stone-900 text-center">No surveys found</p>}
                        {isLoading && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
                    </div>
                </div>
                <Modal id="create-survey-modal">
                    <form  onSubmit={handleCreateSurvey}>
                        <h3 className="text-stone-900 text-2xl pb-4">Create A Survey</h3>
                        <input id="surveyName" type="text" placeholder="Survey Name" className="input input-bordered w-full text-md" required />
                        <textarea id="surveyDesc" className="textarea textarea-bordered w-full mt-4" placeholder="Survey Description..." required ></textarea>
                        <div className="flex justify-center mt-4">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">Create Survey</button>
                        </div>
                    </form>
                </Modal>
            </main>
        </div>
    )
}
export default isAuth(Surveys);