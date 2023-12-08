import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import { FormField, RadioGroup, RadioOption } from "@qualtrics/ui-react";
import { useRouter, redirect } from "next/navigation";
import Cookies from "universal-cookie";

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DashboardRow = ({ id, name, status, completedOn }) => {
  return (
    <tr className="bg-white text-stone-900 hover:bg-stone-50" data-id={id}>
      <td>{id}</td>
      <td>{name}</td>
      <td>
        <span
          className={
            status == "completed"
              ? "badge badge-ghost bg-green-300 rounded-md"
              : "badge badge-ghost bg-yellow-300 rounded-md"
          }
        >
          {status.charAt(0).toUpperCase() + status.substring(1)}
        </span>
      </td>
      <td className="">{formatDate(completedOn)} </td>
    </tr>
  );
};

const AssessmentRow = ({ id, name, description, createdOn, consentText }) => {
  // useEffect(() => {
  //   const downloadButton = document.getElementById('downloadCSV_' + id);

  //   fetch(`http://localhost:8000/response/download/${id}`, {
  //           method: "GET",
  //           headers: {
  //               "Content-Type": "application/json",
  //           },
  //       })
  //       .then(response => {
  //           if (!response.ok) {
  //               alert("Failed to download file");
  //               throw new Error("Failed to download file");
  //           }
  //           console.log(response.headers)
  //           return response.blob();
  //       })
  //       .then(blob => {
  //         console.log(blob)
  //           // Convert response to Blob
  //           const blobUrl = URL.createObjectURL(blob);

  //           let parent = downloadButton.parentNode;

  //           // Create a downloadable link
  //           const downloadLink = document.createElement('a');
  //           downloadLink.href = blobUrl;
  //           downloadLink.click();

  //           // set the wrapper as child (instead of the element)
  //           parent.replaceChild(downloadLink, downloadButton);
  //           // set element as child of wrapper
  //           downloadLink.appendChild(downloadButton);
  //       })
  //       .catch((error) => {
  //         console.error('Error downloading CSV:', error)
  //       });
  // }, []);

  const handleStartAssessment = (id, consent) => {
    document.getElementById("consentText").textContent = consent; // uses passed on consent text to show on modal
    document
      .getElementById("start-assessment-modal")
      .setAttribute("data-id", id);
    document.getElementById("start-assessment-modal").showModal();
  };

  const handleDownloadAssessment = async(id) => {
    try {
      const response = await fetch(`http://localhost:8000/response/download/${id}`,{
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (response.ok) {
        // Get the content disposition from the response headers
        const contentDisposition = response.headers.get('content-disposition');
        
        // Extracting the filename from the content disposition header
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        let filename = 'downloaded_assessments_file.csv';
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
        console.log(filename)

        // Create a blob from the response data
        const blob = await response.blob();
        console.log(blob)

        // Create a temporary URL to the blob
        const url = window.URL.createObjectURL(blob);

        // Create a link element and click it to initiate the download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();

        // Clean up: remove the link and revoke the URL object
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else if(response.status == 400){
        alert("No responses found for this assessment.");
      } else {
        console.error('File download failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <tr className="bg-white text-stone-900 hover:bg-stone-50" data-id={id}>
      <td>{name ? name : "Unknown"}</td>
      <td className="w-1/2">{description ? description : "Unknown"}</td>
      <td className="">
        {createdOn ? formatDate(new Date(createdOn)) : formatDate(new Date())}{" "}
      </td>
      <td className="flex flex-row justify-around">
        <svg
          id={'downloadCSV_' + id}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7 cursor-pointer rounded-full p-1 hover:bg-stone-200"
          onClick={() => handleDownloadAssessment(id)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7 cursor-pointer rounded-full p-1 hover:bg-stone-200"
          onClick={() => handleStartAssessment(id, consentText)}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
          />
        </svg>
      </td>
    </tr>
  );
};

const ParticipantRow = ({ patientID, assessmentName, createdOn }) => {
  return (
    <tr className="bg-white text-stone-900 hover:bg-stone-50">
      <td>{ patientID }</td>
      <td>{ assessmentName }</td>
      <td><span className="badge badge-ghost bg-green-300 rounded-md">Completed</span></td>
      <td className=''>{ formatDate(new Date(createdOn)) } </td>
    </tr>
  )
}

const SurveyRow = ({ id, name, description, createdOn, totalNumOfQ, researcherID }) => {
    const router = useRouter();
    const cookies = new Cookies(); 

    const handleEditSurvey = () => {
        router.push(`/surveys/edit?data=${id}`)
    }

    const handleDuplicateSurvey = () => {
        router.push(`/surveys/duplicate?data=${id}`)
    }

    const handleViewSurvey = () => {
        router.push(`/surveys/view?data=${id}`);
    }

    return (
        <tr className="bg-white text-stone-900 hover:bg-stone-50" data-id={id}>
            <td>{ name ? name : 'Unknown' }</td>
            <td className='w-1/2'>{ description ? description : 'Unknown' }</td>
            <td>{ totalNumOfQ ? totalNumOfQ : 0 }</td>
            <td>{ createdOn ? formatDate(new Date(createdOn)) : formatDate(new Date()) } </td>
            <td className='flex flex-row justify-around'>
            {
                researcherID == cookies.get('researcherID') &&
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 cursor-pointer rounded-full p-1 hover:bg-stone-200" aria-labelledby='Edit Survey' onClick={handleEditSurvey}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            } 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 cursor-pointer rounded-full p-1 hover:bg-stone-200" aria-labelledby='Duplicate Survey' onClick={handleDuplicateSurvey}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 cursor-pointer rounded-full p-1 hover:bg-stone-200" aria-labelledby='View Survey' onClick={handleViewSurvey}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </td>
        </tr>
    )
}

const Table = ({ page, data }) => {
  const tableHeaders = {
    "dashboard": ["Participant ID", "Assessment Name", "Status", "Completed On"],
    "assessments": ["Assessment Name", "Assessment Description", "Created On"],
    "participants": ["Participant ID", "Assessment Assigned", "Status", "Completed On"],
    "surveys": ["Survey Name", "Survey Description", "Number of Questions", "Created On"],
  };

  const router = useRouter();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleStartAssessment = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    const modal = document.getElementById("start-assessment-modal");
    const assessmentID = modal.dataset.id;

    const consentRes = e.target.elements.consentQ.value;
    const firstName = e.target.elements.firstName.value;
    const lastName = e.target.elements.lastName.value;
    const email = e.target.elements.email.value;

    // save patient data if they consent
    if (consentRes == "yes") {
      const response = await fetch("http://localhost:8000/participant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          assessment_ids: [assessmentID],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();
      const patientID = responseData._id;

      window.open(
        `assessments/start?data=${encodeURIComponent(
          assessmentID + "_" + patientID
        )}`, "Assessment"
      );

      modal.close();
      setIsButtonDisabled(false);
    } else {
      alert("Please see researcher for further instructions.");
      setIsButtonDisabled(false);
      return;
    }
  };

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
                        page == 'dashboard' && data !== undefined && data.length > 0 && data.map((row) => {
                            return <DashboardRow key={row.id} id={row.id} name={row.name} status={row.status} completedOn={row.completedOn} />
                        })
                    }
                    {
                        page == 'assessments' && data !== undefined && data.length > 0 && data.map((row, index) => {
                            return <AssessmentRow key={index} id={row._id} name={row.name} description={row.desc} createdOn={row.created_on} consentText={row.consent_text} />
                        })
                    }
                    {
                        page == 'participants' && data !== undefined && data.length > 0 && data.map((row, index) => {
                            return <ParticipantRow key={index} patientID={row.patient_id} assessmentName={row.assessment_name} createdOn={row.created_on} />
                        })
                    }
                    {
                        page == 'surveys' && data !== undefined && data.length > 0 && data.map((row, index) => {
                            return <SurveyRow key={index} id={row._id} name={row.name} description={row.desc} createdOn={row.created_on} totalNumOfQ={row.questions.length} researcherID={row.researcherId} />
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
                    {/* <input type="text" id="patientID" placeholder="Patient ID" className="input input-bordered w-full text-md my-1" required /> */}
                    <input type="text" id="firstName" placeholder="First Name" className="input input-bordered w-full text-md my-1" required />
                    <input type="text" id="lastName" placeholder="Last Name" className="input input-bordered w-full text-md my-1" required />
                    <input type="text" id="email" placeholder="Email" className="input input-bordered w-full text-md my-1" required />
                    <div className="flex justify-center mt-4">
                        {isButtonDisabled && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit" disabled >
                            <div className='flex justify-center'><span className="text-white-900 loading loading-spinner loading-md"></span></div>
                          </button>}
                        {!isButtonDisabled && <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" type="submit">
                            Start Assessment
                          </button>}
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default Table;
