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
import isAuth from '@/app/components/isAuth';
import EditableLabel from 'react-inline-editing';
import Cookies from 'universal-cookie';

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

const DuplicateSurvey = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const surveyID = searchParams.get('data')

	const { data, error, isLoading } = useSWR(`http://localhost:8000/survey/${surveyID}`, fetcher)
	const [questionType, setQuestionType] = useState('mc');
	const [questions, setQuestions] = useState([]); 
	const [surveyName, setSurveyName] = useState("");
	const [surveyDesc, setSurveyDesc] = useState("");
	const [counter, setCounter] = useState(0);

	if(!isLoading && counter == 0){
		setQuestions(data.questions);
		setSurveyName(data.name);
		setSurveyDesc(data.desc);
		setCounter(1);
	}

	const handleStateChange = (newState) => {
        setQuestionType(newState);
    };
	
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

	const handleDuplicateSurvey = async () => {
		const cookies = new Cookies();
		const researcherID = cookies.get('researcherID').toString();
		// make post reuqest to create a new survey
		const response = await fetch(`http://localhost:8000/survey`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				"name": surveyName,
				"desc": surveyDesc,
				"questions": questions,
				"researcherId": researcherID,
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
						<h1 className="text-3xl font-bold tracking-tight text-gray-900">Duplicate Survey</h1>
						<p className="text-stone-900">Please remember to save your work before navigating away.</p>
					</div>
				</header>
				<main>
					<div className="card bg-base-100 drop-shadow-xl m-5">
						<div className="card-body text-stone-900">
							<div className='flex flex-row justify-between'>
								<h2 className="card-title text-stone-900 text-2xl">
									<EditableLabel
										text={surveyName}
										onFocusOut={(text) => {
											setSurveyName(text);
										}}
										aria-label="Survey Name"
									/>
								</h2>
								<button className="shadow-lg w-8 h-8 rounded-full flex items-center cursor-pointer hover:bg-stone-200 hover:shadow" onClick={()=>document.getElementById('add-question-modal').showModal()}>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-900 mx-auto">
										<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
									</svg>
								</button>
							</div>
							<EditableLabel
								text={surveyDesc}
								inputWidth='100%'
								onFocusOut={(text) => {
									setSurveyDesc(text);
								}}
								aria-label="Survey Description"
							/>
							<div id="questionContainer">
								{
									questions.map((q, index) => {
										if(q.type == 'mc'){
											return <div key={index}><MultipleChoice question={q} mode="edit" i={index} onStateChange={handleStateChange} /></div>
										} else if(q.type == 'yn'){
											return <div key={index}> <MultipleChoice question={q} mode="edit" i={index} onStateChange={handleStateChange} /> </div>
										} else if(q.type == 'sc'){
											return <div key={index}><Rating question={q} mode="edit" i={index} onStateChange={handleStateChange} /></div>
										} else if(q.type == 'fr'){
											return <div key={index}><FreeResponse question={q} mode="edit" i={index} onStateChange={handleStateChange} /></div>
										} else if(q.type == 'cb'){
											return <div key={index}><CheckBox question={q} mode="edit" i={index} onStateChange={handleStateChange} /></div>
										}
									})
								}
							</div>
							<div className="flex justify-center mt-4">
								<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="button" onClick={handleDuplicateSurvey}>Duplicate Survey</button>
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
									<textarea id="questionChoices" className="textarea textarea-bordered w-full" placeholder="a,b,c,d,e,...">{questionType === 'yn' ? 'Yes,No' : ''}</textarea>
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

export default isAuth(DuplicateSurvey);