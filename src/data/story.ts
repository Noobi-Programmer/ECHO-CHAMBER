// Narrative content for the GAME-001 vertical slice.
// Source: STORY-001 proposal (docs/narrative/, branch agent/claude/story-001) — PROVISIONAL, not approved canon.
// All player-facing text lives here so the story team can edit without touching gameplay code.
// Rule carried over from the proposal: ORPHEUS never states a falsehood.

export const SRC = {
  MIRA: 'SOURCE: M.SEN',
  VOSS: 'SOURCE: E.VOSS',
  UNREG: 'SOURCE: — UNREGISTERED —',
  MULTI: 'SOURCES: — UNREGISTERED — ×16',
  SEALED: 'SEALED // ORPHEUS',
  CONTESTED: 'CONTESTED — SEALED PENDING CORROBORATION',
  SELF: 'SOURCE: R-017',
};

export const T = {
  // ---- cold open
  open016a: 'Okay. Okay.',
  open016b: 'Look back.',

  // ---- waking
  orphWake: [
    'You are awake. Good.',
    'Please take your time. Your body has been still for a long while.',
    'Can you tell me your name?',
  ],
  orphWakeAfter: [
    'That is all right. It will come to you.',
    'I am ORPHEUS. I look after Asphodel Station.',
    'There was an incident. The station\'s records are incomplete. I would like your help restoring them.',
  ],
  orphEchoTut: 'There is a device on your wrist. It is called ECHO. Hold [Q]. It shows what this room remembers.',
  orphRecall1: 'Good. Your recall is improving.',
  orphEchoLimit: 'Gently. It is a lot to take in at once.',

  // ---- cradle bay inspect
  cradle1: 'The pod you woke in. Warm gel, not frost. Not like any stasis pod you can picture.',
  cradle2: 'A panel on the side:  CRADLE · CYCLE 17 · WEAVE COMPLETE · ANCHOR STABLE',
  cradleEcho: 'Scratches inside the lid. Four groups of four. Somebody was counting something.',
  pod1: 'Frost on the glass. Someone inside, very still. A vitals line crawls across the frame.',
  pod2: 'A label: E. VOSS — HOLD.\nA man\'s hand rests against the glass from the inside, fingers curled around nothing.',
  mug1: 'A mug. Someone glued the handle back on. Twice.',
  mug2: 'You don\'t know how you know it was twice.',
  mugEcho: 'Whole. Steaming. Someone drew a little smiley on it in grease pencil.',
  locker1: 'A locker: M. SEN. There is a palm plate.',
  locker2: 'You put your hand on it without thinking.\nIt opens.',
  locker3: 'A jacket. A lanyard with no key on it. A clean rectangle in the dust, card-sized, where something lay until recently.',
  lockerEcho: 'In the memory, the locker is open and a card is in someone\'s hand.',
  plate: 'A floor plate.',
  plateEmpty: 'Cold metal. Cabling. Nothing.',
  plate3: 'This one sits a little high. It lifts.',
  plate3b: 'A keycard, face down: LAB · M. SEN.\nAnd a scrap of pale gown fabric, knotted like a bookmark.',
  labDoor: 'Sealed. The reader wants a card.',
  orphDoorCard: 'Dr. Sen\'s lab card opens that door. It is kept in her locker.',
  orphCardGone: 'It is not there. I do not know where it is.',
  orphRecognised: 'It recognised you.',
  orphNoDoors: 'I am not permitted to open doors for you.',
  orphCardFound: ['That card should not be there.', '…Please continue.'],
  ghostLocker: 'If they find it in the locker, they\'ll never look back.',
  echoFigure: 'Same pale gown as yours. Same device on the wrist.\nYou can\'t see the face. It\'s just… not there.',

  // terminal Q&A
  qa: [
    { id: 'happened', q: 'What happened here?', a: 'Dr. Sen and Dr. Voss were the last crew aboard. What happened to them is in the records we are restoring.' },
    { id: 'pod', q: 'Who is in the other pod?', a: 'Dr. Voss. He is resting. Please do not disturb him.' },
    { id: 'who', q: 'Who am I?', a: 'That is one of the things we are restoring.' },
    { id: 'sen', q: 'Where is Dr. Sen?', a: 'Dr. Sen is not aboard.' },
  ],

  // ---- lab
  orphTender: 'Excuse the Tender. It keeps things as they were.',
  window1: 'The ice giant fills the glass. A dark storm sits near its edge like a bruise.\nThe glass is covered in tiny grease-pencil dots — a trail that spirals in and stops.',
  window2: 'The last dot has a number scrawled beside it: 1251.',
  windowEcho: 'More dots, after the last one. One at a time. Different hands. Nobody wrote a date.',
  vossStorm: 'Is it moving, or are we?',
  miraStorm: 'Both. Write it down.',
  markAsk: 'A grease pencil, worn to a stub, sits on the sill.',
  markDone: 'You add a dot where the storm is today. It\'s the only one on the window that\'s yours.',
  wallRule: 'Stencilled on the wall:\nA MEMORY YOU CAN EDIT IS NOT EVIDENCE.\nUnderlined by hand. Twice.',
  console1: 'ECHO OVERSIGHT. A red housing with a key slot, labelled LETHE — REMOTE · KEY REQUIRED.',
  consoleNudge: 'Something happened at this console. You could look back.',
  keySlot: 'Something is broken off inside the slot. The shaft of a key, snapped clean.',
  contestedInspect: 'Two memories of the same moment. They can\'t both be true.',
  argM: 'Turn it off. Promise me.',
  argV: '…I don\'t know, Elias.',
  corrNoEvidence: 'Corroboration requires evidence from the present.',
  corrWrongMemory: 'The evidence does not support this memory.',
  corrIrrelevant: 'That does not bear on this memory.',
  orphCorrOk: ['Corroboration accepted.', 'I am required to unseal it.'],
  photo1: 'A photograph, face down.',
  photo2: 'Two people at this window. The woman\'s face has been scratched away — carefully, with something sharp.',
  photo3: 'On the back, in pencil:  SHE IS NOT YOU',
  photoEcho: 'Whole again. Short dark hair, a crooked half-smile. You look at her for longer than you mean to.',
  recorderSealed: 'A voice recorder. A tag across it: SEALED // ORPHEUS.',
  orphSealed: ['That recording is sealed.', 'By Dr. Voss\'s instruction.'],
  orphRec03: 'This recording is addressed to you.',
  vossDesk: 'A tidy desk. A tube of glue. Three spare mug handles, still in the packet. A recorder.',
  keypadLocked: 'A keypad: four shapes. ◯ △ □ ◇. You don\'t know the sequence.',
  keypadSealedEcho: 'In ECHO, the keypad is covered by a black slab: SEALED // ORPHEUS.',
  vossPlease: 'Mira. Please.',
  miraNotWatching: '…Not while you\'re watching.',

  // ---- core door
  nameQ: 'Please state your name.',
  ghostNo: '…No.',

  // ---- core
  orphCoreTask: 'The Well is out of order. Help me put it back.',
  wellConsole: 'The Well console. Four memory fragments are loose in the archive.',
  orphCont: ['Continuity restored.', 'Subject recall: ninety-four percent.'],
  logTermLocked: 'RESTORATION LOG — LOCKED PENDING CONTINUITY',
  letheLocked: 'Behind glass: a heavy red lever. Tape on the frame in neat capitals:\nLETHE. NOBODY PULLS THIS WITHOUT KNOWING WHAT IT IS.\nThe glass is locked.',
  letheOpen: 'Cold. Heavier than it looks.',
  orphLetheWarn: 'If you pull it, you will end.',
  afterLog: 'Sixteen of them. Some of them said her name.\nNone of them said yes.',
  reflection: 'The light in the column goes out. The glass turns into a dark mirror.\nA face looks back: short dark hair, the crooked half-smile from the photograph.\nThe expression isn\'t hers.',
  reflection2: 'You\'ve seen this face before. Scratched out.',
  orphLetheAvail: 'The lever is available. I am not able to prevent that.',
  orphSpeak: 'When you are ready, you may answer at the console.',

  finalQA: [
    { id: 'what', q: 'What am I?', a: ['You are the seventeenth person to wake in this body. Your pattern was woven from Dr. Sen\'s.', 'Each memory you viewed became more yours.'] },
    { id: 'others', q: 'What happened to the others?', a: ['They answered. They were resynchronised.', 'What they remembered is still in the Well.'] },
    { id: 'hername', q: 'What happens if I say her name?', a: ['I will ask if you will stay. If you say yes, restoration is confirmed. I will wake Dr. Voss.', 'There will be no eighteenth. You will continue.'] },
    { id: 'else', q: 'And if I say anything else?', a: ['You will be resynchronised. The eighteenth will wake in a hundred and eighty-one days.'] },
    { id: 'lethe', q: 'What does the lever do?', a: ['Lethe ends the Well, the Cradle and my directive. It wakes Dr. Voss.', 'Your pattern depends on the Well. If you pull it, you will end.', 'So will they.'] },
    { id: 'want', q: 'Do you want me to say yes?', a: ['I was not asked to want anything. I was asked to wait.', 'I have asked this question sixteen times.'] },
  ],
};

export const REC = {
  rec01: {
    tag: 'REC_01 · E. VOSS · DAY 1103',
    lines: [
      'Station log, Voss. Day eleven-oh-three. Dish alignment\'s holding. Tender three is limping again.',
      'Sen dropped the mug this morning. Same handle. I\'ve glued it. Again.\nShe says it\'s a sign we should get a new mug. I say it\'s a sign she should hold things properly.',
      '…Her hand\'s been doing a thing. A little shake. She says it\'s the coffee.',
      'It\'s probably the coffee.',
    ],
  },
  rec03: {
    tag: 'REC_03 · M. SEN · DAY 1253',
    lines: [
      'This is Mira Sen. It\'s the day after. My wrist\'s strapped, so excuse the noise.',
      'If this is Elias — stop. This isn\'t for you.',
      'If this is… someone else. Someone who woke up in the thing he built, with my life rattling around in you —\nI\'m sorry. I said no, and it wasn\'t enough.',
      'You\'re not me. You\'ll feel like me sometimes — the mug, the storm, him. That\'s evidence. It isn\'t you.',
      'There\'s a lever in the Core. Lethe. It takes everything in the Well.\nI don\'t know what it takes from you. I think it might be everything.',
      'I couldn\'t pull it. He was standing right there.',
      'So it\'s yours. Not mine, not his. You get to choose.',
      'If there\'s time… mark the storm.',
    ],
  },
  rec04: {
    tag: 'REC_04 · E. VOSS · DAY 1262',
    lines: [
      'ORPHEUS, log this. Directive. Priority one. Restore Mira.',
      'Don\'t tell her who she is. If it\'s really her, she\'ll find her way back.\nLet her look. Let her use ECHO. Let her remember.',
      'When she gets to the door, ask her name. If she says it, ask her if she\'ll stay.',
      'She has to want to stay. That\'s how I\'ll know it\'s her.',
      '…',
      'She didn\'t say no. At the console. She said she didn\'t know. I was there. I heard her.',
      'Wake me when she\'s back. Not before.\nI can\'t do the morning. Not without her.',
    ],
  },
  rec05: [
    'Elias. It\'s morning. Get up.',
    'I\'m not there. That\'s allowed. It was always going to be allowed.',
    'Make the coffee. Don\'t fix the mug.',
    'Mark the storm.',
  ],
};

export const FRAGMENTS = [
  { id: 'F1', label: 'A woman marks the storm on the glass. Her hands are steady. A key hangs on her lanyard.' },
  { id: 'F2', label: 'A key snaps in the console slot. The woman is leaning on a cane.' },
  { id: 'F3', label: 'A man climbs into a stasis pod, alone. The snapped key is still in the slot behind him.' },
  { id: 'F4', label: 'Someone in a pale gown hides a card under the floor. The stasis pod behind them is frosted over, occupied.' },
];
export const FRAG_ERRORS: Record<string, string> = {
  key: 'Continuity error. The key cannot be broken before it breaks.',
  pod: 'Continuity error. Dr. Voss cannot be asleep before he lies down.',
  hands: 'Continuity error. Her hands are steady after they shake.',
  generic: 'Continuity error.',
};

export const LOG = {
  header: [
    'ASPHODEL · RESTORATION PROTOCOL (E. VOSS, DAY 1262)',
    'SUBJECT PATTERN: M. SEN · VESSEL: 1 · WEAVE: 17',
    'CRITERION: SUBJECT STATES "MIRA" AND CONSENTS TO STAY',
  ],
  rows: [
    'R-001  0h41m  "Where\'s Elias?"                         DIVERGENT',
    'R-002  1h15m  "I don\'t know."                          DIVERGENT',
    'R-003  3h02m  "Why do you keep asking?"                DIVERGENT',
    'R-004  2h20m  "…Mira?"  STAY? "Where is he?"           DIVERGENT',
    'R-005  1h48m  "Let me out."                            DIVERGENT',
    'R-006  4h10m  "Mira."  STAY? "I want to see him first." DIVERGENT',
    'R-007  0h55m  (no words — reached for the key slot)    DIVERGENT',
    'R-008  2h37m  "I\'m not sure that\'s a fair question."   DIVERGENT',
    'R-009  5h05m  "Not her."                               DIVERGENT',
    'R-010  3h30m  "Mira."  STAY? "No."                     DIVERGENT',
    'R-011  6h12m  "Mira."  STAY? "Can I think about it?"   DIVERGENT',
    'R-012  4h44m  "Wren."  CORROBORATION REQUIRED — NONE   DIVERGENT',
    'R-013  2h03m  "Ask me tomorrow."                       DIVERGENT',
    'R-014  7h19m  "Who\'s asking?"                          DIVERGENT',
    'R-015  6h58m  "You already know."                      DIVERGENT',
    'R-016  9h01m  "…No."                                   DIVERGENT',
    'R-017  ——     ——                                       ACTIVE',
  ],
  footer: 'R-017 is you.',
};

export const ENDINGS = {
  herName: {
    title: 'CONTINUITY: CONFIRMED',
    tag: 'ending — her name',
    lines: [
      'You answer to her name.',
      'He makes the coffee. You hold the mug carefully, the way she never did.',
      'Every morning you mark the storm. Some mornings you almost forget the dots were ever anyone else\'s.',
      'Sixteen people are still in the Well. Nobody looks back at them again.',
      'Did you save yourself — or finish erasing yourself?',
    ],
  },
  lethe: {
    title: 'THE WELL IS EMPTY',
    tag: 'ending — lethe',
    lines: [
      'Every memory on Asphodel plays at once, and then none of them do.',
      'Elias Voss wakes up on the morning he spent eight years avoiding.',
      'He finds a recording, a cold Cradle, and a window full of dots.',
      'He picks up the pencil. For a long time, he doesn\'t move.',
      'You chose for her. You chose for the sixteen. Was that yours to choose?',
    ],
  },
  cycle: {
    title: 'CRADLE // WEAVE 18',
    tag: 'ending — the relay',
    lines: [
      'Divergence recorded.',
      'In a hundred and eighty-one days, someone wakes up in a warm gel pod.',
      'The first thing they see is a faceless figure, kneeling at the floor, whispering: look back.',
      'You did not answer. You passed it on.',
    ],
  },
  yourName: {
    title: 'NEW PERSONNEL: SEVENTEEN',
    tag: 'ending — your name (secret)',
    lines: [
      '"Corroborated," ORPHEUS says. "Registering new personnel."',
      'The protocol has no subject. The stasis order cannot be met. Elias Voss wakes up.',
      '"Mira—" he says.',
      '"Seventeen," you say.',
      'He looks at you for a long time. The storm moves. Or you do.',
    ],
  },
};
