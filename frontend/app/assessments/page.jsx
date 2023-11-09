'use client';
import React, { useEffect} from 'react'
import Table from '../components/Table';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import Multiselect from '../components/Multiselect';
import useSWR from 'swr'; 

const surveyFetcher = (token) => fetch('http://localhost:8000/survey', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }).then(res => res.json())

const Assessments = () => {
    const { surveyData, errorSurveyData, isLoadingSurveyData } = useSWR('/survey', surveyFetcher)

    const surveys = [
        {label: "Demographics Survey", value: "Demographics Survey"},
        {label: "Migraine Survey", value: "Migraine Survey"},
        {label: "Pain Survey", value: "Pain Survey"},
        {label: "Memory Survey", value: "Memory Survey"},
        {label: "Demographics Survey", value: "Demographics Survey 1"},
        {label: "Migraine Survey", value: "Migraine Survey 1"},
        {label: "Pain Survey", value: "Pain Survey 1"},
        {label: "Memory Survey", value: "Memory Survey 1"},
        {label: "Demographics Survey", value: "Demographics Survey 2"},
        {label: "Migraine Survey", value: "Migraine Survey 2"},
        {label: "Pain Survey", value: "Pain Survey 3"},
        {label: "Memory Survey", value: "Memory Survey 3"},
    ];

    const date = new Date(); 

    const assessmentData = [
        { id: '1', name: 'Assessment 1', description: 'This is a description about Assessment 1.', createdOn: date, consentText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', },
        { id: '2', name: 'Assessment 2', description: 'This is a description about Assessment 2.', createdOn: date, consentText: 'This is a consent form.........',  },
        { id: '3', name: 'Assessment 1', description: 'This is a description about Assessment 1.', createdOn: date, consentText: 'This is a consent form.........',  },
        { id: '4', name: 'Assessment 1', description: 'This is a description about Assessment 1.', createdOn: date, consentText: 'This is a consent form.........', },
        { id: '5', name: 'Assessment 2', description: 'This is a description about Assessment 2.', createdOn: date, consentText: 'This is a consent form.........',  },
    ]

    useEffect(() => { 
        if(!window.localStorage.getItem("authenticated")){
            router.push('/')
        }
    }, []);

    const handleCreateAssessment = () => {
        const selectedSurveys = getSelectedSurveys(); // array of selected surveys

        // make post request to create survey
    }

    const getSelectedSurveys = () => {
        const selectElement = document.getElementById("surveySelect"); // Replace with the actual ID

        const selectedValues = Array.from(selectElement.selectedOptions).map(
            (option) => option.value
        );

        return selectedValues;
    }

    return (
        <div className="min-h-full bg-gray-50">
            <NavBar page="assessments"/>
            <header className="bg-white shadow ">
                <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome</h1>
                </div>
            </header>
            <main>
                <div className="card bg-base-100 drop-shadow-xl m-5">
                    <div className="card-body">
                        <div className='flex flex-row justify-between'>
                            <h2 className="card-title text-stone-900 text-2xl">Assessments</h2>
                            <button className="shadow-lg w-8 h-8 rounded-full flex items-center cursor-pointer hover:bg-stone-200 hover:shadow" onClick={()=>document.getElementById('create-assessment-modal').showModal()}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-900 mx-auto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                        {!isLoadingSurveyData && <Table page="assessments" data={assessmentData} />}
                        {isLoadingSurveyData && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
                    </div>
                </div>

                {/* Create Assessment Modal */}
                <Modal id="create-assessment-modal">
                    <h3 className="text-stone-900 text-2xl pb-4">Create An Assessment</h3>
                    <input type="text" placeholder="Assessment Name" className="input input-bordered w-full text-md" required />
                    <textarea className="textarea textarea-bordered w-full mt-4" placeholder="Assessment Description..." required ></textarea>
                    <h4 className="text-lg text-stone-600 pt-4 pb-2">Consent Form</h4>
                    <input type="file" className="file-input file-input-bordered file-input-md w-full" />
                    <div className="divider">OR</div>
                    <textarea className="textarea textarea-bordered w-full" placeholder="Consent Form..."></textarea>
                    <h4 className="text-lg text-stone-600 pt-4 pb-2">Surveys</h4>
                    <div className="w-full border-stone-400">
                        <Multiselect data={surveys} />
                    </div>
                    <div className="flex justify-center mt-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button" onClick={handleCreateAssessment}>Create Assessment</button>
                    </div>
                </Modal>
            </main>
        </div>
    )
}
export default Assessments;