# BOE/AEMET Monitoring

## Goal

Detect official changes relevant to AEMET A1 opposition preparation.

## Current implementation status

Implemented:
- Read-only monitoring dashboard skeleton.
- Local placeholder source checklist.
- Local placeholder review queue.
- Domain helpers for configured/active source counts and pending review events.
- Source verification readiness queue.

Not implemented:
- Network polling.
- Scraping.
- Snapshot comparison.
- Alert delivery.
- Official source URL verification.
- Official event detection.

The app must continue to describe monitoring as manual-only until automated checks
exist and tests verify them.

## Source verification readiness

A source is not ready for automation unless all of the following are true:

- Source URL is not `TODO_VERIFY_OFFICIAL_SOURCE`.
- `verification_status` is `verified`.
- `last_verified_at` is recorded.
- `verified_by` is recorded.
- Expected official signals are recorded.

These rules only make a source ready for future automation. They do not by
themselves mean polling, scraping, detection or alerts are active.

## Sources

Initial official sources:
- BOE search/alerts
- AEMET Grupo A1 acceso libre page
- AEMET Grupo A1 convocatorias anteriores page
- AEMET empleo público pages

## Keywords

- Cuerpo Superior de Meteorólogos del Estado
- Meteorólogos del Estado
- AEMET
- Agencia Estatal de Meteorología
- código 1400
- acceso libre
- convocatoria
- admitidos
- excluidos
- plantilla
- tribunal
- ejercicio
- curso selectivo

## Monitoring states

- waiting_for_oep
- waiting_for_convocatoria
- application_open
- application_submitted
- waiting_for_admitidos
- exam_scheduled
- post_exam
- completed

## Event types

- possible_oep
- convocatoria_detected
- application_deadline_detected
- admitidos_list_detected
- exam_date_detected
- answer_template_detected
- results_detected
- bibliography_update
- past_exam_update
- generic_change

## Rule

The app must not claim a change is official unless the source is official and stored.
