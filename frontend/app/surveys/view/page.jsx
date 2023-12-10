"use client";
import React from 'react';
import { useSearchParams } from "next/navigation";
import useSWR from 'swr'; 
import NavBar from '@/app/components/NavBar';
import MultipleChoice from '@/app/components/questionTypes/MultipleChoice';
import FreeResponse from '@/app/components/questionTypes/FreeResponse';
import Rating from '@/app/components/questionTypes/Rating';
import CheckBox from '@/app/components/questionTypes/CheckBox';
import isAuth from '@/app/components/isAuth';

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
 * ViewSurvey component for displaying details of a survey.
 *
 * @returns {JSX.Element} - The JSX element representing the ViewSurvey component.
 */
const ViewSurvey = () => {
    const searchParams = useSearchParams();
    const surveyID = searchParams.get('data')

    // Fetch survey data using useSWR hook
    const { data, error, isLoading } = useSWR(`http://localhost:8000/survey/${surveyID}`, fetcher)

    return (
        <>
            {isLoading && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
            {!isLoading && 
                <div className="min-h-full bg-gray-50">
                    <NavBar page="surveys"/>
                    <header className="bg-white shadow ">
                        <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">View Survey</h1>
                        </div>
                    </header>
                    <main>
                        <div className="card bg-base-100 drop-shadow-xl m-5">
                            <div className="card-body  text-stone-900">
                                <div className='flex flex-row justify-between'>
                                    <h2 className="card-title text-2xl">{data.name}</h2>
                                    {/* <button className="shadow-lg w-8 h-8 rounded-full flex items-center cursor-pointer hover:bg-stone-200 hover:shadow">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-900 mx-auto">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button> */}
                                </div>
                                <p>{data.desc}</p>
                                <div id='question-container' className='pt-5'>
                                {
                                    data.questions.map((question, index) => {
                                        if(question.type == 'mc'){
                                            return <MultipleChoice key={index} question={question} />
                                        } else if(question.type == 'yn'){
                                            return <MultipleChoice key={index} question={question} />
                                        } else if(question.type == 'sc'){
                                            return <Rating key={index} question={question} />
                                        } else if(question.type == 'fr'){
                                            return <FreeResponse key={index} question={question} />
                                        } else if(question.type == 'cb'){
                                            return <CheckBox key={index} question={question} />
                                        }
                                    })
                                }
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            }
        </>
    )
}

export default isAuth(ViewSurvey);