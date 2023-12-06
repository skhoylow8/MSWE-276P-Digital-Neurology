import csv
import datetime
from io import StringIO

from models.response import AssessmentResponse, AnsweredQuestion


def create_csv_data(assessment_responses: [AssessmentResponse]):
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

    headers = ["id", "created_on", "assessment_id", "patient_id"] + questions

    output = StringIO()

    csv_writer = csv.DictWriter(output, fieldnames=headers)
    csv_writer.writeheader()
    csv_writer.writerows(rows)

    return output.getvalue()


def get_questions(answered_questions: [AnsweredQuestion]) -> []:
    questions = list()
    for i in answered_questions:
        questions.append(i.get('question_text'))
    return questions
