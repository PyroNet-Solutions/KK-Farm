# Goat Photographs & Media Pipeline

**Status:** Proposed design (D-020 confirms photos as a first-class part of each goat's identity). Library/storage versions are chosen in [TECHNOLOGY_EVALUATION.md](TECHNOLOGY_EVALUATION.md).

## 1. Requirements (owner direction, 2026-11-07)

| ID | Requirement | Status |
|----|-------------|--------|
| PH-1 | Every goat has a main profile picture. | `[CONFIRMED]` |
| PH-2 | Multiple photographs in a gallery per goat. | `[CONFIRMED]` |
| PH-3 | Upload from a mobile phone's gallery. | `[CONFIRMED]` |
| PH-4 | Capture directly with the phone camera. | `[CONFIRMED]` |
| PH-5 | Photograph history with upload date and notes. | `[CONFIRMED]` |
| PH-6 | Photo clearly visible in search results, dashboards, lists and profile. | `[CONFIRMED]` |
| PH-7 | Optimised thumbnails and responsive images; WebP/AVIF where supported. | `[CONFIRMED]` |
| PH-8 | Originals stored safely; thumbnails generated; **no large binaries in the relational database**. | `[CONFIRMED]` |
| PH-9 | Photos remain attached to the permanent **animal identity**, never to the RFID tag. | `[CONFIRMED]` |
| PH-10 | Photos are never hard-deleted (soft-hide only), consistent with BC-6. | `[ASSUMED]` → Q-PH-1 |
| PH-11 | Photo context tags (profile, left side, right side, udder, hoof, injury, sale listing) to make galleries useful to vets and buyers. | `[ASSUMED]` → Q-PH-2 |

## 2. Data model

```sql
CREATE TABLE media_files (
  id             uuid PRIMARY KEY,
  storage_key    text NOT NULL UNIQUE,        -- object-storage path of the ORIGINAL
  mime           text NOT NULL, bytes bigint NOT NULL,
  width int, height int, sha256 text NOT NULL,
  captured_at    timestamptz,                 -- from EXIF if present
  uploaded_by    uuid NOT NULL, uploaded_at timestamptz NOT NULL DEFAULT now(),
  device_id      text,
  status         text NOT NULL DEFAULT 'pending',   -- pending | ready | failed
  access_domain  text NOT NULL                       -- animal | finance | ops
);

CREATE TABLE media_variants (
  file_id uuid NOT NULL REFERENCES media_files(id),
  variant text NOT NULL,                      -- avatar_96 | card_480 | profile_1024 | full_2048
  format  text NOT NULL,                      -- webp | avif | jpeg
  storage_key text NOT NULL UNIQUE, width int, height int, bytes int,
  PRIMARY KEY (file_id, variant, format)
);

CREATE TABLE animal_photos (
  id            uuid PRIMARY KEY,
  animal_id     uuid NOT NULL REFERENCES animals(id),   -- PH-9: tied to identity, never to tag
  file_id       uuid NOT NULL REFERENCES media_files(id),
  taken_at      timestamptz,                 -- captured_at or user-entered
  notes         text,
  context_tags  text[],                       -- PH-11
  is_profile    boolean NOT NULL DEFAULT false,
  sort_order    int,
  added_by      uuid NOT NULL, added_at timestamptz NOT NULL DEFAULT now(),
  hidden_at     timestamptz, hidden_by uuid, hidden_reason text   -- PH-10 soft-hide
);
CREATE UNIQUE INDEX one_profile_photo_per_animal ON animal_photos(animal_id) WHERE is_profile AND hidden_at IS NULL;
CREATE INDEX ON animal_photos (animal_id, taken_at DESC) WHERE hidden_at IS NULL;
```

`animals.profile_photo_id` is a convenience pointer maintained by the service (denormalised for list queries).

## 3. Upload flow (mobile)

```
Phone                              API                           Object storage          Worker
 │ pick/capture photo               │                               │                      │
 │ client-side resize ≤ 2048 px,    │                               │                      │
 │ fix EXIF orientation, ~300–500kB │                               │                      │
 │── POST /media/uploads ──────────►│ create media_files(pending)   │                      │
 │◄── {file_id, upload_url} ────────│ (pre-signed PUT, 10 min)      │                      │
 │── PUT bytes ────────────────────────────────────────────────────►│                      │
 │── POST /animals/{id}/photos {file_id, notes, tags} ─────────────►│                      │
 │                                  │ verify object exists + sha256 │                      │
 │                                  │ insert animal_photos (txn)    │                      │
 │                                  │ enqueue variants job ─────────────────────────────►  │
 │◄── 201 {photo} (original URL, placeholder for variants) ─────────│                      │
 │                                  │                               │◄── write variants ───│
 │◄── realtime "photo.ready" ───────│◄──────────────────────────────── mark ready ─────────│
```

Rules:
- **Atomicity (R-6):** the `animal_photos` row is only written after the object is verified. If verification fails → `media_files.status='failed'`, no photo row, no profile change; the client can retry with the same `file_id` (idempotent).
- **Direct-to-storage upload** keeps large bytes off the API process and the database (PH-8). If the storage choice has no pre-signed URLs, the API streams to storage without buffering to disk.
- **Client-side resize** saves 4G bandwidth and battery; the original *as uploaded* (≤ 2048 px) is kept as the master. (Decision: do we also keep the full-resolution original? → Q-PH-3; it costs storage and upload time for little farm benefit.)
- **Orphan sweep:** a nightly job deletes `pending` objects older than 24 h with no `animal_photos` reference.

## 4. Processing

| Variant | Size (long edge) | Formats | Use |
|---------|------------------|---------|-----|
| `avatar_96` | 96 px, square-cropped (face-centred by default crop, manual focal point later) | WebP + JPEG | lists, search results, activity feed |
| `card_480` | 480 px | WebP + AVIF + JPEG | animal cards, dashboards |
| `profile_1024` | 1024 px | WebP + AVIF + JPEG | profile hero, gallery |
| `full_2048` | 2048 px | WebP + JPEG | gallery zoom |

- Generated asynchronously by a worker using libvips-class tooling; EXIF stripped from variants (GPS removed), orientation applied, colour profile normalised to sRGB.
- Until variants exist, the client shows the master image scaled with a blur-up placeholder (dominant colour stored in `media_files`).
- Formats: AVIF offered first where the WebView/browser supports it, WebP second, JPEG always (see support summary in TECHNOLOGY_EVALUATION).

## 5. Serving

- Variants are served through the reverse proxy from object storage with **immutable, content-hashed URLs** and `Cache-Control: public, max-age=31536000` — but behind an **authenticated, permission-checked signed URL** (short-lived) because animal photos are farm data, not public assets. Finance attachments use the `finance` access domain and are never cacheable by shared caches.
- Responsive markup: `<picture>` with AVIF/WebP sources and `srcset` by width; `width`/`height` attributes reserved to keep CLS ≤ 0.1; lazy-loaded below the fold; profile hero preloaded.
- Thumbnails must meet the weight targets in [PERFORMANCE_ACCEPTANCE_CRITERIA.md](PERFORMANCE_ACCEPTANCE_CRITERIA.md) §2.4.

## 6. Storage and backup

- S3-compatible object storage on the VM (choice and its licence/maintenance status in TECHNOLOGY_EVALUATION), in a **dedicated bucket per application** (livestock vs. website) with separate credentials.
- Bucket layout: `animals/{animal_id}/{file_id}/original.jpg`, `.../variants/{variant}.{fmt}` — keyed by **animal id**, so a tag reassignment never touches storage (PH-9).
- Backups: nightly `rclone`/`restic`-class incremental copy of the bucket to a second location; restore drill quarterly; originals are immutable (versioned bucket if supported).
- Retention: never deleted while the animal record exists (forever); hidden photos remain in storage.

## 7. Validation and safety

- Accept only JPEG/PNG/HEIC/WebP; re-encode everything server-side (defeats polyglot files); max 15 MB per upload; dimension sanity check.
- Virus/magic-byte check on the worker.
- Rate limit uploads per user; quota alerts per bucket.
- Access: `animal.read` to view; `animal.photo.write` to add; `animal.photo.hide` for manager/CEO.

## 8. UX notes (premium direction)

- Capture flow: scan goat → "Add photo" → camera opens with a silhouette guide (side profile) → shutter → optional note/tag → saved; under 10 seconds.
- Gallery: swipeable, date-grouped, with tag filters (vet can jump to "injury" photos); smooth shared-element transition from card to full image; honours reduced-motion.
- Every list/search row shows the avatar; the profile hero shows the main photo with the farm number overlaid.

## 9. Tests (TESTING_STRATEGY R-6, R-9)

- Upload success path creates file + photo + variants; failure path leaves no photo row; retry idempotent.
- Tag reassignment does not change photo ownership; scan of new tag returns the right photos.
- Unauthorised role cannot fetch a signed URL; expired URL rejected.
- Variants within weight budgets; EXIF GPS stripped.

## 10. Open questions

| ID | Question |
|----|----------|
| Q-PH-1 | Soft-hide only, or allow true deletion of accidental uploads within e.g. 24 h? |
| Q-PH-2 | Which photo context tags matter to the vets and to sales? |
| Q-PH-3 | Keep full-resolution originals (costly) or the ≤ 2048 px client-resized master? |
| Q-PH-4 | Should photos be shareable externally (buyer link) — affects signed-URL policy? |
