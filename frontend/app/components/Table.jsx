import React from 'react'

const Table = (props) => {
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th>Participant Name</th>
                        <th>Assessment Name</th>
                        <th>Status</th>
                        <th>Completed On</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    <tr className="bg-current hover:bg-stone-50">
                        <td className='text-stone-900'>Jane Doe</td>
                        <td className='text-stone-900'>Assessment 1</td>
                        <td className='text-stone-900'><span className="badge badge-ghost bg-green-300 rounded-md">Completed</span></td>
                        <td className='text-stone-900'>{formatDate(new Date())}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Table