'use client';
import React from 'react';
import { useSearchParams } from "next/navigation";
import useSWR from 'swr'; 
import SurveyComponent from "../../components/SurveyComponent";

const fetcher = async (url) => {
    // get survey questions using id
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

    const responseData = await response.json();

    const formatedData = formatQuestions(responseData);

    return formatedData;
}

const formatQuestions = (data) => {
    console.log(data);
    let pages = []
    const qType = {
        "mc": "radiogroup", // includes multiple choice
        "sc": "text", // should be "rating" but need a min/max val, // includes scale/rating
        "fr": "comment", // includes free response
        "cb": "checkbox", // includes multiple answers
        "yn": "boolean", // includes yes/no 
    }

    data.surveys.map((survey) => {
        const surveyID = survey._id
        survey.questions.map((question)=>{
            let elements = {"elements" : {
                "name": surveyID + "_" + question._id,
                "title": question.text,
                "type": qType[question.type],
                "choices": question.choices
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
    const assessmentID = searchParams.get('data');

    const { data, error, isLoading } = useSWR(`http://localhost:8000/assessment/${assessmentID}`, fetcher)

    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading assessment data</div>;
    }

    return (
        <>
            {isLoading && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
            {!isLoading && <div id="surveyElement" className='bg-gray-100 absolute top-0 left-0 right-0 bottom-0 h-80vh'><SurveyComponent data={data} id={assessmentID} /></div> } {/*<SurveyComponent data={data}/>*/}
        </>
    )
}

export default StartAssessment