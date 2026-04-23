# Wedding Invitation Template (React + Vite + Tailwind)

This project converts your static invitation into a reusable template system.

## What you get

- React + Vite app setup
- TailwindCSS v4 configured using Vite plugin
- Reusable invitation components
- Multiple wedding templates from one codebase
- Built-in mini editor for quick name/date changes
- Template Manager with save/duplicate/delete
- JSON import/export for bulk wedding data
- Browser local persistence (no data loss on refresh)

## Project structure

- `src/data/templates.js` → all invitation data for multiple weddings
- `src/components/*` → reusable sections (entry gate, scratch reveal, countdown, story, events, RSVP, footer)
- `src/App.jsx` → template selection + page composition

## Run locally

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build production: `npm run build`
4. Preview build: `npm run preview`

## Create a new wedding invitation

### Option A (No coding, recommended)

1. Run app with `npm run dev`
2. Open **Template Editor** at top
3. Click **Duplicate** on any template
4. Update `Template Name`, `Template ID`, bride/groom/date
5. Click **Save Template**
6. Use **Export JSON** to back up/share all templates

### Option B (Code editing)

1. Open `src/data/templates.js`
2. Duplicate an existing template object
3. Change `id`, `templateName`, names, dates, events, contacts, media links
4. Save and reload

## Template Manager actions

- **Save Template**: saves current draft to browser storage
- **Duplicate**: clones current template
- **Delete**: removes selected template (keeps at least one)
- **Export JSON**: downloads all templates
- **Import JSON**: loads templates from file
- **Reset Defaults**: restores `src/data/templates.js` defaults

## Data-only template fields (no component edits needed)

Put all wedding-specific content in `src/data/templates.js`:

- Entry: `entryTitle`, `entrySubtitle`, `entryVideo`, `audioSrc`
- Hero: `groomName`, `brideName`, `groomParents`, `brideParents`, `quote`, `heroSymbol`
- Date/Countdown: `dateTimeLocal`, `dateParts`, `countdownIso`, `countdownLabel`
- Story: `storySectionLabel`, `storyTitle`, `stories[]`
- Events: `events[]` with `name`, `time`, `address`, `mapLink`, optional `mapEmbed`, optional `video`, fallback `image`
- Timeline: `timeline[]`
- RSVP: `rsvpTitle`, `rsvpDeadline`, `whatsappNumber`, `contacts[]`, `rsvpSuccessTitle`, `rsvpSuccessMessage`, `successContacts[]`
- Footer: `footerMessage`, `credits`

This means: **same reusable page + behavior components**, only data changes per wedding.

## Easy input workflow (non-technical friendly)

If you want very easy edits, keep only these fields per template:

- `groomName`, `brideName`
- `dateTimeLocal`, `countdownIso`, `countdownLabel`
- `events[]`
- `contacts[]`

Everything else can stay as default design copy until needed.

## Notes

- RSVP currently opens WhatsApp with a pre-filled message.
- For real backend storage (Google Sheets, Airtable, database), hook `RSVPSection.jsx` submit function to an API.
- Browser storage key: `wedding-template-manager-v1`.

## Motion/behavior parity with your original HTML

The React version now mirrors the original interaction flow:

- Entry gate click → overlay hide → video play → fade-out → main reveal
- Background petals activate after entry
- Idle auto-scroll from hero to scratch section (cancelled on user interaction)
- Scratch canvas reveal (touch/mouse) + unlock flow + confetti
- Sticky story scroll progression with stacked polaroid motion
- Reveal-on-scroll transitions for sections
- Event media auto-expand as blocks enter viewport

All wedding-specific content still stays in `templates.js`; behavior code stays reusable in components.
