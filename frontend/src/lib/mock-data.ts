import type {
  Activity,
  CanvasCourse,
  ChatMessage,
  Document,
  Flashcard,
  Notebook,
  QuizQuestion,
  ReferenceLink,
  Summary,
  User,
} from "@/lib/types";

export const currentUser: User = {
  id: "u_1",
  name: "Maya Thompson",
  email: "maya.t@university.edu",
  role: "Student",
};

export const notebooks: Notebook[] = [
  {
    id: "nb_1",
    title: "Organic Chemistry II",
    course: "CHEM 302",
    description: "Reaction mechanisms, spectroscopy, and synthesis pathways.",
    subject: "Chemistry",
    visibility: "Private",
    files: 8,
    status: "Ready",
    updatedAt: "2026-06-03T14:20:00Z",
    color: "from-brand-500 to-accent-purple",
    questionsAsked: 142,
  },
  {
    id: "nb_2",
    title: "Data Structures & Algorithms",
    course: "CS 201",
    description: "Trees, graphs, dynamic programming and complexity analysis.",
    subject: "Computer Science",
    visibility: "Shared with class",
    files: 12,
    status: "Ready",
    updatedAt: "2026-06-04T09:10:00Z",
    color: "from-accent-teal to-brand-500",
    questionsAsked: 318,
  },
  {
    id: "nb_3",
    title: "Macroeconomics",
    course: "ECON 210",
    description: "Fiscal policy, monetary systems and growth models.",
    subject: "Economics",
    visibility: "Private",
    files: 5,
    status: "Processing",
    updatedAt: "2026-06-04T11:45:00Z",
    color: "from-violet-500 to-brand-500",
    questionsAsked: 47,
  },
  {
    id: "nb_4",
    title: "Human Anatomy",
    course: "BIO 150",
    description: "Skeletal, muscular and nervous system fundamentals.",
    subject: "Biology",
    visibility: "Private",
    files: 6,
    status: "Ready",
    updatedAt: "2026-06-02T16:30:00Z",
    color: "from-rose-500 to-accent-purple",
    questionsAsked: 89,
  },
  {
    id: "nb_5",
    title: "Linear Algebra",
    course: "MATH 220",
    description: "Vector spaces, eigenvalues, and linear transformations.",
    subject: "Mathematics",
    visibility: "Shared with class",
    files: 9,
    status: "Failed",
    updatedAt: "2026-06-01T10:05:00Z",
    color: "from-amber-500 to-rose-500",
    questionsAsked: 73,
  },
  {
    id: "nb_6",
    title: "World History: Modern Era",
    course: "HIST 110",
    description: "Industrial revolution through the digital age.",
    subject: "History",
    visibility: "Private",
    files: 4,
    status: "Ready",
    updatedAt: "2026-05-30T13:00:00Z",
    color: "from-teal-500 to-cyan-500",
    questionsAsked: 51,
  },
];

export const documents: Document[] = [
  { id: "d_1", name: "Clayden_Organic_Chemistry.pdf", type: "pdf", size: "48.2 MB", notebookId: "nb_1", status: "ready", pages: 1280, uploadedAt: "2026-06-03T14:00:00Z" },
  { id: "d_2", name: "Lecture_12_Spectroscopy.pptx", type: "ppt", size: "12.4 MB", notebookId: "nb_1", status: "ready", pages: 42, uploadedAt: "2026-06-03T14:10:00Z" },
  { id: "d_3", name: "Lab_Notes_Week8.docx", type: "docx", size: "1.1 MB", notebookId: "nb_1", status: "ready", pages: 8, uploadedAt: "2026-06-03T14:15:00Z" },
  { id: "d_4", name: "CLRS_Algorithms.pdf", type: "pdf", size: "62.8 MB", notebookId: "nb_2", status: "ready", pages: 1312, uploadedAt: "2026-06-04T09:00:00Z" },
  { id: "d_5", name: "Graph_Traversal_Notes.txt", type: "txt", size: "240 KB", notebookId: "nb_2", status: "ready", pages: 14, uploadedAt: "2026-06-04T09:05:00Z" },
  { id: "d_6", name: "youtube.com/dijkstra-explained", type: "youtube", size: "—", notebookId: "nb_2", status: "indexing", uploadedAt: "2026-06-04T09:08:00Z" },
];

export const suggestedPrompts: string[] = [
  "Explain this chapter in simple words",
  "Summarize this topic",
  "Generate exam questions",
  "Create flashcards",
  "Compare these two concepts",
  "Where is this topic mentioned?",
];

export const chatHistory: ChatMessage[] = [
  {
    id: "m_1",
    role: "user",
    content: "Explain the SN1 reaction mechanism in simple words.",
  },
  {
    id: "m_2",
    role: "assistant",
    content:
      "The SN1 (Substitution Nucleophilic Unimolecular) reaction is a two-step process where the leaving group departs first to form a carbocation, which is then attacked by a nucleophile.",
    explanation:
      "Think of it like a relay race in two stages. First, the molecule drops off its 'leaving group' all on its own, creating a positively charged carbon (a carbocation). This is the slow, rate-determining step. Then, a nucleophile rushes in to bond with that positive carbon. Because the first step doesn't involve the nucleophile, the reaction rate only depends on the substrate concentration.",
    keyPoints: [
      "Two-step mechanism: ionization, then nucleophilic attack.",
      "Rate depends only on the substrate (first-order kinetics).",
      "Favored by tertiary carbons and polar protic solvents.",
      "Produces a racemic mixture due to the planar carbocation intermediate.",
    ],
    practiceQuestion:
      "Why does a tertiary alkyl halide undergo SN1 faster than a primary alkyl halide?",
    citations: [
      {
        id: "c_1",
        document: "Clayden_Organic_Chemistry.pdf",
        page: 421,
        chapter: "Ch. 15 — Nucleophilic Substitution",
        snippet:
          "In the SN1 mechanism the rate-determining step is the unimolecular ionization of the substrate to form a carbocation intermediate, which is subsequently trapped by the nucleophile…",
      },
      {
        id: "c_2",
        document: "Lecture_12_Spectroscopy.pptx",
        page: 12,
        chapter: "Slide 12 — Reaction Energetics",
        snippet:
          "Tertiary carbocations are stabilized by hyperconjugation and inductive effects, lowering the activation energy of the rate-determining step.",
      },
    ],
    feedback: null,
  },
];

export const summaries: Summary[] = [
  {
    id: "s_1",
    notebook: "Organic Chemistry II",
    type: "Chapter Summary",
    title: "Ch. 15 — Nucleophilic Substitution",
    content:
      "This chapter contrasts the SN1 and SN2 mechanisms, examining how substrate structure, nucleophile strength, leaving group ability, and solvent polarity dictate which pathway dominates.",
    bullets: [
      "SN1 is unimolecular and proceeds via a carbocation intermediate.",
      "SN2 is bimolecular with a single concerted backside-attack step.",
      "Steric hindrance favors SN1; strong nucleophiles favor SN2.",
      "Polar protic solvents stabilize SN1; polar aprotic favor SN2.",
    ],
    createdAt: "2026-06-03T15:00:00Z",
  },
  {
    id: "s_2",
    notebook: "Data Structures & Algorithms",
    type: "Exam Revision Summary",
    title: "Graph Algorithms — Exam Prep",
    content:
      "A focused revision sheet covering traversal strategies and shortest-path algorithms most likely to appear on the midterm.",
    bullets: [
      "BFS explores level by level; DFS goes deep using a stack/recursion.",
      "Dijkstra finds shortest paths with non-negative weights in O(E log V).",
      "Bellman-Ford handles negative weights and detects negative cycles.",
      "Topological sort applies only to directed acyclic graphs (DAGs).",
    ],
    createdAt: "2026-06-04T10:00:00Z",
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q_1",
    question: "Which factor most strongly favors an SN1 mechanism over SN2?",
    type: "MCQ",
    options: [
      "A strong nucleophile",
      "A tertiary carbon substrate",
      "A polar aprotic solvent",
      "A primary alkyl halide",
    ],
    answer: "A tertiary carbon substrate",
    explanation:
      "Tertiary substrates form stable carbocations and are too sterically hindered for backside attack, strongly favoring SN1.",
  },
  {
    id: "q_2",
    question: "The SN1 reaction follows second-order kinetics.",
    type: "True/False",
    options: ["True", "False"],
    answer: "False",
    explanation:
      "SN1 is first-order — the rate depends only on the concentration of the substrate, not the nucleophile.",
  },
  {
    id: "q_3",
    question: "Name the reactive intermediate formed in the rate-determining step of SN1.",
    type: "Short Answer",
    answer: "Carbocation",
    explanation:
      "The leaving group departs first, generating a planar carbocation intermediate that the nucleophile then attacks.",
  },
];

export const flashcards: Flashcard[] = [
  { id: "f_1", front: "What is a carbocation?", back: "A positively charged carbon atom with only three bonds and an empty p-orbital, acting as an electrophile.", deck: "Organic Chemistry II", known: false },
  { id: "f_2", front: "Define 'nucleophile'.", back: "An electron-rich species that donates a pair of electrons to form a new chemical bond.", deck: "Organic Chemistry II", known: true },
  { id: "f_3", front: "SN1 vs SN2 kinetics?", back: "SN1 is first-order (rate = k[substrate]); SN2 is second-order (rate = k[substrate][nucleophile]).", deck: "Organic Chemistry II", known: false },
  { id: "f_4", front: "Time complexity of Dijkstra's algorithm?", back: "O((V + E) log V) using a binary heap priority queue.", deck: "Data Structures", known: false },
  { id: "f_5", front: "What is a polar protic solvent?", back: "A solvent with O-H or N-H bonds (e.g. water, alcohols) that can hydrogen-bond and stabilize ions.", deck: "Organic Chemistry II", known: true },
  { id: "f_6", front: "When does BFS outperform DFS?", back: "When finding the shortest path in an unweighted graph, since BFS explores nodes in order of distance.", deck: "Data Structures", known: false },
];

export const referenceLinks: ReferenceLink[] = [
  { id: "r_1", url: "https://www.khanacademy.org/sn1-sn2", title: "Khan Academy: SN1 & SN2 Reactions", category: "Article", status: "Indexed", addedAt: "2026-06-02T10:00:00Z" },
  { id: "r_2", url: "https://youtube.com/watch?v=dijkstra", title: "Dijkstra's Algorithm Explained", category: "YouTube", status: "Indexed", addedAt: "2026-06-03T12:00:00Z" },
  { id: "r_3", url: "https://arxiv.org/abs/1706.03762", title: "Attention Is All You Need", category: "Research Paper", status: "Indexing", addedAt: "2026-06-04T08:00:00Z" },
  { id: "r_4", url: "https://docs.python.org/3/library", title: "Python Standard Library Docs", category: "Documentation", status: "Indexed", addedAt: "2026-05-29T09:00:00Z" },
];

export const canvasCourses: CanvasCourse[] = [
  { id: "cc_1", name: "Organic Chemistry II", code: "CHEM 302", files: 24, selected: true },
  { id: "cc_2", name: "Data Structures", code: "CS 201", files: 38, selected: true },
  { id: "cc_3", name: "Macroeconomics", code: "ECON 210", files: 16, selected: false },
  { id: "cc_4", name: "Calculus III", code: "MATH 230", files: 29, selected: false },
];

export const activities: Activity[] = [
  { id: "a_1", type: "chat", text: "Asked 4 questions in Organic Chemistry II", time: "12m ago" },
  { id: "a_2", type: "upload", text: "Uploaded CLRS_Algorithms.pdf to Data Structures", time: "1h ago" },
  { id: "a_3", type: "quiz", text: "Generated a 10-question quiz on Graph Algorithms", time: "3h ago" },
  { id: "a_4", type: "summary", text: "Created an exam revision summary for Ch. 15", time: "Yesterday" },
  { id: "a_5", type: "notebook", text: "Created notebook 'Macroeconomics'", time: "Yesterday" },
];

export const revisionTopics = [
  { topic: "SN1 vs SN2 Mechanisms", notebook: "Organic Chemistry II", strength: 42 },
  { topic: "Dynamic Programming", notebook: "Data Structures", strength: 58 },
  { topic: "Eigenvalues & Eigenvectors", notebook: "Linear Algebra", strength: 35 },
  { topic: "Fiscal Policy Multipliers", notebook: "Macroeconomics", strength: 64 },
];
