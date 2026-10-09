# Griha Pravesh Invitation (React + Vite + Tailwind CSS)

A premium South-Indian (Andhra) housewarming / Gruhapravesham digital invitation.
Built on the original wedding-template codebase — same React + Vite + Tailwind v4
architecture, re-themed and re-written for a Gruhapravesham, and bilingual
(English + తెలుగు).

## Sections

1. **Entry gate** — tap the ॐ seal to open the invitation (doors + audio start)
2. **Hero** — invocation, kalash, "You're Invited", family name, CTA
3. **Scratch to reveal** — scratch the month / day / year to unveil the date
4. **Our Family** — the hosts, converted from the wedding couple cards
5. **The Invitation** — bilingual invitation message
6. **Countdown** — live countdown to the Gruhapravesham muhurat
7. **Ceremony details** — occasion, date, time and venue
8. **Programme timeline** — the ordered schedule across both days
9. **Venue** — address, embedded map, Get Directions, Share on WhatsApp
10. **Closing** — diya, blessings, ॥ శుభ గృహ ప్రవేశం ||

## Editing the content

Everything lives in one file: **`src/data/invitation.js`**. Each date, time and
event is declared exactly once; sections derive what they need from it.

```js
export const invitationData = {
  gate, hero, family: { hosts, familyName }, message,
  ceremony: { name, date, time, dateParts, countdownIso, venueLine, schedule },
  venue: { address, mapUrl, mapEmbed },
  footer, audioSrc, ambience,
};
```

- `ceremony.schedule` — the ordered programme; it drives the timeline and the
  WhatsApp share text, so add or reorder events in one place
- `countdownIso` — ISO string with timezone, e.g. `2026-10-14T20:31:00+05:30`
- `mapUrl` — short/private Google Maps link used by **Get Directions**
- `mapEmbed` — the `maps.google.com/...&output=embed` URL for the inline map
- `audioSrc` — background audio track; leave `""` to use the built-in soft
  WebAudio ambience instead (`ambience: true`)
- Any `*Te` field is the Telugu line rendered beneath its English pair

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run preview  # preview the build
npm run lint     # eslint
```

## Project structure

```
src/
├─ App.jsx                 # page composition + reveal observer
├─ index.css               # theme tokens, ornaments, animations
├─ data/invitation.js      # ← all content lives here
└─ components/
   ├─ EntryGate.jsx        # tap-to-open doors
   ├─ HeroSection.jsx      # welcome screen
   ├─ ScratchDate.jsx      # scratch-to-reveal date
   ├─ HostSection.jsx      # hosts / family
   ├─ InvitationMessage.jsx# bilingual invitation
   ├─ Countdown.jsx        # live countdown
   ├─ EventDetails.jsx     # ceremony facts
   ├─ CeremonyTimeline.jsx # programme schedule
   ├─ VenueSection.jsx     # address + map + share
   ├─ FooterSection.jsx    # closing blessings
   ├─ SectionHeading.jsx   # shared heading
   ├─ Motifs.jsx           # Kalash, Diya, Mandala, Toran, Om, icons
   ├─ PetalsCanvas.jsx     # drifting marigold petals
   └─ AudioToggle.jsx      # music toggle (file or synthesised ambience)
```