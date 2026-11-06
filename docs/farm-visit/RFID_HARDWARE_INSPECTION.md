# RFID Hardware Inspection Checklist

**Purpose:** establish exactly what RFID equipment KK Farm has and what it can do, so that the integration approach in [../RFID_INTEGRATION_RESEARCH.md](../RFID_INTEGRATION_RESEARCH.md) and the mobile-client decision (D-028) can be finalised on facts.
**Rule:** **do not assume the reader supports any integration method.** Record only what is printed on the device, shown in its settings, or demonstrated by staff with the vendor's own app. Engineering does not connect its own software to the farm hardware in this phase.
**Tags:** C = Confirmed (seen/printed) · O = Observed · R = Reported · U = Unknown.

## 1. Device identification

| Item | Value | Evidence (photo ref) | Tag |
|------|-------|----------------------|-----|
| Device type (handheld gun / stick wand / phone-attached sled / fixed panel) | | | |
| Manufacturer (printed on label) | | | |
| Exact model number (label / Settings → About) | | | |
| Serial number (photo only, do not type here) | — | | |
| Operating system (Android version; Settings → About phone) | | | |
| Build date / purchase date (ask) | | | |
| Supplier / vendor (code SUP-xx), country | | | |
| Number of readers on the farm; who carries them | | | |
| Charging: cable type, dock, battery life reported | | | |
| Condition (working / faulty / unused) | | | |
| Box, manual, CD/USB, warranty card available? | | | |

Photograph: front, back label, any ports, the "About" screen, the home screen with app icons.

## 2. Tags (transponders)

| Item | Value | Evidence | Tag |
|------|-------|----------|-----|
| Tag form (button ear tag / flag tag / bolus / injectable) | | | |
| Printed number on tag (format only, e.g. 15 digits / hex) | | | |
| Printed number length and prefix pattern | | | |
| Visual tag number matches electronic number? | | | |
| Manufacturer / logo on tag | | | |
| Frequency / standard if printed (134.2 kHz, ISO 11784/11785, FDX‑B, HDX, UHF, EPC) | | | |
| Second visual tag or other ID on the animal? | | | |
| Spare tags in stock (count, where) | | | |
| How tags are applied; applicator present | | | |
| Tag loss rate reported; what happens when a tag is lost | | | |
| Tags registered with any government/provincial system (e.g. PAITS)? | | | |

Photograph: 2–3 tags close up (both sides), the spare-tag box/label.

**Quick identification hint (do not treat as certain):** a 15-digit number starting with a 3-digit code usually indicates an ISO 11784/11785 low-frequency tag; a 24-character hex string usually indicates a UHF EPC tag. Record what you see; engineering will confirm.

## 3. Reader application (vendor software)

| Item | Value | Evidence | Tag |
|------|-------|----------|-----|
| App name(s) installed for scanning | | | |
| App version | | | |
| Does it require a login / vendor account / internet? | | | |
| What it shows on a scan (number format shown on screen) | | | |
| Scan history / list kept in the app? | | | |
| Export options visible (CSV / Excel / share / email / cloud) | | | |
| Settings → output mode options (e.g. keyboard, broadcast, HID, SPP, "send to app") — list exactly what is shown | | | |
| Any "SDK", "developer", "API", "integration" wording in menus or manual | | | |
| Language of the app | | | |
| Other apps on the device (WhatsApp, Excel, custom farm app?) | | | |

Photograph every settings screen related to scanning/output/connectivity.

## 4. Connectivity

| Capability | Present? | How verified (label / settings / demonstrated) | Tag |
|------------|----------|------------------------------------------------|-----|
| Bluetooth (version if shown); pairs with phones? | | | |
| USB port type; appears as storage / serial / keyboard when connected? (ask, don't test with our devices) | | | |
| Wi‑Fi | | | |
| Mobile SIM / data | | | |
| NFC | | | |
| GPS | | | |
| Camera / barcode scanner | | | |

## 5. Read / write capability

| Item | Answer | Evidence | Tag |
|------|--------|----------|-----|
| Reads tags (demonstrated by staff) | | | |
| Typical read distance observed (cm/m) | | | |
| Reads multiple tags at once (bulk/inventory mode)? | | | |
| Can **write/program** tags? (menu present / manual says) | | | |
| Misreads or missed reads observed? circumstances | | | |
| Works with the goat moving / in a crowded pen? | | | |

## 6. SDK, API, documentation, data access

| Item | Answer | Evidence | Tag |
|------|--------|----------|-----|
| Printed/PDF manual available? language | | | |
| Vendor website / support contact on box or manual | | | |
| Any mention of SDK / API / developer kit | | | |
| Can scans be exported out of the vendor app (format)? | | | |
| Can scans be received by a **third-party app** on the same device (keyboard-wedge / broadcast / intent)? — only what the manual/menus state | | | |
| Can scans be sent to **another phone/PC** (Bluetooth SPP/HID, USB)? — only what is stated | | | |
| Cloud portal from the vendor? who has credentials | | | |
| Licence/subscription for the vendor software? | | | |

## 7. Offline behaviour and synchronisation

| Item | Answer | Evidence | Tag |
|------|--------|----------|-----|
| Does scanning work without internet (ask staff to recall / demonstrate in a no-signal spot)? | | | |
| Where are scans stored on the device? | | | |
| Does the app sync to a cloud/PC later? how triggered | | | |
| Data lost when the app is closed / device restarted? | | | |

## 8. How staff use it today (observe)

| Question | Answer | Tag |
|----------|--------|-----|
| When is the reader used (daily / weighing / vaccination / sales / rarely)? | | |
| Who is trained to use it | | |
| What do they do with the number after scanning (write it in a register? nothing?) | | |
| Pain points reported (battery, slow, confusing, no use) | | |

## 9. Follow-ups to request from the vendor (after the visit)

- [ ] Exact model datasheet and user manual (PDF).
- [ ] Whether an Android SDK / documentation is available and under what terms.
- [ ] Supported output modes (keyboard-wedge, broadcast intent, Bluetooth SPP/HID).
- [ ] Tag standard and compatible replacement tags; price per tag; applicator.
- [ ] Firmware update availability.

## 10. Summary (fill at the end)

| Question | Answer (C/O/R/U) |
|----------|------------------|
| Reader make + model | |
| Tag technology (LF ISO / UHF / unknown) | |
| Any documented way for third-party software to receive scans? | |
| Offline scanning works? | |
| Vendor contact obtained? | |
| Engineering recommendation can now be finalised? (yes / needs vendor reply / needs new reader) | |

## Notes / unexpected findings

| # | Finding | Tag | Impact | Follow-up |
|---|---------|-----|--------|-----------|
| 1 | | | | |
| 2 | | | | |
