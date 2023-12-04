"use client";
import React, { useState } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import theme from "../../public/utils/survey_theme.json";

function SurveyComponent({ data, assessmentID, patientID }) {
    const [survey] = useState(new Model(data));
    const [pageNo, setPageNo] = useState(survey.currentPageNo);
    const [isRunning, setIsRunning] = useState(true);

    survey.applyTheme(theme);

    survey.onCurrentPageChanged.add((_, options) => {
        setPageNo(options.newCurrentPage.visibleIndex);
    });

    survey.onStarted.add(() => { setIsRunning(true); } );

    survey.onComplete.add(() => { setIsRunning(false); });

    const formatSurveyResults = (res) => {
        let results = []

        Object.keys(res).map((key) => {
            const ids = key.split("_");
            const answer = typeof res[key] === 'string' ? res[key] : res[key].join();

            results.push({
                survey_id: ids[0],
                question_id: ids[1],
                answer: answer,
            })
        });

        return results;
    }

    const prevPage = () => { survey.prevPage(); };
    const nextPage = () => { survey.nextPage(); };
    const endSurvey = async () => { 
        let surveryResults = survey.data;

        survey.getAllQuestions().map((question) => {
            if(!surveryResults[question.name]){
                surveryResults[question.name] = "";
            }
        });

        const formattedResults = formatSurveyResults(surveryResults);

        try {
            const response = await fetch('http://localhost:8000/response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assessment_id: assessmentID,
                    patient_id: patientID,
                    data: formattedResults,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail);
            } 
    
            const result = await response.json();
        } catch (error) {
            console.error(error.message)
        }
     };   

    const renderButton = (text, func, canRender) => {
        if (!canRender) return undefined;
        return (
            <button className="line-height-24 font-semibold font-open-sans text-base px-8 py-3 rounded-md shadow-md bg-stone-900 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent" onClick={func}>
                {text}
            </button>
        );
    };

    const renderExternalNavigation = () => {
        if (!isRunning) return undefined;
        const progressText = "Page " + (pageNo + 1) + " of " + survey.visiblePages.length;
        const progressSpan = <span className="navigation-text absolute right-0 top-8 font-open-sans font-normal text-xs text-gray-500">{progressText}</span>;
        return (
            <div className="flex p-6 items-center gap-4 justify-center bg-gray-100">
                <div className="flex gap-8">
                    {/* {renderButton('Previous Page', prevPage, pageNo !== 0)} */}
                    {renderButton('Next / Skip', nextPage, pageNo !== survey.visiblePages.length - 1)}
                    {renderButton('Complete', endSurvey, pageNo <= survey.visiblePages.length - 1)}
                </div>
            </div>
        );
    };

    return (
        <div>
            <Survey
                currentPageNo={pageNo}
                model={survey}
            />
            {renderExternalNavigation()}
        </div>
    );
}

export default SurveyComponent;