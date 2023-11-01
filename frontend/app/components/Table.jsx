import React from 'react'

const Table = (props) => {
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
                    <th className='text-stone-900'>1</th>
                    <td className='text-stone-900'>Cy Ganderton</td>
                    <td className='text-stone-900'>Quality Control Specialist</td>
                    <td className='text-stone-900'>Blue</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default Table