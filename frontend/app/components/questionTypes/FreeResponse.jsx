import React from 'react'

const FreeResponse = ({ question }) => {
  return (
    <div className='border-b-2 border-stone-200 rounded-sm p-4'>
        <label>{question.text}</label>
        <textarea className="textarea textarea-bordered w-full mt-4" placeholder="Response to question..." ></textarea>
    </div>
  )
}

export default FreeResponse