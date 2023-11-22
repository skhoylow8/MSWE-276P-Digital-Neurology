"use client";
import React, { useState } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from 'swr'; 
import NavBar from '@/app/components/NavBar';
import MultipleChoice from '@/app/components/questionTypes/MultipleChoice';
import FreeResponse from '@/app/components/questionTypes/FreeResponse';
import Rating from '@/app/components/questionTypes/Rating';
import CheckBox from '@/app/components/questionTypes/CheckBox';
import Modal from '@/app/components/Modal';

const fetcher = async (url) => {
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

    return await response.json();
}

const EditSurvey = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const surveyID = searchParams.get('data')

    const { data, error, isLoading } = useSWR(`http://localhost:8000/survey/${surveyID}`, fetcher)
    const [questionType, setQuestionType] = useState('mc');
    const [questions, setQuestions] = useState([]); 
    const [counter, setCounter] = useState(0);

    if(!isLoading && counter == 0){
        setQuestions(data.questions)
        setCounter(1);
    }

    const handleAddQuestion = (e) => {
        e.preventDefault()
        const question = e.target.elements.questionTitle.value;
        const questionChoices = e.target.elements.questionChoices.value.split(",");

        setQuestions([...questions, {
            'text': question,
            'type': questionType,
            'choices': questionChoices,
        }])

        document.getElementById('add-question-modal').close();
    }

    const handleEditQuestion = (e) => {
        e.preventDefault()
        const question = e.target.elements.editQuestionTitle.value;
        const questionChoices = e.target.elements.editQuestionChoices.value.split(",");
        const index = e.target.elements.editQuestionIndex.value;

        const tempQuestions = questions;
        tempQuestions[index] = {
            'text': question,
            'type': questionType,
            'choices': questionChoices,
        }
        setQuestions([...tempQuestions])

        document.getElementById('edit-question-modal').close();
    }

    const handleUpdateSurvey = async () => {
        // make put reuqest to update survey
        const response = await fetch(`http://localhost:8000/survey/${surveyID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                "name": data.name,
                "desc": data.desc,
                "questions": questions,
                "researcherId": window.localStorage.getItem('researcherID'),
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        router.push('/surveys');
    }

    return (
        <>
        {isLoading && <div className='flex justify-center'><span className="text-stone-900 loading loading-spinner loading-lg"></span></div>}
        {!isLoading && 
            <div className="min-h-full bg-gray-50">
                <NavBar page="surveys"/>
                <header className="bg-white shadow ">
                    <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Survey</h1>
                    </div>
                </header>
                <main>
                    <div className="card bg-base-100 drop-shadow-xl m-5">
                        <div className="card-body text-stone-900">
                            <div className='flex flex-row justify-between'>
                                <h2 className="card-title text-stone-900 text-2xl">{data.name}</h2>
                                <button className="shadow-lg w-8 h-8 rounded-full flex items-center cursor-pointer hover:bg-stone-200 hover:shadow" onClick={()=>document.getElementById('add-question-modal').showModal()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-900 mx-auto">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                            <p>{data.desc}</p>
                            <div id="questionContainer">
                                {
                                    questions.map((q, index) => {
                                        if(q.type == 'mc'){
                                            return <div key={index}><MultipleChoice question={q} mode="edit" i={index} /></div>
                                        } else if(q.type == 'yn'){
                                            return <div key={index}> <MultipleChoice question={q} mode="edit" i={index} /> </div>
                                        } else if(q.type == 'sc'){
                                            return <div key={index}><Rating question={q} mode="edit" i={index} /></div>
                                        } else if(q.type == 'fr'){
                                            return <div key={index}><FreeResponse question={q} mode="edit" i={index} /></div>
                                        } else if(q.type == 'cb'){
                                            return <div key={index}><CheckBox question={q} mode="edit" i={index} /></div>
                                        }
                                    })
                                }
                            </div>
                            <div className="flex justify-center mt-4">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button" onClick={handleUpdateSurvey}>Update Survey</button>
                            </div>

                            {/* Add Question Modal */}
                            <Modal id="add-question-modal">
                                <form onSubmit={handleAddQuestion}>
                                    <h3 className="text-stone-900 text-2xl pb-4">Add A Question</h3>
                                    <label>Question</label>
                                    <input id="questionTitle" type="text" placeholder="Question" className="input input-bordered w-full text-md mb-3" required />
                                    <label>Question Type</label>
                                    <select 
                                        className="select select-bordered w-full mb-3"
                                        value={questionType}
                                        onChange={(e) => setQuestionType(e.target.value)}
                                    >
                                        <option value='mc'>Multiple Choice</option>
                                        <option value='yn'>Yes or No</option>
                                        <option value='cb'>Check Box</option>
                                        <option value='fr'>Free Response</option>
                                        <option value='sc'>Scale</option>
                                    </select>
                                    <label>Choices</label>
                                    <p className='text-xs pb-1'>Please type in the possible choices for the question separated by commas.</p>
                                    <textarea id="questionChoices" className="textarea textarea-bordered w-full" placeholder="a,b,c,d,e,..."></textarea>
                                    <div className="flex justify-center mt-4">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">Add Question</button>
                                    </div>
                                </form>
                            </Modal>

                            {/* Edit Question Modal */}
                            <Modal id="edit-question-modal">
                                <form onSubmit={handleEditQuestion}>
                                    <h3 className="text-stone-900 text-2xl pb-4">Edit Question</h3>
                                    <input id="editQuestionIndex" type="hidden" />
                                    <label>Question</label>
                                    <input id="editQuestionTitle" type="text" placeholder="Question" className="input input-bordered w-full text-md mb-3" required />
                                    <label>Question Type</label>
                                    <select 
                                        className="select select-bordered w-full mb-3"
                                        id="editQuestionType"
                                        value={questionType}
                                        onChange={(e) => setQuestionType(e.target.value)}
                                    >
                                        <option value='mc'>Multiple Choice</option>
                                        <option value='yn'>Yes or No</option>
                                        <option value='cb'>Check Box</option>
                                        <option value='fr'>Free Response</option>
                                        <option value='sc'>Scale</option>
                                    </select>
                                    <label>Choices</label>
                                    <p className='text-xs pb-1'>Please type in the possible choices for the question separated by commas.</p>
                                    <textarea id="editQuestionChoices" className="textarea textarea-bordered w-full" placeholder="a,b,c,d,e,..."></textarea>
                                    <div className="flex justify-center mt-4">
                                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">Update Question</button>
                                    </div>
                                </form>
                            </Modal>
                        </div>
                    </div>
                </main>
            </div>
        }
        </>
    )
}

export default EditSurvey;

{/* <div className="card bg-base-100 drop-shadow-xl m-5">
                        <div className="card-body  text-stone-900">
                            <div className='flex flex-row justify-between'>
                                <h2 className="card-title text-2xl">{data.name}</h2>
                                <button className="shadow-lg w-8 h-8 rounded-full flex items-center cursor-pointer hover:bg-stone-200 hover:shadow">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-900 mx-auto">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
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
                    </div> */}