import React from 'react';
import Modal from "../components/Modal";
import { FormField, RadioGroup, RadioOption } from '@qualtrics/ui-react';

const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const DashboardRow = ({ id, name, status, completedOn }) => {
    return (
        <tr className="bg-white text-stone-900 hover:bg-stone-50" data-id={id}>
            <td>{ id }</td>
            <td>{ name }</td>
            <td><span className={status == 'completed' ? "badge badge-ghost bg-green-300 rounded-md" : "badge badge-ghost bg-yellow-300 rounded-md" }>{ status.charAt(0).toUpperCase() + status.substring(1) }</span></td>
            <td className=''>{ formatDate(completedOn) } </td>
        </tr>
    )
}

const AssessmentRow = ({ id, name, description, createdOn, consentText }) => {
    const handleStartAssessment = (id, consent) => {
        document.getElementById('consentText').textContent = consent; // uses passed on consent text to show on modal
        document.getElementById('start-assessment-modal').setAttribute('data-id', id);
        document.getElementById('start-assessment-modal').showModal();
    }
    
    const handleDownloadCSV = (id) => {
        console.log(id)
        // make get request to download csv with results
    }

    return (
        <tr className="bg-white text-stone-900 hover:bg-stone-50" data-id={id} >
            <td>{ name ? name : 'Unknown' }</td>
            <td className='w-1/2'>{ description ? description : 'Unknown' }</td>
            <td className=''>{ createdOn ? formatDate(new Date(createdOn)) : formatDate(new Date()) } </td>
            <td className='flex flex-row justify-around'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 cursor-pointer rounded-full p-1 hover:bg-stone-200" onClick={() => handleDownloadCSV(id)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 cursor-pointer rounded-full p-1 hover:bg-stone-200" onClick={() => handleStartAssessment(id, consentText)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
            </td>
        </tr>
    )
}

const ParticipantRow = ({ id, name, status, completedOn }) => {
    return (
        <tr className="bg-white text-stone-900 hover:bg-stone-50" data-id={id}>
            <td>{ id }</td>
            <td>{ name }</td>
            <td><span className={status == 'completed' ? "badge badge-ghost bg-green-300 rounded-md" : "badge badge-ghost bg-yellow-300 rounded-md" }>{ status.charAt(0).toUpperCase() + status.substring(1) }</span></td>
            <td className=''>{ formatDate(completedOn) } </td>
        </tr>
    )
}

const Table = ({ page, data }) => {
    const tableHeaders = {
        "dashboard": ["Participant ID", "Assessment Name", "Status", "Completed On"],
        "assessments": ["Assessment Name", "Assessment Description", "Created On"],
        "participants": ["Participant ID", "Assessment Assigned", "Status", "Completed On"],
    };

    const handleStartAssessment = async(e) => {
        e.preventDefault();
        const modal = document.getElementById('start-assessment-modal');
        const assessmentID = modal.dataset.id;

        const consentRes = e.target.elements.consentQ.value;
        const firstName = e.target.elements.firstName.value;
        const lastName = e.target.elements.lastName.value;
        const email = e.target.elements.email.value;
        const patientID = e.target.elements.patientID.value;


        // save patient data if they consent
        if(consentRes == "yes"){
            const response = await fetch('http://localhost:8000/participant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "_id": patientID,
                    "first_name": firstName,
                    "last_name": lastName,
                    "email": email,
                    "assessment_ids": [assessmentID],
                }),
            });
        } else {
            alert("Please see researcher for further instructions.");
            return;
        }

        // get survey questions using id
        const response = await fetch(`http://localhost:8000/assessment/${assessmentID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('token')}`,
            },
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
    
        const responseData = await response.json();
        console.log(responseData)
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-auto">
                {/* head */}
                <thead>
                    <tr>
                        {
                            tableHeaders[page].map((header, index)=>{
                                return <th key={index}>{header}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        page == 'dashboard' && data.length > 0 && data.map((row) => {
                            return <DashboardRow key={row.id} id={row.id} name={row.name} status={row.status} completedOn={row.completedOn} />
                        })
                    }
                    {
                        page == 'assessments' && data.length > 0 && data.map((row, index) => {
                            return <AssessmentRow key={index} id={row._id} name={row.name} description={row.desc} createdOn={row.created_on} consentText={row.consent_text} />
                        })
                    }
                    {
                        page == 'participants' && data.length > 0 && data.map((row) => {
                            return <ParticipantRow key={row.participantID} id={row.participantID} name={row.assessmentName} status={row.status} completedOn={row.completedOn} />
                        })
                    }
                </tbody>
            </table>
            {/* Start Assessment Modal */}
            <Modal id="start-assessment-modal">
                <form onSubmit={handleStartAssessment}>
                    <h3 className="text-stone-900 text-2xl pb-4">Pre Screening Questionaire</h3>
                    <FormField
                        // helperText="This is helper text"
                        // errorText="This is an error message"
                        id='consentFormQ'
                        className='pb-4'
                    >
                        <RadioGroup label="Do you consent to completing this assessment?" name="consentQ" defaultValue="1">
                            <RadioOption value="yes" label="Yes" />
                            <RadioOption value="no" label="No" />
                        </RadioGroup>
                    </FormField>
                    <textarea id="consentText" className='textarea textarea-bordered textarea-sm w-full' rows={5} disabled></textarea>
                    <input type="text" id="patientID" placeholder="Patient ID" className="input input-bordered w-full text-md my-1" required />
                    <input type="text" id="firstName" placeholder="First Name" className="input input-bordered w-full text-md my-1" required />
                    <input type="text" id="lastName" placeholder="Last Name" className="input input-bordered w-full text-md my-1" required />
                    <input type="text" id="email" placeholder="Email" className="input input-bordered w-full text-md my-1" required />
                    <div className="flex justify-center mt-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">Start Assessment</button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Table