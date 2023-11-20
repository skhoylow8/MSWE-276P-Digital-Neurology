"use client"
import React from 'react';
import NavBar from "../../components/NavBar";
import Modal from '@/app/components/Modal';

const CreateSurvey = () => {

    const handleAddQuestion = (e) => {
        
    }

    return (
        <div className="min-h-full bg-gray-50">
            <NavBar page="surveys"/>
            <header className="bg-white shadow ">
                <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Survey</h1>
                </div>
            </header>
            <main>
                <div className="card bg-base-100 drop-shadow-xl m-5">
                    <div className="card-body">
                        <div className='flex flex-row justify-between'>
                            <h2 className="card-title text-stone-900 text-2xl">Add a Question</h2>
                            <button className="shadow-lg w-8 h-8 rounded-full flex items-center cursor-pointer hover:bg-stone-200 hover:shadow">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-900 mx-auto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                        <div id="questionContainer"></div>

                        {/* Add Question Modal */}
                        <Modal id="add-question-modal">
                            <form  onSubmit={handleAddQuestion}>
                                <h3 className="text-stone-900 text-2xl pb-4">Create An Assessment</h3>
                                <input id="assessmentName" type="text" placeholder="Assessment Name" className="input input-bordered w-full text-md" required />
                                <textarea id="assessmentDesc" className="textarea textarea-bordered w-full mt-4" placeholder="Assessment Description..." required ></textarea>
                                <h4 className="text-lg text-stone-600 pt-4 pb-2">Consent Form</h4>
                                <input id="consentForm" type="file" className="file-input file-input-bordered file-input-md w-full" />
                                <div className="divider">OR</div>
                                <textarea id="consentFormText" className="textarea textarea-bordered w-full" placeholder="Consent Form..."></textarea>
                                <h4 className="text-lg text-stone-600 pt-4 pb-2">Surveys</h4>
                                <div className="w-full border-stone-400">
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">Create Assessment</button>
                                </div>
                            </form>
                        </Modal>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CreateSurvey