/* ==========================================================
   data.js  -  Settings, dropdown options, sample data, state
   Edit this file to change departments, categories or demo data.
   ========================================================== */
window.UniShare = window.UniShare || {};

(function (app) {
  "use strict";

  app.config = {
    // Added to the "Fulfilled Peer Needs" counter (past help before this demo)
    fulfilledBaseline: 18,

    departments: [
      { value: "Computer Science", label: "Computer Science" },
      { value: "Electronics", label: "Electronics & Comm." },
      { value: "Mechanical", label: "Mechanical Engg." },
      { value: "Civil", label: "Civil Engineering" },
      { value: "Business & Management", label: "Business & Management" },
      { value: "Mathematics", label: "Mathematics" }
    ],

    semesters: [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
      return { value: "Sem " + n, label: "Semester " + n };
    }),

    categories: [
      { value: "Lecture Notes", cssClass: "cat-notes" },
      { value: "Previous Year Papers", cssClass: "cat-pyq" },
      { value: "Textbooks", cssClass: "cat-textbook" },
      { value: "Lab Equipment", cssClass: "cat-lab" }
    ],

    exchangeModes: [
      { value: "Free PDF", label: "Free PDF Download", cssClass: "mode-pdf" },
      { value: "Book Swap", label: "Book Swap / Exchange", cssClass: "mode-swap" },
      { value: "Borrow / Return", label: "Borrow & Return", cssClass: "mode-borrow" },
      { value: "Donate", label: "Free Pass-on / Donate", cssClass: "mode-donate" }
    ],

    urgencies: [
      { value: "Exam This Week", label: "Exam This Week" },
      { value: "Standard Need", label: "Standard Need" }
    ],

    // Text shown in the hero for every tab
    tabs: {
      all: {
        title: "Academic Notes, Past Papers & Lab Gear Exchange",
        text: "Access handwritten lecture notes, solved question banks, or swap textbooks and lab kits directly with peers on campus."
      },
      swap: {
        title: "Physical Textbook & Lab Equipment Swap",
        text: "Exchange semester textbooks, mini drafters, and electronics starter kits directly on campus."
      },
      saved: {
        title: "Your Saved Study Vault",
        text: "Quick access to your bookmarked lecture notes, solved PYQ bundles, and textbook listings."
      },
      requests: {
        title: "Peer Academic Request Board",
        text: "Post urgent syllabus needs, past exam papers, or borrow calculators and lab instruments from seniors."
      }
    }
  };

  /* ---------- Sample resources ---------- */
  app.defaultResources = [
    {
      id: "res-101",
      title: "Operating Systems Complete Handwritten Lecture Notes (Units 1 to 5)",
      courseCode: "CS-301", department: "Computer Science", semester: "Sem 5",
      category: "Lecture Notes", exchangeMode: "Free PDF",
      formatInfo: "18.4 MB PDF • 112 Pages",
      description: "Color-coded handwritten notes covering Process Synchronization, Deadlocks, Banker's Algorithm, Paging, Virtual Memory, and Disk Scheduling with step-by-step numericals.",
      contributor: "Aarav Mehta", contact: "Digital Repository • aarav.m@campus.edu",
      dateAdded: "2026-11-06", upvotes: 64, upvotedByMe: false, bookmarked: true, downloadsCount: 218, mine: false
    },
    {
      id: "res-102",
      title: "DBMS End-Sem & Mid-Sem Solved PYQ Bundle (2022–2025)",
      courseCode: "CS-304", department: "Computer Science", semester: "Sem 4",
      category: "Previous Year Papers", exchangeMode: "Free PDF",
      formatInfo: "9.6 MB PDF • 8 Solved Papers",
      description: "Last 4 years of university papers with complete SQL queries, Normalization (1NF to BCNF) proofs, serializability conflict graphs, and B+ Tree indexing solutions.",
      contributor: "Sneha Iyer", contact: "Digital Repository • sneha.iyer@campus.edu",
      dateAdded: "2026-11-08", upvotes: 82, upvotedByMe: false, bookmarked: false, downloadsCount: 340, mine: false
    },
    {
      id: "res-103",
      title: "Introduction to Algorithms (CLRS) 3rd Edition Paperback",
      courseCode: "CS-202", department: "Computer Science", semester: "Sem 4",
      category: "Textbooks", exchangeMode: "Book Swap",
      formatInfo: "Physical Book • Mint Condition",
      description: "Original Eastern Economy Edition paperback. Looking to swap for Computer Networks (Kurose & Ross) or can lend for the whole semester against library ID.",
      contributor: "Karan Malhotra", contact: "Hostel Block C, Room 312 • Meet at Central Cafe",
      dateAdded: "2026-11-02", upvotes: 39, upvotedByMe: false, bookmarked: true, downloadsCount: 19, mine: false
    },
    {
      id: "res-104",
      title: "Digital Logic & Arduino Uno R3 Sensor Kit with Breadboard",
      courseCode: "EC-204", department: "Electronics", semester: "Sem 3",
      category: "Lab Equipment", exchangeMode: "Borrow / Return",
      formatInfo: "Hardware Kit • Tested & Working",
      description: "Microcontroller kit with Arduino Uno R3, ultrasonic sensor, 16x2 LCD module, 7400-series logic ICs, and jumper wires. Available to borrow for lab evaluations.",
      contributor: "Divya Krishnan", contact: "ECE Lab Block Foyer • divya.k@campus.edu",
      dateAdded: "2026-11-05", upvotes: 47, upvotedByMe: false, bookmarked: false, downloadsCount: 27, mine: false
    },
    {
      id: "res-105",
      title: "Engineering Mathematics-II Laplace & Fourier Series Question Bank",
      courseCode: "MA-102", department: "Mathematics", semester: "Sem 2",
      category: "Previous Year Papers", exchangeMode: "Free PDF",
      formatInfo: "12.1 MB PDF • 75 Solved Problems",
      description: "Most repeated exam problems on Differential Equations, Laplace Transforms, Multiple Integrals, and Vector Calculus with shortcut verification tips.",
      contributor: "Vikramaditya Rao", contact: "Digital Repository • vikram.rao@campus.edu",
      dateAdded: "2026-11-01", upvotes: 53, upvotedByMe: false, bookmarked: false, downloadsCount: 194, mine: false
    },
    {
      id: "res-106",
      title: "Computer Networks Wireshark Lab Manual & Viva Questions Guide",
      courseCode: "CS-401", department: "Computer Science", semester: "Sem 6",
      category: "Lecture Notes", exchangeMode: "Free PDF",
      formatInfo: "6.8 MB PDF • 44 Pages",
      description: "Packet capture experiments (TCP 3-way handshake, DNS, HTTP, ARP, ICMP) plus 100+ frequently asked practical viva questions.",
      contributor: "Meera Deshmukh", contact: "Digital Repository • meera.d@campus.edu",
      dateAdded: "2026-11-09", upvotes: 41, upvotedByMe: false, bookmarked: false, downloadsCount: 145, mine: false
    },
    {
      id: "res-107",
      title: "Microeconomics & Market Structure Case Study Compendium",
      courseCode: "BM-105", department: "Business & Management", semester: "Sem 3",
      category: "Lecture Notes", exchangeMode: "Free PDF",
      formatInfo: "5.4 MB PDF • 38 Pages",
      description: "Diagrams and numerical case studies on Price Elasticity, Game Theory Nash Equilibrium, Oligopoly Pricing, and Consumer Surplus.",
      contributor: "Siddharth Jain", contact: "Management Wing Reading Room • siddharth@campus.edu",
      dateAdded: "2026-10-29", upvotes: 28, upvotedByMe: false, bookmarked: false, downloadsCount: 88, mine: false
    },
    {
      id: "res-108",
      title: "Omega Mini Drafter, Sheet Holder Tube & Set Squares Set",
      courseCode: "ME-101", department: "Mechanical", semester: "Sem 1",
      category: "Lab Equipment", exchangeMode: "Donate",
      formatInfo: "Drawing Kit • Rust-free & Calibrated",
      description: "Finished Engineering Graphics and passing on my steel mini drafter, roller scale, and drawing sheet canister for free to any first-year student.",
      contributor: "Harshvardhan Gill", contact: "Mechanical Workshop Gate • harsh.g@campus.edu",
      dateAdded: "2026-11-04", upvotes: 71, upvotedByMe: false, bookmarked: false, downloadsCount: 34, mine: false
    }
  ];

  /* ---------- Sample peer requests ---------- */
  app.defaultRequests = [
    {
      id: "req-201",
      title: "Looking for Compiler Design (CS-601) 2025 Mid-Sem Question Paper",
      courseCode: "CS-601", department: "Computer Science", urgency: "Exam This Week",
      details: "Need Prof. Sharma's section paper, especially LL(1) and LR parsing table questions.",
      studentName: "Pranav Kulkarni (Hostel A-118)", postedDate: "2026-11-09",
      fulfilled: false, fulfilledBy: "", mine: false
    },
    {
      id: "req-202",
      title: "Need Non-Programmable Scientific Calculator (Casio fx-991EX) for Friday Exam",
      courseCode: "ME-302", department: "Mechanical", urgency: "Exam This Week",
      details: "Numerical Methods exam on Friday morning (9 AM to 12 PM). Will return right after the paper!",
      studentName: "Ritika Sen (Day Scholar Lounge)", postedDate: "2026-11-08",
      fulfilled: false, fulfilledBy: "", mine: false
    },
    {
      id: "req-203",
      title: "Signals & Systems by Oppenheim 2nd Edition Textbook for 2 Weeks",
      courseCode: "EC-201", department: "Electronics", urgency: "Standard Need",
      details: "Library copies are all issued out. Happy to offer Digital Design by Morris Mano in exchange.",
      studentName: "Zaid Khan (ECE Sem 3)", postedDate: "2026-11-07",
      fulfilled: false, fulfilledBy: "", mine: false
    },
    {
      id: "req-204",
      title: "Structural Analysis-I Solved Tutorial Sheets (Units 3 & 4)",
      courseCode: "CE-305", department: "Civil", urgency: "Standard Need",
      details: "Looking for Moment Distribution Method and Slope Deflection solved class tutorial sheets.",
      studentName: "Neha Chawla (Civil Dept)", postedDate: "2026-11-01",
      fulfilled: true, fulfilledBy: "Shared by Kabir D.", mine: false
    }
  ];

  /* ---------- Live app state (shared by all files) ---------- */
  app.state = {
    resources: [],
    requests: [],
    tab: "all",
    category: "All",
    previewId: null
  };
})(window.UniShare);
