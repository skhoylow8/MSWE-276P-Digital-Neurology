'use client';
import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
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
        "sc": "rating", // should be "rating" but need a min/max val, // includes scale/rating
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
    const router = useRouter();

    const ids = searchParams.get('data').split("_");
    const assessmentID = ids[0];
    const patientID = ids[1];

    const { data, error, isLoading } = useSWR(`http://localhost:8000/assessment/${assessmentID}`, fetcher)

    useEffect(() => {
        const handleBackButton = (event) => {
          // You can add additional conditions if needed
          // For example, only redirect if the user is on a specific page
          if (router.pathname !== '/assessments/start') {
            // Log user out if they press back button
            window.localStorage.setItem("token", null);
            window.localStorage.setItem("authenticated", false);
            window.localStorage.setItem("researcherID", null);
            window.localStorage.setItem("firstName", null);
            window.localStorage.setItem("email", null);

            router.push('/');
          }
        };
    
        // Listen for the 'popstate' event
        window.addEventListener('popstate', handleBackButton);
    
        // Cleanup the event listener when the component is unmounted
        return () => {
          window.removeEventListener('popstate', handleBackButton);
        };
    }, [router]);

    if (error) {
        console.error('Error fetching data:', error);
        return <div>Error loading assessment data</div>;
    }

    return (
        <>
            {isLoading && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
            {!isLoading && <div id="surveyElement" className='bg-gray-100 absolute top-0 left-0 right-0 bottom-0 h-80vh'><SurveyComponent data={data} assessmentID={assessmentID} patientID={patientID} /></div> } {/*<SurveyComponent data={data}/>*/}
        </>
    )
}

export default StartAssessment