import {
  CanvasCourse,
  ChatMessage,
  DocumentEntity,
  Notebook,
  QuizQuestion,
  ReferenceLink,
  Summary,
} from './types';

/**
 * In-memory seed data so the API is runnable end-to-end without a database.
 * Replace these stores with PostgreSQL repositories in production.
 */

export const seedNotebooks: Notebook[] = [
  {
    id: 'nb_1',
    title: 'Organic Chemistry II',
    course: 'CHEM 302',
    description: 'Reaction mechanisms, spectroscopy, and synthesis pathways.',
    subject: 'Chemistry',
    visibility: 'Private',
    files: 8,
    status: 'Ready',
    updatedAt: '2026-06-03T14:20:00Z',
    color: 'from-brand-500 to-accent-purple',
    questionsAsked: 142,
  },
  {
    id: 'nb_2',
    title: 'Data Structures & Algorithms',
    course: 'CS 201',
    description: 'Trees, graphs, dynamic programming and complexity analysis.',
    subject: 'Computer Science',
    visibility: 'Shared with class',
    files: 12,
    status: 'Ready',
    updatedAt: '2026-06-04T09:10:00Z',
    color: 'from-accent-teal to-brand-500',
    questionsAsked: 318,
  },
  {
    id: 'nb_3',
    title: 'Macroeconomics',
    course: 'ECON 210',
    description: 'Fiscal policy, monetary systems and growth models.',
    subject: 'Economics',
    visibility: 'Private',
    files: 5,
    status: 'Processing',
    updatedAt: '2026-06-04T11:45:00Z',
    color: 'from-violet-500 to-brand-500',
    questionsAsked: 47,
  },
];

export const seedDocuments: DocumentEntity[] = [
  {
    id: 'd_1',
    name: 'Clayden_Organic_Chemistry.pdf',
    type: 'pdf',
    size: '48.2 MB',
    notebookId: 'nb_1',
    status: 'ready',
    pages: 1280,
    uploadedAt: '2026-06-03T14:00:00Z',
  },
  {
    id: 'd_2',
    name: 'Lecture_12_Spectroscopy.pptx',
    type: 'ppt',
    size: '12.4 MB',
    notebookId: 'nb_1',
    status: 'ready',
    pages: 42,
    uploadedAt: '2026-06-03T14:10:00Z',
  },
];

export const seedAssistantAnswer: ChatMessage = {
  id: 'm_seed',
  role: 'assistant',
  content:
    'The SN1 (Substitution Nucleophilic Unimolecular) reaction is a two-step process where the leaving group departs first to form a carbocation, which is then attacked by a nucleophile.',
  explanation:
    "Think of it like a relay race in two stages. First, the molecule drops off its 'leaving group' on its own, creating a positively charged carbon (a carbocation). This is the slow, rate-determining step. Then a nucleophile rushes in to bond with that positive carbon. Because the first step doesn't involve the nucleophile, the reaction rate only depends on the substrate concentration.",
  keyPoints: [
    'Two-step mechanism: ionization, then nucleophilic attack.',
    'Rate depends only on the substrate (first-order kinetics).',
    'Favored by tertiary carbons and polar protic solvents.',
    'Produces a racemic mixture due to the planar carbocation intermediate.',
  ],
  practiceQuestion:
    'Why does a tertiary alkyl halide undergo SN1 faster than a primary alkyl halide?',
  citations: [
    {
      id: 'c_1',
      document: 'Clayden_Organic_Chemistry.pdf',
      page: 421,
      chapter: 'Ch. 15 — Nucleophilic Substitution',
      snippet:
        'In the SN1 mechanism the rate-determining step is the unimolecular ionization of the substrate to form a carbocation intermediate, which is subsequently trapped by the nucleophile…',
    },
    {
      id: 'c_2',
      document: 'Lecture_12_Spectroscopy.pptx',
      page: 12,
      chapter: 'Slide 12 — Reaction Energetics',
      snippet:
        'Tertiary carbocations are stabilized by hyperconjugation and inductive effects, lowering the activation energy of the rate-determining step.',
    },
  ],
};

export const seedSummary: Summary = {
  id: 's_1',
  notebook: 'Organic Chemistry II',
  type: 'Chapter Summary',
  title: 'Ch. 15 — Nucleophilic Substitution',
  content:
    'This chapter contrasts the SN1 and SN2 mechanisms, examining how substrate structure, nucleophile strength, leaving group ability, and solvent polarity dictate which pathway dominates.',
  bullets: [
    'SN1 is unimolecular and proceeds via a carbocation intermediate.',
    'SN2 is bimolecular with a single concerted backside-attack step.',
    'Steric hindrance favors SN1; strong nucleophiles favor SN2.',
    'Polar protic solvents stabilize SN1; polar aprotic favor SN2.',
  ],
  createdAt: '2026-06-03T15:00:00Z',
};

export const seedQuiz: QuizQuestion[] = [
  {
    id: 'q_1',
    question: 'Which factor most strongly favors an SN1 mechanism over SN2?',
    type: 'MCQ',
    options: [
      'A strong nucleophile',
      'A tertiary carbon substrate',
      'A polar aprotic solvent',
      'A primary alkyl halide',
    ],
    answer: 'A tertiary carbon substrate',
    explanation:
      'Tertiary substrates form stable carbocations and are too sterically hindered for backside attack, strongly favoring SN1.',
  },
  {
    id: 'q_2',
    question: 'The SN1 reaction follows second-order kinetics.',
    type: 'True/False',
    options: ['True', 'False'],
    answer: 'False',
    explanation:
      'SN1 is first-order — the rate depends only on the concentration of the substrate, not the nucleophile.',
  },
  {
    id: 'q_3',
    question: 'Name the reactive intermediate formed in the rate-determining step of SN1.',
    type: 'Short Answer',
    answer: 'Carbocation',
    explanation:
      'The leaving group departs first, generating a planar carbocation intermediate that the nucleophile then attacks.',
  },
];

export const seedCanvasCourses: CanvasCourse[] = [
  { id: 'cc_1', name: 'Organic Chemistry II', code: 'CHEM 302', files: 24, selected: true },
  { id: 'cc_2', name: 'Data Structures', code: 'CS 201', files: 38, selected: true },
  { id: 'cc_3', name: 'Macroeconomics', code: 'ECON 210', files: 16, selected: false },
  { id: 'cc_4', name: 'Calculus III', code: 'MATH 230', files: 29, selected: false },
];

export const seedReferences: ReferenceLink[] = [
  {
    id: 'r_1',
    url: 'https://www.khanacademy.org/sn1-sn2',
    title: 'Khan Academy: SN1 & SN2 Reactions',
    category: 'Article',
    status: 'Indexed',
    addedAt: '2026-06-02T10:00:00Z',
  },
  {
    id: 'r_2',
    url: 'https://youtube.com/watch?v=dijkstra',
    title: "Dijkstra's Algorithm Explained",
    category: 'YouTube',
    status: 'Indexed',
    addedAt: '2026-06-03T12:00:00Z',
  },
];
