"use client";
import React, { useEffect, useState } from "react";
import Table from "../components/Table";
import NavBar from "../components/NavBar";
import Modal from "../components/Modal";
import { MultiSelect } from "react-multi-select-component";
import useSWR from "swr";
import Cookies from "universal-cookie";
import isAuth from '@/app/components/isAuth';

const fetcher = async (url) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return await response.json();
};

const Assessments = () => {
  const { data, error, isLoading } = useSWR(
    "http://localhost:8000/assessment",
    fetcher
  );
  const [surveyData, setSurveyData] = useState([]);
  const [surveysSelected, setSurveysSelected] = useState([]);

  const handleCreateAssessment = async (e) => {
    const surveyIDS = surveysSelected.map((survey) => survey.value);
    const fileInput = document.getElementById("consentForm");
    const file = fileInput.files[0];
    const cookies = new Cookies();

    const assessmentName = e.target.elements.assessmentName.value;
    const assessmentDescription = e.target.elements.assessmentDesc.value;
    const consentText = e.target.elements.consentFormText.value;
    const researcherID = cookies.get("researcherID");
    const formData = new FormData();
    let url;

    formData.append("survey_ids", [...surveyIDS]);

    if (file) {
      // if there is a file
      formData.append("consent_file", file);
      url = `http://localhost:8000/assessment/?name=${assessmentName}&desc=${assessmentDescription}&researcher_id=${researcherID}`;
    } else if (consentText !== "") {
      // if there is consent in the textbox
      url = `http://localhost:8000/assessment/?name=${assessmentName}&desc=${assessmentDescription}&researcher_id=${researcherID}&consent_text=${consentText}`;
    } else {
      // if neither were chose
      e.preventDefault();
      alert("Please provide a consent form, either a file or plain text.");
      return;
    }

    if (file && consentText !== "") {
      // if both the file and box were provided
      e.preventDefault();
      alert(
        "Please fill out only one field for the consent form. Either choose a file or fill out the text box."
      );
      return;
    } else {
      try {
        // make post request to create assessment
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        const responseData = await response.json();
      } catch (error) {
        console.error("Error submitting assessment:", error.message);
      }
    }
  };

  const handleCreateAssessmentModal = async () => {
    document.getElementById("create-assessment-modal").showModal();

    // get survey data
    const response = await fetch("http://localhost:8000/survey", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const responseData = await response.json();

    let surveys = [];
    responseData.forEach((element) => {
      surveys.push({
        label: element.name ? element.name : element.desc,
        value: element._id,
      });
    });

    setSurveyData(surveys);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <NavBar page="assessments" />
      <header className="bg-white shadow ">
        <div className="max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome, {window.localStorage.getItem("firstName")}
          </h1>
        </div>
      </header>
      <main>
        <div className="card bg-base-100 drop-shadow-xl m-5">
          <div className="card-body">
            <div className="flex flex-row justify-between">
              <h2 className="card-title text-stone-900 text-2xl">
                Assessments
              </h2>
              <button
                className="shadow-lg w-8 h-8 rounded-full flex items-center cursor-pointer hover:bg-stone-200 hover:shadow"
                onClick={handleCreateAssessmentModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-stone-900 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            </div>
            {!isLoading && data && <Table page="assessments" data={data} />}
            {!isLoading && !data && "data fetch failed"}
            {isLoading && (
              <div className="flex justify-center">
                <span className="text-stone-900 loading loading-spinner loading-lg"></span>
              </div>
            )}
          </div>
        </div>

        {/* Create Assessment Modal */}
        <Modal id="create-assessment-modal">
          <form onSubmit={handleCreateAssessment}>
            <h3 className="text-stone-900 text-2xl pb-4">
              Create An Assessment
            </h3>
            <input
              id="assessmentName"
              type="text"
              placeholder="Assessment Name"
              className="input input-bordered w-full text-md"
              required
            />
            <textarea
              id="assessmentDesc"
              className="textarea textarea-bordered w-full mt-4"
              placeholder="Assessment Description..."
              required
            ></textarea>
            <h4 className="text-lg text-stone-600 pt-4 pb-2">Consent Form</h4>
            <input
              id="consentForm"
              type="file"
              className="file-input file-input-bordered file-input-md w-full"
            />
            <div className="divider">OR</div>
            <textarea
              id="consentFormText"
              className="textarea textarea-bordered w-full"
              placeholder="Consent Form..."
            ></textarea>
            <h4 className="text-lg text-stone-600 pt-4 pb-2">Surveys</h4>
            <div className="w-full border-stone-400">
              <MultiSelect
                options={surveyData}
                value={surveysSelected}
                onChange={setSurveysSelected}
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Create Assessment
              </button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};
export default isAuth(Assessments);
