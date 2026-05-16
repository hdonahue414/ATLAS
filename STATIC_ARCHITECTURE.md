# Static Architecture v13

This project is permanently static.

## What that means

No backend.
No database.
No live web ingestion.
No automatic scraping.
No serverless functions.
No hidden data refresh.

The dashboard consists of:
- `index.html`
- `data.json`
- documentation files

## Update workflow

1. Find new evidence manually.
2. Classify it by evidence type.
3. Decide which variables it affects.
4. Update `data.json`.
5. Keep inference notes separate from verified facts.
6. Keep confidence capped by evidence quality.
7. Replace the old project files.

## Inference policy

Inference is allowed and expected.

But:
- direct facts must be labeled as direct facts
- inferred claims must be labeled as structured inference
- single anecdotes must remain low-confidence
- placeholders must remain visibly speculative

## What this model is

A static, transparent, evidence-weighted decision and forecasting framework.

## What this model is not

It is not an autonomous AI agent.
It is not a live research crawler.
It is not a validated predictive instrument.
It is not a substitute for calls, visits, direct testimony, or funding letters.
