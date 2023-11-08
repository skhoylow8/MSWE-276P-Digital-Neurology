'use client';

import React from 'react';
import { FormField, RadioGroup, RadioOption } from '@qualtrics/ui-react';

const ConsentQuestion = () => {
  return (
    <FormField
        // helperText="This is helper text"
        // errorText="This is an error message"
        id='consent-form-q'
        className='pb-4'
    >
        <RadioGroup label="Do you consent to completing this assessment?" name="consentQ" defaultValue="1">
            <RadioOption value="1" label="Yes" />
            <RadioOption value="2" label="No" />
        </RadioGroup>
    </FormField>
  )
}

export default ConsentQuestion