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
