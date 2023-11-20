"use client";
import React, { useState } from 'react';
import { RadioGroup, RadioOption } from '@qualtrics/ui-react';

const MultipleChoice = ({ question }) => {
    const [value, setValue] = useState();
    function handleChange(event) {
      setValue(event.target.value);
    }

    return (
        <div className='border-b-2 border-stone-200 rounded-sm p-4'>
            <RadioGroup label={question.text} name={question.id} value={value} onChange={handleChange}>
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