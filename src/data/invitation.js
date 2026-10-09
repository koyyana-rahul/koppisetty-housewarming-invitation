/**
 * ─────────────────────────────────────────────────────────────
 *  GRIHA PRAVESH INVITATION — CENTRAL CONTENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────
 *  Edit everything below to customise the invitation.
 *  Every section reads from this single object, and every
 *  date, time and event is declared exactly once.
 */

export const invitationData = {
  id: "griha-pravesh-koppisetty",

  /* ── Entry gate ─────────────────────────────────────────── */
  gate: {
    monogram: "ॐ",
    sealLabel: "Tap to Open",
    altText: "Auspicious seal — tap to open the invitation",
  },

  /* ── Hero ───────────────────────────────────────────────── */
  hero: {
    invocation: "॥ श्री गणेशाय नमः ॥",
    invocationTe: "॥ శ్రీ గణేశాయ నమః ॥",
    blessing: "With the blessings of the Almighty",
    blessingTe: "భగవంతుని ఆశీస్సులతో",
    eyebrow: "You're Invited",
    eyebrowTe: "మీకు సాదర ఆహ్వానం",
    headline: ["to our Housewarming", "Ceremony"],
    headlineTe: ["గృహ ప్రవేశ", "మహోత్సవం"],
    lede: "as we celebrate the beginning of a beautiful new chapter in our new home.",
    ledeTe:
      "మా కొత్త ఇంటిలోకి మా జీవితంలోని ఒక అద్భుతమైన అధ్యాయం ప్రారంభమవుతోంది.",
  },

  /* ── Hosts / family ─────────────────────────────────────── */
  family: {
    sectionLabel: "With love & happiness",
    heading: "Our Family",
    headingTe: "మా కుటుంబం",
    intro:
      "With love, gratitude and the blessings of our elders, we are delighted to invite you into our new home.",
    introTe:
      "ప్రేమ, కృతజ్ఞత మరియు మా పెద్దల ఆశీస్సులతో మా కొత్త ఇంటికి మీకు సాదర ఆహ్వానం.",
    signoff: "We step into our new home",
    // signoffTe: "మా కొత్త ఇంటికి దాదాపు",
    hosts: [
      {
        name: "Shri Koppisetty YesuBabu",
        nameTe: "శ్రీ కొప్పిశెట్టి యేసుబాబు",
        sub: "Shri & Smt. Koppisetty",
      },
      {
        name: "Smt. Koppisetty Kanaka Durga",
        nameTe: "శ్రీమతి కొప్పిశెట్టి కనక దుర్గ",
        sub: "With the entire Koppisetty family",
      },
    ],
    familyName: "The Koppisetty Family",
    familyNameTe: "కొప్పిశెట్టి కుటుంబం",
  },

  /* ── Invitation message ─────────────────────────────────── */
  message: {
    sectionLabel: "The Invitation",
    headingTe: "మీకు సాదర ఆహ్వానం",
    heading: "You Are Cordially Invited",
    paragraphsTe: [
      "భగవంతుని ఆశీస్సులు, మా కుటుంబ స్నేహంతో మా కొత్త ఇంటి గృహ ప్రవేశానికి మిమ్మల్ని ఆహ్వానిస్తున్నాము. మీ సన్నిధి, ఆశీస్సులు మా ఇంటికి శుభం తేవాలి.",
    ],
    paragraphs: [
      "With our family's blessings, we invite you to the Gruhapravesham of our new home. Your presence will bring us joy.",
    ],
    closingLine: "We await you with folded hands.",
    dropcap: "॥",
  },

  /* ── Ceremony — the single source for every date & time ─── */
  ceremony: {
    sectionLabel: "The Auspicious Day",
    name: "Gruhapravesham",
    nameTe: "గృహ ప్రవేశం",
    sanskrit: "॥ శుభ గృహ ప్రవేశం ॥",
    subtitle: "Entering our new home for the first time",
    subtitleTe: "మా కొత్త ఇంటికి మొదటిసారి ప్రవేశం",
    date: "Wednesday, 14-10-2026",
    time: "8:31 PM onwards",
    dateParts: [
      { label: "Month", value: "October" },
      { label: "Day", value: "14" },
      { label: "Year", value: "2026" },
    ],
    countdownIso: "2026-10-14T20:31:00+05:30",
    countdownEyebrow: "Counting down to our special day",
    countdownScript: "Gruhapravesham",
    countdownQuote:
      "A new home, a new beginning, and a lifetime of blessings to share.",
    /* Short address used in the facts grid and on WhatsApp */
    venueLine: "Sri Sai Ramya Residency, Sheelanagar, Gajuwaka, Visakhapatnam",
    /* Ordered programme — rendered once, as the timeline */
    schedule: [
      {
        day: "Wednesday, 14-10-2026",
        time: "8:31 PM",
        title: "Gruhapravesham",
        titleTe: "గృహ ప్రవేశం",
        highlight: true,
      },
      {
        day: "Thursday, 15-10-2026",
        time: "5:00 AM",
        title: "Satyanarayana Swamy Vartam",
        titleTe: "శ్రీ సత్యనారాయణ స్వామి వర్తం",
      },
      {
        day: "Thursday, 15-10-2026",
        time: "1:00 PM",
        title: "Lunch",
        titleTe: "భోజనం",
        note: "At Our Home",
      },
    ],
    /* Caption for the schedule section */
    scheduleLabel: "The Programme",
    scheduleTitleTe: "కార్యక్రమం",
    scheduleTitle: "Order of Events",
  },

  /* ── Venue ──────────────────────────────────────────────── */
  venue: {
    sectionLabel: "Come To Our Home",
    eyebrow: "OUR NEW HOME",
    eyebrowTe: "మా కొత్త ఇల్లు",
    name: "Koppisetty Residence",
    nameTe: "కొప్పిశెట్టి ఇల్లు",
    address: [
      "Flat No. 101, Sri Sai Ramya Residency",
      "6A Road, Venkateswara Colony",
      "Sheelanagar, Gajuwaka",
    ],
    addressTe: [
      "ఫ్లాట్ నం. 101, శ్రీ సాయి రమ్య రెసిడెన్సీ",
      "6A రోడ్, వెంకటేశ్వర కాలనీ",
      "శీలనగర్, గజువాక",
    ],
    landmark: "Visakhapatnam, Andhra Pradesh",
    mapUrl: "https://goo.gl/maps/dsppWfw1yv9PR4Xs8?g_st=atm",
    mapEmbed:
      "https://maps.google.com/maps?q=Sri+Sai+Ramya+Residency+6A+Road+Venkateswara+Colony+Sheelanagar+Gajuwaka+Visakhapatnam&output=embed",
  },

  /* ── Closing / footer ───────────────────────────────────── */
  footer: {
    message:
      "Your presence will fill our new home with warmth, happiness and blessings.",
    messageTe:
      "మీ సన్నిధి మా కొత్త ఇంటిని వెలుగు, ఆనందం, ఆశీస్సులతో నింపుతుంది.",
    signoff: "With love,",
    signoffTe: "ప్రేమతో,",
    creditPrefix: "MADE WITH",
    creditIcon: "❀",
    creditText: "FOR OUR FAMILY & FRIENDS",
  },

  /* ── Ambient audio ──────────────────────────────────────── */
  /* Drop your track in `public/audio/` and point `audioSrc` at it —
     files in `public/` are served from the site root, so the path is
     "/audio/<file>". Leave it "" to use the built-in soft WebAudio
     ambience instead (with `ambience: true`). */
  audioSrc: "/audio/grhapravesham.mp3",
  ambience: false,
};

export default invitationData;
