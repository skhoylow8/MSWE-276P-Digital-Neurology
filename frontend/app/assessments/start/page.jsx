'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from 'swr'; 
import SurveyComponent from "@/app/components/SurveyComponent";
import isAuth from '@/app/components/isAuth';
import Cookies from 'universal-cookie';
import { FullScreenTakeover } from '@qualtrics/ui-react';

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

const StartAssessment = () => {
    const searchParams = useSearchParams();
    const cookies = new Cookies();
    const [isFullScreen, setIsFullScreen] = useState(false);

    const ids = searchParams.get('data').split("_");
    const assessmentID = ids[0];
    const patientID = ids[1];

    const { data, error, isLoading } = useSWR(`http://localhost:8000/assessment/${assessmentID}`, fetcher)

    useEffect(() => {
        cookies.set("authenticated", false, { path: '/' });

        document.addEventListener("fullscreenchange", fullscreenchanged);
    }, []);

    
    const handleFullScreen = () => {
        const element = document.documentElement; // Fullscreen the entire document

        const requestFullscreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;

        if (requestFullscreen) {
            requestFullscreen.call(element);
        }

        setIsFullScreen(true);
    }

    function fullscreenchanged(event) {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If not, the value
        // of the property is null.
        if (document.fullscreenElement) {
            console.log(
                `Element: ${document.fullscreenElement.id} entered fullscreen mode.`,
            );
        } else {
            setIsFullScreen(false);
            console.log("Leaving fullscreen mode.");
        }
    }


    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading assessment data</div>;
    }

    return (
        <div id="surveyElement" className='flex justify-center items-center h-screen'>
            {isLoading && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
            {!isLoading && !isFullScreen && 
                <div className='flex flex-col'>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center pb-8">Please enter fullscreen mode to take assessment</h2>
                    <button className="w-9/12 self-center line-height-24 font-semibold font-open-sans text-base px-8 py-3 rounded-md shadow-md bg-stone-900 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent" onClick={handleFullScreen}>Enter Fullscreen</button>
                </div>}
            {!isLoading && isFullScreen && 
                <div className='bg-gray-100 absolute top-0 left-0 right-0 bottom-0 h-80vh'>
                    <SurveyComponent data={data} assessmentID={assessmentID} patientID={patientID} />
                </div> }
        </div>
    )
}

export default isAuth(StartAssessment);