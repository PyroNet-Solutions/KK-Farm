# RFID Integration Research

**Status:** Research note v0.1 (2026-11-07). The farm's reader make/model and tag type are `[UNKNOWN]` until the farm visit. Everything below is general background to make that inspection productive — **not** a statement about KK Farm's hardware.

## 1. What we know

| Fact | Status |
|------|--------|
| RFID ear tags are already installed on the goats. | `[CONFIRMED]` |
| An Android-based RFID reader/gun is available. | `[CONFIRMED]` |
| Manufacturer, model, SDK/API capabilities. | `[UNKNOWN]` — Q-RF-1, Q-RF-3 |
| Tag frequency / standard. | `[UNKNOWN]` — Q-RF-2 |
| Whether tag codes are already mapped to goats anywhere. | `[UNKNOWN]` — Q-AM-2 |
| Do not connect to live farm hardware in this phase. | `[CONFIRMED]` restriction |

## 2. Two very different RFID worlds — find out which one KK Farm is in

Livestock ear tags come in two incompatible technologies. The reader must match the tags, and the integration approach differs.

| | **LF — Low Frequency (134.2 kHz)** | **UHF — Ultra High Frequency (860–960 MHz)** |
|--|--|--|
| Standard | ISO 11784 / 11785 (FDX‑B, HDX). The international *animal identification* standard. | EPC Class 1 Gen 2 / ISO 18000‑6C. General asset-tracking standard, increasingly used for livestock. |
| Tag code | 15-digit number: 3-digit country/manufacturer code + 12-digit ID. | 96-bit (or longer) EPC, often printed as 24 hex characters; also a TID. |
| Read range | ~10–25 cm. Must touch/near the ear. | 1–10 m depending on reader power and tag. Can read a pen from a distance. |
| Reader form | Stick readers, Bluetooth wands; some Android handhelds. | Android handheld "guns" are very common in this class. |
| Pros | Reliable near metal/water (animal bodies); regulatory standard in many countries. | Range; bulk reads (count a pen); cheap tags. |
| Cons | One-at-a-time; must be close. | Body tissue absorbs UHF, can cause missed reads; multi-read needs de-duplication logic; regional frequency bands. |

**How to tell at the farm visit:** read the tag's printed number (15 digits → almost certainly LF/ISO; hex string → UHF). Check the reader's label/spec sheet for "134.2 kHz / ISO 11784" vs "UHF / EPC Gen2 / 865–928 MHz". Some handhelds support both. Photograph everything.

Pakistan context: the Punjab Livestock Department has launched an animal identification & traceability initiative (PAITS). Whether KK Farm's tags are registered with it, and what tag standard it requires, is `[UNKNOWN]` → Q-RF-5. Verify with the department, not with this note.

## 3. How an Android reader typically exposes scans

From most to least convenient for us:

| Mode | How it works | Integration effort | Offline? |
|------|--------------|--------------------|----------|
| **Keyboard wedge** | Reader types the tag code into whatever text field has focus, often followed by Enter. | Very low — any app (web or native) just needs a focused input. | Yes |
| **Broadcast intent** | Vendor service sends an Android intent with the tag code; configurable action name. | Low — native app registers a receiver; a PWA needs a tiny bridge app. | Yes |
| **Vendor SDK (Java/Kotlin .aar)** | App links the SDK, controls power, triggers scans, gets callbacks. | Medium — native code required; best control (e.g. single-read vs. inventory). | Yes |
| **Bluetooth (SPP/BLE)** | External reader streams tag codes to a phone. | Medium — serial parsing; works with any phone. | Yes |
| **Vendor cloud / app only** | Only the vendor's own app shows scans. | High — may require export/import or be a dead end. | Depends |

Many Chinese-made Android UHF handhelds (e.g. Chainway, Urovo, and OEM variants) ship with a Java SDK and often a keyboard-wedge or broadcast mode; some have community Flutter/React Native plugins. LF Bluetooth wands (e.g. Allflex, GAO, generic FDX‑B readers) typically stream over Bluetooth SPP. **None of this is confirmed for KK Farm's device.**

## 4. Proposed integration design (hardware-agnostic)

```
┌─────────────┐   TagScanned(tag_code, reader_id, at)   ┌──────────────────────┐
│ Scan source │ ───────────────────────────────────────▶ │ App: resolve tag     │
│ • SDK       │                                          │ tag_code → open      │
│ • Intent    │                                          │ rfid_assignment →    │
│ • Wedge     │                                          │ animal profile       │
│ • Bluetooth │                                          │ or "unassigned tag"  │
│ • Manual /  │                                          └──────────────────────┘
│   QR / type │
└─────────────┘
```

Rules:
1. The app never stores the tag code as the animal's key; it looks up the **current assignment** (see [DATABASE_DESIGN_DRAFT.md](DATABASE_DESIGN_DRAFT.md) §2).
2. A scan of an **unassigned** tag opens an "assign to goat" flow (manager/caretaker permission) — this is how new tags and replacements are handled.
3. A scan of a tag whose assignment was **closed** (animal left/died) shows the historical animal with a clear "no longer on farm" banner and offers reassignment.
4. UHF bulk reads (inventory mode) are de-duplicated per session and produce a "pen count / missing animals" check — a later feature.
5. Manual entry of the printed number and a QR/visual-tag fallback always exist, so the farm is never blocked by a dead battery.

## 5. Scan-first workflows the UX should support

| Workflow | Steps |
|----------|-------|
| Identify a goat | Scan → profile (photo, number, sex, breed, age, shed, last weight, open alerts) |
| Weigh | Scan → enter weight → save (3 taps) |
| Observe | Scan → pick symptoms (icons) → severity → photo → save |
| Vet exam | Scan → exam form → diagnosis → treatment |
| Move shed | Scan (or multi-scan) → choose destination pen → confirm |
| Replace tag | Scan new tag → "unassigned" → choose goat (search by farm number) → reason "replacement" |
| Pen check (UHF only) | Inventory sweep → list of present / missing animals |

## 6. Farm-visit inspection checklist (RFID)

> The full fill-in version of this checklist is [farm-visit/RFID_HARDWARE_INSPECTION.md](farm-visit/RFID_HARDWARE_INSPECTION.md). The short list below is kept for orientation.

- [ ] Photograph the reader (front, back label, any model number, Android version in Settings → About).
- [ ] Note any pre-installed vendor app; open it and see how scans are shown; look for Settings → "output mode / keyboard / broadcast".
- [ ] Photograph 2–3 ear tags up close (printed number, logo, colour, shape).
- [ ] Scan a tag with the vendor app; photograph the code displayed; compare with the printed number.
- [ ] Ask who supplied the reader and tags; get the supplier contact for SDK/documentation.
- [ ] Ask whether spare tags exist and how many; where they are kept.
- [ ] Test read range and behaviour with the goat moving (for UHF, note missed reads).
- [ ] Check mobile signal / Wi‑Fi in the shed (for offline design — Q-FM-3).

## 7. Risks

| Risk | Mitigation |
|------|------------|
| Reader only works with vendor cloud app | Keyboard-wedge or Bluetooth output usually still exists; otherwise budget for a different reader (LF stick readers are inexpensive) |
| LF tags + UHF reader (or vice-versa) mismatch | Confirm at visit before any design commitment |
| SDK requires old Android version | Pin the field app's minimum SDK accordingly; keep the web admin independent |
| Tags fall off / reused without recording | App makes "replace tag" a 30-second flow; alerts on unexpected unassigned scans |
| Vendor SDK licence/NDA | Check terms before committing code to the repo; keep SDK binaries out of Git if licence forbids |

## 8. Sources consulted (general background only)

- ISO 11784/11785 FDX‑B/HDX readers with Bluetooth and Android SDKs are widely available (e.g. vendor listings from GAO RFID, Serialio idChamp, Allflex APR series).
- Android UHF handhelds (e.g. Chainway C72/C66) ship with Java SDKs; community Flutter plugins exist but are third-party.
- Punjab (Pakistan) PAITS animal identification initiative announced by the provincial livestock department — details to be verified directly.

These are starting points for the inspection, not endorsements or purchase recommendations.
