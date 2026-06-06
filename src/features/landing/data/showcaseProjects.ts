import type { ShowcaseProject } from "../components/ShowcaseDetailModal";

// Curated Unsplash imagery per category — hardcoded gallery
const img = (id: string, w = 1200, h = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const SHOWCASE_PROJECTS: Record<string, ShowcaseProject> = {
  debut: {
    id: "debut",
    name: "Sofia's Sweet Eighteen",
    category: "Debut",
    tagline: "A blush-pink digital debut with 18 Roses, 18 Candles, and 18 Treasures.",
    description:
      "A full debut microsite with story-style navigation, animated cover, and a glassmorphic RSVP. Built around the 18-tradition rituals so every guest understands their role at a glance.",
    year: "2026",
    audience: "180 invited guests",
    status: "Delivered & Live",
    problem:
      "The debutante wanted a single elegant link to share — no PDFs, no group chats, no missed RSVPs. Every guest should know their role (rose, candle, treasure, bills) instantly.",
    scope: [
      "Animated cover with envelope opening",
      "18 Roses / Candles / Treasures pages",
      "Real-time RSVP with seat tracking",
      "Background music + photo gallery",
      "Custom monogram & palette",
    ],
    features: ["Story navigation", "RSVP tracking", "Background music", "Photo gallery", "Countdown", "QR codes", "Guest wall"],
    techStack: ["React", "Framer Motion", "Lovable Cloud", "Tailwind"],
    images: [
      img("photo-1519741497674-611481863552"), // bouquet
      img("photo-1469371670807-013ccf25f16a"),
      img("photo-1530103862676-de8c9debad1d"),
      img("photo-1464366400600-7168b8af9bc3"),
    ],
    gradient: "from-rose-500/30 via-pink-500/20 to-fuchsia-600/30",
  },
  wedding: {
    id: "wedding",
    name: "James & Ana — Forever Begins",
    category: "Wedding",
    tagline: "A timeless ivory-and-gold wedding invitation with full RSVP suite.",
    description:
      "A complete wedding microsite covering save-the-date, love story, entourage, dress code, gift guide, and seat allocations — paired with an animated video opener delivered in a premium envelope.",
    year: "2026",
    audience: "240 invited guests",
    status: "Delivered & Live",
    problem:
      "The couple needed a single source of truth for two families, three cities, and a destination ceremony. RSVPs, parking, dress code, and gifts had to live in one elegant place.",
    scope: [
      "Animated cover + envelope reveal",
      "Love story timeline & entourage list",
      "Venue with Waze + Google Maps",
      "Photo gallery up to 16 images + video",
      "Music player, FAQs, gift registry",
    ],
    features: ["Save the date", "Love story", "Entourage", "Dress code", "Gift guide", "RSVP", "Live countdown"],
    techStack: ["React", "Framer Motion", "Lovable Cloud", "Tailwind"],
    images: [
      img("photo-1519225421980-715cb0215aed"),
      img("photo-1606216794074-735e91aa2c92"),
      img("photo-1465495976277-4387d4b0b4c6"),
      img("photo-1511795409834-ef04bbd61622"),
    ],
    gradient: "from-amber-200/30 via-rose-300/30 to-rose-500/30",
  },
  christening: {
    id: "christening",
    name: "Baby Liam's Blessing",
    category: "Christening",
    tagline: "A soft sky-blue christening invitation with ninang & ninong tracking.",
    description:
      "A gentle, pastel christening microsite designed around the ceremony and reception flow, with godparent acknowledgements, dress code, and a private guest message wall.",
    year: "2026",
    audience: "90 invited guests",
    status: "Delivered & Live",
    problem:
      "The family wanted to honour each ninang and ninong individually while still managing reception logistics, gifts, and a private message board for the baby.",
    scope: [
      "Cover with cloud animation",
      "Ninang & ninong wall",
      "Ceremony + reception timeline",
      "Dress code & gift guide",
      "Private message wall",
    ],
    features: ["Godparent wall", "Timeline", "RSVP", "Photo gallery", "Music", "Message wall"],
    techStack: ["React", "Framer Motion", "Lovable Cloud", "Tailwind"],
    images: [
      img("photo-1519689680058-324335c77eba"),
      img("photo-1555252333-9f8e92e65df9"),
      img("photo-1543248939-4296e1fea89b"),
      img("photo-1518398046578-8cca57782e17"),
    ],
    gradient: "from-sky-300/30 via-blue-400/20 to-indigo-500/30",
  },
  birthday: {
    id: "birthday",
    name: "Carlo's Birthday Bash",
    category: "Birthday",
    tagline: "A confetti-bright birthday invitation with a guest wishes board.",
    description:
      "A playful birthday microsite with countdown, party details, dress code, and a real-time guest wishes board that prints to a keepsake PDF after the event.",
    year: "2026",
    audience: "120 invited guests",
    status: "Delivered & Live",
    problem:
      "The host wanted RSVPs, party details, and a fun way for guests to leave birthday wishes — all without juggling Google Forms and group chats.",
    scope: [
      "Animated confetti cover",
      "Party schedule",
      "Dress code & gift guide",
      "Live wishes board",
      "Photo gallery",
    ],
    features: ["Countdown", "RSVP", "Wishes wall", "Dress code", "Photo gallery", "Music"],
    techStack: ["React", "Framer Motion", "Lovable Cloud", "Tailwind"],
    images: [
      img("photo-1530103862676-de8c9debad1d"),
      img("photo-1464349095431-e9a21285b5f3"),
      img("photo-1513151233558-d860c5398176"),
      img("photo-1481162854517-d9e353af153d"),
    ],
    gradient: "from-orange-400/30 via-amber-500/20 to-yellow-500/30",
  },
  corporate: {
    id: "corporate",
    name: "Annual Black-Tie Gala",
    category: "Corporate",
    tagline: "A monochrome, executive-tier corporate gala invitation.",
    description:
      "A formal microsite for an annual black-tie gala — sponsor wall, agenda, speakers, dress code, and seat-by-seat RSVP tracking for tables of ten.",
    year: "2026",
    audience: "500+ invited guests",
    status: "Delivered & Live",
    problem:
      "The committee needed enterprise-level RSVP control with sponsor visibility, multi-table logistics, and a polished brand-aligned design.",
    scope: [
      "Executive cover & agenda",
      "Speaker roster",
      "Sponsor wall",
      "Table-based RSVP",
      "Dress code & venue maps",
    ],
    features: ["Agenda", "Speakers", "Sponsors", "Seat allocation", "RSVP", "QR check-in"],
    techStack: ["React", "Framer Motion", "Lovable Cloud", "Tailwind"],
    images: [
      img("photo-1511795409834-ef04bbd61622"),
      img("photo-1540575467063-178a50c2df87"),
      img("photo-1505373877841-8d25f7d46678"),
      img("photo-1492684223066-81342ee5ff30"),
    ],
    gradient: "from-slate-700/30 via-zinc-800/30 to-neutral-900/30",
  },
  anniversary: {
    id: "anniversary",
    name: "25 Years of Love",
    category: "Anniversary",
    tagline: "A silver-jubilee anniversary invitation with a love timeline.",
    description:
      "A celebratory microsite chronicling 25 years of marriage — a love timeline, vow-renewal program, family entourage, and tribute messages.",
    year: "2026",
    audience: "150 invited guests",
    status: "Delivered & Live",
    problem:
      "The couple wanted a meaningful way to invite three generations of family and friends to a vow renewal, with shareable memories and easy RSVPs for elders.",
    scope: ["Love timeline", "Vow renewal program", "Family entourage", "Memory wall", "RSVP"],
    features: ["Timeline", "Memory wall", "Program", "RSVP", "Photo gallery", "Music"],
    techStack: ["React", "Framer Motion", "Lovable Cloud", "Tailwind"],
    images: [
      img("photo-1511285560929-80b456fea0bc"),
      img("photo-1519741497674-611481863552"),
      img("photo-1465495976277-4387d4b0b4c6"),
      img("photo-1583939003579-730e3918a45a"),
    ],
    gradient: "from-emerald-400/30 via-teal-500/20 to-cyan-600/30",
  },
  babyshower: {
    id: "babyshower",
    name: "It's a Surprise — Baby Shower",
    category: "Baby Shower",
    tagline: "A pastel gender-reveal baby shower with games & wishes board.",
    description:
      "A cheerful microsite for a gender-reveal baby shower — games, wish-list registry, dress code, and a guess-the-gender poll.",
    year: "2026",
    audience: "60 invited guests",
    status: "Delivered & Live",
    problem:
      "The parents-to-be wanted a fun, polished invitation that managed RSVPs, registry, dress code, and a live guess-the-gender poll without spreadsheets.",
    scope: ["Animated pastel cover", "Games schedule", "Wish-list registry", "Guess-the-gender poll", "RSVP"],
    features: ["Poll", "Registry", "Games", "RSVP", "Photo gallery", "Music"],
    techStack: ["React", "Framer Motion", "Lovable Cloud", "Tailwind"],
    images: [
      img("photo-1519689680058-324335c77eba"),
      img("photo-1555252333-9f8e92e65df9"),
      img("photo-1530103862676-de8c9debad1d"),
      img("photo-1518398046578-8cca57782e17"),
    ],
    gradient: "from-pink-200/30 via-purple-300/30 to-indigo-400/30",
  },
};
