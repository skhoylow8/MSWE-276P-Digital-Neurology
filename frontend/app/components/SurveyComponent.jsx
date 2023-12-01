"use client";
import React, { useState, useEffect } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import theme from "../../public/utils/survey_theme.json";
import Cookies from "universal-cookie";
import { redirect } from "next/navigation";

function SurveyComponent({ data, assessmentID, patientID }) {
    const [survey] = useState(new Model(data));
    const [pageNo, setPageNo] = useState(survey.currentPageNo);
    const [isRunning, setIsRunning] = useState(true);
    const [redirectUrl, setRedirectUrl] = useState(null);

    let savedData = false;

    // Simulate a delayed redirect
    useEffect(() => {
        if (redirectUrl) {
            const timer = setTimeout(() => {
                console.log('Redirecting...');
                window.location.href = redirectUrl;
            }, 10000); // 10 seconds

            return () => clearTimeout(timer); // Cleanup timer on component unmount
        }
    }, [redirectUrl]);

    survey.applyTheme(theme);

    survey.onCurrentPageChanged.add((_, options) => {
        setPageNo(options.newCurrentPage.visibleIndex);
    });

    survey.onStarted.add(() => { setIsRunning(true); } );

    survey.onComplete.add(() => { setIsRunning(false); });

    survey.onComplete.add(async (sender, options) => {
        options.showSaveInProgress();

        let surveryResults = sender.data;

        survey.getAllQuestions().map((question) => {
            if(!surveryResults[question.name]){
                surveryResults[question.name] = "";
            }
        });

        const formattedResults = formatSurveyResults(surveryResults);

        // send formatted survey results
        // options.showSaveError();
        const currentDate = new Date();
        const dataToSend = {
            assessment_id: assessmentID,
            patient_id: patientID,
            data: formattedResults,
            completed_on: currentDate.toISOString().slice(0, -1)//  + (currentDate.getMilliseconds() / 1000).toFixed(6).slice(1),
        }

        if(!savedData){ // TODO: check to make sure only executing once
            console.log(JSON.stringify(dataToSend))
            savedData = true;
        }

        options.showSaveSuccess();

        try {
            // Call logout endpoint and clear cookies
            const res = await fetch("http://localhost:8000/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const cookies = new Cookies();
    
            if (res.status === 200) {
                // Successful logout
                cookies.set("authenticated", false, { path: '/' });
                cookies.set("researcherID", null, { path: '/' });
                cookies.set("firstName", null, { path: '/' });
                cookies.set("email", null, { path: '/' });
                
                console.log("Logout successful. Redirecting...");
            } else {
                // Failed logout
                throw new Error("Failed to logout");
            }
        } catch (err) {
            console.error(err);
        }
    });

    const formatSurveyResults = (res) => {
        let results = []

        Object.keys(res).map((key) => {
            const ids = key.split("_");

            results.push({
                survey_id: ids[0],
                question_id: ids[1],
                answer: res[key],
            })
        });

        return results;
    }

    const prevPage = () => { survey.prevPage(); };
    const nextPage = () => { survey.nextPage(); };
    const endSurvey = () => { survey.completeLastPage(); };   

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
                navigateToUrl={"http://localhost:8000/app"}
                onNavigateToUrl={function (sender, options) {
                    setRedirectUrl(options.url);
                }}
            />
            {renderExternalNavigation()}
        </div>
    );
}

export default SurveyComponent;