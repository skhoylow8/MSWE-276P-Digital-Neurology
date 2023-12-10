'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from 'swr'; 
import SurveyComponent from "@/app/components/SurveyComponent";
import isAuth from '@/app/components/isAuth';
import Cookies from 'universal-cookie';
import { FullScreenTakeover } from '@qualtrics/ui-react';

/**
 * Fetches data from the given URL.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} - A promise that resolves to the fetched JSON data.
 */
const fetcher = async (url) => {
    // get survey questions using id
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const responseData = await response.json();

    const formatedData = formatQuestions(responseData);

    return formatedData;
}

/**
 * Formats the JSON data to be used by the SurveyComponent, which uses the SurveyJS library.
 *
 * @param {Object} data - The JSON data to be formatted.
 * @returns {Object} - Formatted JSON data for the survey.
 */
const formatQuestions = (data) => {
    console.log(data);
    let pages = []
    const qType = {
        "mc": "radiogroup", // includes multiple choice
        "sc": "rating", // should be "rating" but need a min/max val, // includes scale/rating
        "fr": "comment", // includes free response
        "cb": "checkbox", // includes multiple answers
        "yn": "radiogroup", // includes yes/no 
    }

    data.surveys.map((survey) => {
        const surveyID = survey._id
        survey.questions.map((question)=>{
            let elements = {"elements" : {
                "name": surveyID + "_" + question._id,
                "title": question.text,
                "type": qType[question.type],
                "choices": question.choices,
                "rateMin": question.type=='sc'? parseInt(question.choices[0]): 0,
                "rateMax": question.type=='sc'? parseInt(question.choices[1]): 1,
            }}
            pages.push(elements);
        });
    });

    return {
        "title": data.assessment.name,
        "description": data.assessment.description,
        "pages": pages,
        "showNavigationButtons": false,
        "showQuestionNumbers": "off",
        // "showTitle": false,
    };
}

/**
 * Builds the StartAssessment component for the Start Assessment page.
 *
 * @function
 * @returns {JSX.Element} - JSX element representing the StartAssessment component.
 */
const StartAssessment = () => {
    const searchParams = useSearchParams();
    const cookies = new Cookies();

    const ids = searchParams.get('data').split("_");
    const assessmentID = ids[0];
    const patientID = ids[1];

    const { data, error, isLoading } = useSWR(`http://localhost:8000/assessment/${assessmentID}`, fetcher)

    useEffect(() => {
        cookies.set("authenticated", false, { path: '/' });
    }, []);


    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading assessment data</div>;
    }

    return (
        <div id="surveyElement" className='flex justify-center items-center h-screen'>
            {isLoading && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
            {!isLoading &&
                <div className='bg-gray-100 absolute top-0 left-0 right-0 bottom-0 h-80vh'>
                    <SurveyComponent data={data} assessmentID={assessmentID} patientID={patientID} />
                </div> }
        </div>
    )
}

export default isAuth(StartAssessment);