"use client";
import React, { useState } from 'react';
import { RadioGroup, RadioOption } from '@qualtrics/ui-react';

const MultipleChoice = ({ question, mode, i }) => {
    const [value, setValue] = useState();
    function handleChange(event) {
      setValue(event.target.value);
    }

    const handleEditQuestion = () => {
        document.getElementById('editQuestionTitle').value = question.text;
        document.getElementById('editQuestionChoices').value = question.choices.join(',');
        document.getElementById('editQuestionType').value = question.type;
        document.getElementById('editQuestionIndex').value = i;

        document.getElementById('edit-question-modal').showModal()
    }

    return (
        <div className='border-b-2 border-stone-200 rounded-sm p-4'>
            <RadioGroup label={question.text} name={question.id} value={value} onChange={handleChange}>
                {
                    mode == 'edit' && 
                    <button className="flex justify-end items-center cursor-pointer hover:bg-stone-200 hover:shadow hover:rounded-full" onClick={handleEditQuestion}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 hover:shadow">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                    </button>
                }
                {
                    question.choices.map((c, index) => {
                        return <RadioOption key={index} value={c} label={c}/>
                    })
                }
            </RadioGroup>
        </div>
    )
}

export default MultipleChoice