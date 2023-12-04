import csv

from models.response import AssessmentResponse, AnsweredQuestion


def create_csv_file(assessment_responses: [AssessmentResponse]):
    # TODO do we have to export for a specific duration
    print("total docs:", len(assessment_responses))
    if len(assessment_responses) == 0:
        print("no assessments!")
        return

    # get questions using one assessment response, all assessment responses will have same questions
    questions = list()
    rows = list()

    for assessment_response in assessment_responses:
        _id = assessment_response.get('_id')
        created_on = assessment_response.get('created_on')
        assessment_id = assessment_response.get('assessment_id')
        patient_id = assessment_response.get('patient_id')
        answered_questions = sorted(
            assessment_response.get('data'),
            key=lambda answered_question: answered_question.get('question_id')
        )
        if len(questions) == 0:
            questions = get_questions(answered_questions)
        question_answers = dict()
        for ans in answered_questions:
            question_answers[ans.get('question_text')] = ans.get('answer')

        row = {
            "id": _id,
            "created_on": created_on,
            "assessment_id": assessment_id,
            "patient_id": patient_id,
            **question_answers
        }
        rows.append(row)

    # TODO  what to name the file
    headers = ["id", "created_on", "assessment_id", "patient_id"] + questions
    filename = "assessments.csv"
    with open(filename, "w") as file:
        csv_writer = csv.DictWriter(file, fieldnames=headers)
        csv_writer.writeheader()
        csv_writer.writerows(rows)


def get_questions(answered_questions: [AnsweredQuestion]) -> []:
    questions = list()
    for i in answered_questions:
        questions.append(i.get('question_text'))
    print(questions)
    return questions
