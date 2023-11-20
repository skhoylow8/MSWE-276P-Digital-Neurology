import React from 'react';
import { Label, Slider } from '@qualtrics/ui-react';

const Rating = ({ question }) => {
    const min = parseInt(question.choices[0]);
    const max = parseInt(question.choices[1]);

    return (
        <div className='border-b-2 border-stone-200 rounded-sm p-4'>
            <label>{question.text}</label>
            <Label
                style={{ display: "flex", flexDirection: "column", margin: 10 }}
                id="default"
            >
                <Slider aria-labelledby="default" min={min} max={max} />
            </Label>
        </div>
    )
}

export default Rating