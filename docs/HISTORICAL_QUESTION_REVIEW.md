# Historical question review workflow

OCR and PDF text extraction are only candidate transcriptions. A historical question is marked `verified` only after its statement and every option have been visually compared with the official source PDF.

## Source crop

Render an official PDF page at 300 DPI, crop the complete question and upload the crop as private provenance. Coordinates are pixel coordinates in that 300-DPI render.

```bash
npm --prefix apps/web run render:question-source-crop -- \
  --question-id aemet-a1-acceso-libre-primer-ejercicio-2016-14 \
  --pdf /absolute/path/to/2016-questions.pdf \
  --page 5 --x 120 --y 180 --width 2200 --height 1450 --needs-review
```

First add `--dry-run` to inspect the crop hash and dimensions without writing to Supabase. The command prefers `pdftocairo` and automatically falls back to ImageMagick/Ghostscript when Poppler cannot write PNG; it never generates or reconstructs an image with AI.

## Reviewed transcription

After comparing the crop to the official PDF, create a JSON file such as:

```json
{
  "statement": "Sea \\(x^2 = 1\\). ¿Cuál es la opción correcta?",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correctAnswer": "A",
  "contentFormat": "latex",
  "visualReviewConfirmed": true
}
```

Use `plain_text` when no mathematical rendering is required. LaTeX is limited to reviewer-authored `\\(...\\)` inline and `\\[...\\]` block notation; raw extracted text is retained in `raw_statement` and `raw_options`.

```bash
npm --prefix apps/web run apply:reviewed-question-text -- \
  --question-id aemet-a1-acceso-libre-primer-ejercicio-2016-14 \
  --review-file /absolute/path/to/review.json
```

The command accepts exactly three or four non-empty options, requires the definitive official answer letter, and rejects every review without a verified official source crop. It then sets the question to `verified`, makes its disposition available, and records statement, option and answer review timestamps.

## Learner-facing behavior

- `needs_review` questions are quarantined from learner-facing practice and the question bank until they are source-reviewed.
- Reviewed formula text renders with KaTeX and remains selectable/searchable.
- When a crop is available, learners can open it from the question. Crops are stored in the private `official-question-source-images` bucket and are served with short-lived URLs.

Run `npm --prefix apps/web run quarantine:historical-question-extraction` after an audit to mark every flagged record `needs_review`; it never changes statements, options, answer keys, or user progress.
