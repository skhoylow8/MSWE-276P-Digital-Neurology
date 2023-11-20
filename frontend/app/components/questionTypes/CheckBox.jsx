import React from 'react';
import { CheckboxField, Checkbox } from '@qualtrics/ui-react';

const CheckBox = ({ question }) => {
  return (
    <div className='border-b-2 border-stone-200 rounded-sm p-4'>
        <label>{question.text}</label>
        {
            question.choices.map((c, index) => {
                return <CheckboxField key={index} label={c} />
            })
        }
    </div>
  )
}

export default CheckBox