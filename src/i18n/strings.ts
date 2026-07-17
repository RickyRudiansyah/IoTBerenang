import type { Lang } from "../types";

/** Satu kamus untuk semua teks UI — jangan hardcode kalimat di komponen. */
export const strings = {
  id: {
    appName: "TirtaJaga",
    tagline: "Monitoring Keselamatan Kolam",
    live: "LIVE",
    mute: "Bisukan alarm",
    unmute: "Bunyikan alarm",
    langToggle: "Ganti bahasa",

    nav: {
      home: "Beranda",
      map: "Map",
      simulation: "Simulasi",
      report: "Report",
    },

    landing: {
      badge: "Sistem IoT Keselamatan Kolam Renang",
      title1: "Tenggelam itu senyap.",
      title2: "TirtaJaga tidak.",
      sub: "Gelang gyro mendeteksi korban meronta di permukaan, kamera bawah air mengonfirmasi saat terendam, buzzer membangunkan seisi kolam — dan dashboard menunjukkan zonanya, detik itu juga.",
      statValue: "20–60",
      statUnit: "detik",
      statDesc:
        "jendela senyap: korban megap-megap di permukaan tanpa bisa berteriak atau melambai, sebelum akhirnya terendam (instinctive drowning response).",
      cta: "Buka Simulasi",
      ctaHow: "Lihat Cara Kerja",
      preview: "Pratinjau Live",
      previewCaption: "Zona 3 — submersi terdeteksi",
      problem: {
        title: "Kenapa mata pengawas saja tidak cukup",
        lead: "Tiga kenyataan yang membuat insiden tetap terjadi di kolam yang “dijaga”.",
        cards: [
          {
            title: "Tidak bisa teriak, tidak bisa melambai",
            body: "Refleks tenggelam membuat korban diam vertikal di air — tanpa suara, tanpa gerakan besar. Dari pinggir kolam, ia terlihat seperti sedang bermain.",
          },
          {
            title: "Luput walau ada pengawas",
            body: "Banyak insiden terjadi hanya beberapa meter dari lifeguard. Di kolam ramai, membedakan meronta dan bercanda nyaris mustahil dilakukan terus-menerus.",
          },
          {
            title: "Sistem lama mahal & punya titik buta",
            body: "CV komersial butuh banyak kamera terpasang, dan tetap buta saat air keruh, kolam padat, atau silau. Gelang murah, presisi ke zona, dan menutup titik buta itu.",
          },
        ],
      },
      how: {
        title: "Cara Kerja",
        lead: "Dua sensor, dua fase, saling menutup titik buta.",
        steps: [
          {
            title: "Gelang mendeteksi meronta",
            body: "Fase permukaan: variansi gyro melonjak saat korban megap-megap. Gelang masih di atas air — satu paket sinyal kecil langsung terkirim.",
          },
          {
            title: "Kamera mengonfirmasi",
            body: "Saat terendam, sinyal radio mati di dalam air. Kamera bawah air mengambil alih: memastikan tubuh diam terendam, bukan sedang menyelam.",
          },
          {
            title: "Buzzer menyala",
            body: "Ambang durasi submersi terlewati → alarm keras di pos lifeguard. Ada konfirmasi dulu — bukan “masuk air = alarm”.",
          },
          {
            title: "Dashboard menunjukkan zona",
            body: "Zona kejadian menyala merah di peta, kartu korban muncul dengan ID gelang & timer, dan waktu respons tercatat ke log.",
          },
        ],
        quoteLabel:
          "Jawaban untuk pertanyaan paling sering: “memangnya sinyal tembus air?”",
        quote:
          "Sinyal radio memang lemah di dalam air — makanya gelang mendeteksi di fase meronta yang terjadi di permukaan, lalu kamera bawah air mengonfirmasi saat korban sudah terendam. Dua sensor saling menutup titik buta.",
      },
      ctaBottom: {
        title: "Lihat sistemnya bekerja — tanpa harus ada yang tenggelam.",
        body: "Halaman Simulasi meniru skenario penuh: meronta → diam → countdown → alarm.",
        button: "Buka Simulasi",
      },
      footer: "TirtaJaga — Garuda Hacks 2026 · Track 2: Safety",
    },

    page: {
      home: {
        title: "Beranda",
        desc: "Masalah, cara kerja sistem, dan pintu masuk ke simulasi.",
      },
      map: {
        title: "Map",
        desc: "Kolam tampak atas — status live 4 zona & lokasi alarm.",
      },
      simulation: {
        title: "Simulasi",
        desc: "Picu skenario tenggelam: meronta → diam → countdown → alarm.",
      },
      report: {
        title: "Report",
        desc: "Log alarm, waktu respons, dan zona rawan.",
      },
    },

    comingSoon: "Segera — sprint berikutnya",

    zone: (n: number) => `Zona ${n}`,

    status: {
      safe: "Aman",
      warn: "Waspada",
      danger: "Bahaya",
    },
  },
  en: {
    appName: "TirtaJaga",
    tagline: "Pool Safety Monitoring",
    live: "LIVE",
    mute: "Mute alarm",
    unmute: "Unmute alarm",
    langToggle: "Switch language",

    nav: {
      home: "Home",
      map: "Map",
      simulation: "Simulation",
      report: "Report",
    },

    landing: {
      badge: "IoT Pool Safety System",
      title1: "Drowning is silent.",
      title2: "TirtaJaga isn't.",
      sub: "A gyro wristband detects struggling at the surface, an underwater camera confirms once submerged, a buzzer wakes the whole pool — and the dashboard points to the exact zone, that very second.",
      statValue: "20–60",
      statUnit: "seconds",
      statDesc:
        "the silent window: a victim gasps at the surface, unable to shout or wave, before finally going under (instinctive drowning response).",
      cta: "Open Simulation",
      ctaHow: "See How It Works",
      preview: "Live Preview",
      previewCaption: "Zone 3 — submersion detected",
      problem: {
        title: "Why watchful eyes alone are not enough",
        lead: "Three realities that keep incidents happening at “guarded” pools.",
        cards: [
          {
            title: "Can't shout, can't wave",
            body: "The drowning reflex leaves victims vertical and silent in the water — no sound, no big movements. From the poolside, it looks like they're just playing.",
          },
          {
            title: "Missed even with lifeguards around",
            body: "Many incidents happen mere meters from a lifeguard. In a crowded pool, telling struggle from play is nearly impossible to do continuously.",
          },
          {
            title: "Legacy systems are pricey & half-blind",
            body: "Commercial CV needs many installed cameras, and still goes blind in murky water, crowded pools, or glare. The wristband is cheap, zone-precise, and covers those blind spots.",
          },
        ],
      },
      how: {
        title: "How It Works",
        lead: "Two sensors, two phases, covering each other's blind spots.",
        steps: [
          {
            title: "Wristband detects struggle",
            body: "Surface phase: gyro variance spikes as the victim gasps. The wristband is still above water — one tiny signal packet fires immediately.",
          },
          {
            title: "Camera confirms",
            body: "Once submerged, radio signals die underwater. The underwater camera takes over: verifying a still, submerged body — not someone diving for fun.",
          },
          {
            title: "Buzzer fires",
            body: "Submersion passes the duration threshold → loud alarm at the lifeguard post. Confirmation first — not “in the water = alarm”.",
          },
          {
            title: "Dashboard points to the zone",
            body: "The incident zone flashes red on the map, a victim card appears with wristband ID & timer, and response time is logged automatically.",
          },
        ],
        quoteLabel:
          "The answer to the most common question: “does the signal even penetrate water?”",
        quote:
          "Radio signals are indeed weak underwater — that's why the wristband detects during the struggling phase at the surface, then the underwater camera confirms once the victim is submerged. Two sensors covering each other's blind spots.",
      },
      ctaBottom: {
        title: "Watch the system work — without anyone drowning.",
        body: "The Simulation page replays the full scenario: struggle → stillness → countdown → alarm.",
        button: "Open Simulation",
      },
      footer: "TirtaJaga — Garuda Hacks 2026 · Track 2: Safety",
    },

    page: {
      home: {
        title: "Home",
        desc: "The problem, how the system works, and the door to the demo.",
      },
      map: {
        title: "Map",
        desc: "Top-down pool view — live status of 4 zones & alarm location.",
      },
      simulation: {
        title: "Simulation",
        desc: "Trigger a drowning scenario: struggle → still → countdown → alarm.",
      },
      report: {
        title: "Report",
        desc: "Alarm log, response times, and risk zones.",
      },
    },

    comingSoon: "Coming soon — next sprint",

    zone: (n: number) => `Zone ${n}`,

    status: {
      safe: "Safe",
      warn: "Caution",
      danger: "Danger",
    },
  },
} satisfies Record<Lang, unknown>;

export type Strings = (typeof strings)["id"];
