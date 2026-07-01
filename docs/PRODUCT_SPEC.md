# Product Specification

## Product name

AEMET A1 Trainer

## Goal

Help the candidate prepare for Grupo A1 – Cuerpo Superior de Meteorólogos del Estado through structured study, official topic tracking, question practice, calendar planning, focus support and official monitoring.

## MVP features

1. Dashboard
2. Topic checklist
3. Topic detail page
4. Question bank
5. Focus mode
6. Calendar planner
7. Countdown component
8. Monitoring status page
9. Settings page

## Dashboard

Show:
- Today’s study mission
- Countdown status
- Weekly study hours
- Topic progress
- Weak topics
- Next review items
- Monitoring status

Current MVP direction:
- The dashboard is the first daily-use screen.
- It combines the next actionable focus session, weak topics, overdue questions,
  and monitoring readiness.
- Signed-in users see saved Supabase session and progress overlays where
  implemented.
- Anonymous users may use local fallback data, clearly separated from official
  claims.

## Topic checklist

Show:
- block
- official number
- short title
- status
- confidence
- priority
- next review date

Statuses:
- not_started
- in_progress
- first_pass
- reviewed
- exam_ready

## Question bank

Question types:
- multiple_choice
- practical_case
- formula
- flashcard
- legal_short_answer

## Focus mode

A session has:
- objective
- topic
- duration
- timer
- session notes
- output checklist
- confidence score
- next review date

## Countdown

Must support:
- next OEP estimate
- BOE convocatoria
- application deadline
- first exercise
- next mock exam
- weekly study target

Do not assume official dates.

## Monitoring

Initial MVP may be manual status only.
Later version checks BOE/AEMET official pages and stores snapshots.
