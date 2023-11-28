import React from 'react'

const FreeResponse = ({ question, mode, i, onStateChange }) => {
  const handleEditQuestion = () => {
    document.getElementById('editQuestionTitle').value = question.text;
    document.getElementById('editQuestionChoices').value = question.choices.join(',');
    document.getElementById('editQuestionType').value = question.type;
    onStateChange(question.type);
    document.getElementById('editQuestionIndex').value = i;

    document.getElementById('edit-question-modal').showModal()
  }

  return (
    <div className='border-b-2 border-stone-200 rounded-sm p-4'>
        <div className='flex flex-row justify-between'>
            <label>{question.text}</label>
            {
                mode == 'edit' && 
                <button className="flex items-center cursor-pointer hover:bg-stone-200 hover:shadow hover:rounded-full" onClick={handleEditQuestion}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 hover:shadow">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                </button>
            }
        </div>
        <textarea className="textarea textarea-bordered w-full mt-4" placeholder="Response to question..." ></textarea>
    </div>
  )
}

export default FreeResponse