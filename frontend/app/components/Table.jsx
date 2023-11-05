import React from 'react'

const Table = (props) => {
    const tableHeaders = {
        "dashboard": ["Participant ID", "Assessment Name", "Status", "Completed On"],
        "assessments": ["Assessment Name", "Assessment Description", "Created On"],
        "participants": ["Participant ID", "Assessment Assigned", "Status", "Completed On"],
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    return (
        <div className="overflow-x-auto">
            <table className="table table-auto">
                {/* head */}
                <thead>
                    <tr>
                        {
                            tableHeaders[props.page].map((header, index)=>{
                                return <th key={index}>{header}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    <tr className="bg-current hover:bg-stone-50">
                        <td className='text-stone-900'>123</td>
                        <td className={props.page=="assessments" ? 'text-stone-900 w-1/2': 'text-stone-900'}>Assessment 1</td>
                        <td className='text-stone-900'><span className="badge badge-ghost bg-green-300 rounded-md">Completed</span></td>

                        {/* Add dates for dashboard and participants page */}
                        {props.page!="assessments" && <td className='text-stone-900'>
                            { formatDate(new Date()) }
                        </td>}

                        {/* Add icons on assessments page */}
                        {props.page=="assessments" && <td className='text-stone-900 flex flex-row justify-around'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 cursor-pointer rounded-full p-1 hover:bg-stone-200">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 cursor-pointer rounded-full p-1 hover:bg-stone-200">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                        </td>}
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table