# Notion Database Schemas

## Topics

Properties:
- Name: title
- Topic ID: text
- Block: select
- Official Number: number
- Official Text: text
- Short Title: text
- Priority: select High / Medium / Low
- Status: select Not started / In progress / First pass / Reviewed / Exam-ready
- Confidence: number 1-5
- Source URL: url
- Source Ref: text
- Retrieved At: date
- Verification Status: select verified / unverified / needs_review / deprecated
- Last Studied: date
- Next Review: date
- Notes: text

## Questions

Properties:
- Name: title
- Question ID: text
- Type: select multiple_choice / practical_case / formula / flashcard / legal_short_answer
- Source Year: number
- Source Exam: text
- Source URL: url
- Retrieved At: date
- Verification Status: select verified / unverified / needs_review / deprecated
- Question Number: text
- Statement: text
- Options: text
- Correct Answer: text
- Answer Source Status: select official / inferred / user / unknown
- Explanation: text
- Topics: relation to Topics
- Difficulty: select 1 / 2 / 3 / 4 / 5
- Attempts Count: number
- Last Attempt: date
- Next Review: date
- Mistake Type: multi-select concept / formula / units / reading / legal_wording / time_management / none

## Bibliography

Properties:
- Name: title
- Authors: text
- Year: number
- Block: multi-select
- Category: select
- Priority: select Core / Useful / Optional
- Source Type: select AEMET recommended / official / complementary
- Source URL: url
- Verification Status: select verified / unverified / needs_review / deprecated
- Notes: text

## Study Sessions

Properties:
- Name: title
- Planned Start: date
- Planned End: date
- Actual Start: date
- Actual End: date
- Session Type: select deep_topic / questions / practical_case / legal / informatics / flashcards / review / mock_exam
- Objective: text
- Topics: relation to Topics
- Questions: relation to Questions
- Completed: checkbox
- Focus Score: number
- Notes Created: checkbox
- Questions Solved: number
- Flashcards Created: number
- Mistakes Logged: number
- Confidence After: number
- Next Review: date

## Monitoring Sources

Properties:
- Name: title
- URL: url
- Source Type: select BOE / AEMET / AdministracionGob / MITECO / Other
- Keywords: multi-select
- Check Frequency: select weekly / daily / every_2_days / manual
- Last Checked: date
- Last Hash: text
- Last Change: date
- Status: select active / paused / needs_review
- Notes: text
