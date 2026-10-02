import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import Database from 'better-sqlite3';
import { randomBytes, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.resolve(root, process.env.DATABASE_PATH ? path.dirname(process.env.DATABASE_PATH) : 'data');
const databasePath = path.resolve(root, process.env.DATABASE_PATH || 'data/study-hub.sqlite');
const uploadDir = path.resolve(root, process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const jwtSecret = process.env.JWT_SECRET || randomBytes(32).toString('hex');
if (!process.env.JWT_SECRET) console.warn('JWT_SECRET is unset; sessions will reset when the server restarts.');

const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, roll_number TEXT NOT NULL DEFAULT '',
    course TEXT NOT NULL DEFAULT 'Bachelor of Computer Applications',
    year INTEGER NOT NULL DEFAULT 1, semester INTEGER NOT NULL DEFAULT 1,
    avatar TEXT NOT NULL DEFAULT '', role TEXT NOT NULL DEFAULT 'student',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL DEFAULT '',
    year INTEGER NOT NULL, semester INTEGER NOT NULL,
    UNIQUE(name, year, semester)
  );
  CREATE TABLE IF NOT EXISTS semesters (
    id INTEGER PRIMARY KEY, year INTEGER NOT NULL, label TEXT NOT NULL,
    UNIQUE(year, id)
  );
  CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL, subject TEXT NOT NULL DEFAULT '', topic TEXT NOT NULL DEFAULT '',
    unit TEXT NOT NULL DEFAULT '', year INTEGER NOT NULL, semester INTEGER NOT NULL,
    exam_year TEXT NOT NULL DEFAULT '', exam_type TEXT NOT NULL DEFAULT '',
    deadline TEXT NOT NULL DEFAULT '', author TEXT NOT NULL DEFAULT '',
    resource_url TEXT NOT NULL DEFAULT '', video_id TEXT NOT NULL DEFAULT '',
    file_path TEXT NOT NULL DEFAULT '', file_name TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT 'all', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS exam_events (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, subject TEXT NOT NULL,
    exam_date TEXT NOT NULL, exam_time TEXT NOT NULL DEFAULT '',
    year INTEGER NOT NULL, semester INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS favorites (
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    material_id TEXT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(student_id, material_id)
  );
  CREATE TABLE IF NOT EXISTS activity (
    id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    material_id TEXT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    viewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS progress (
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject TEXT NOT NULL, topic TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(student_id, subject, topic)
  );
  CREATE TABLE IF NOT EXISTS quiz_scores (
    id TEXT PRIMARY KEY, student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, total INTEGER NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, subject TEXT NOT NULL, year INTEGER NOT NULL,
    semester INTEGER NOT NULL, questions TEXT NOT NULL
  );
`);

const semesters = [
  [1, 1, 'Semester 1'], [2, 1, 'Semester 2'],
  [3, 2, 'Semester 3'], [4, 2, 'Semester 4'],
  [5, 3, 'Semester 5'], [6, 3, 'Semester 6'],
];
const insertSemester = db.prepare('INSERT OR IGNORE INTO semesters (id, year, label) VALUES (?, ?, ?)');
semesters.forEach((item) => insertSemester.run(...item));

const seedSubjects = [
  ['Programming in C', 'BCA-101', 1, 1], ['Computer Fundamentals', 'BCA-102', 1, 1], ['Mathematics I', 'BCA-103', 1, 1],
  ['Data Structures', 'BCA-201', 1, 2], ['Digital Electronics', 'BCA-202', 1, 2], ['Mathematics II', 'BCA-203', 1, 2],
  ['Object Oriented Programming', 'BCA-301', 2, 3], ['Database Management Systems', 'BCA-302', 2, 3], ['Operating Systems', 'BCA-303', 2, 3],
  ['Java Programming', 'BCA-401', 2, 4], ['Computer Networks', 'BCA-402', 2, 4], ['Software Engineering', 'BCA-403', 2, 4],
  ['Python Programming', 'BCA-501', 3, 5], ['Web Development', 'BCA-502', 3, 5], ['Cloud Computing', 'BCA-503', 3, 5],
  ['Mobile Application Development', 'BCA-601', 3, 6], ['Information Security', 'BCA-602', 3, 6], ['Project Work', 'BCA-603', 3, 6],
];
const insertSubject = db.prepare('INSERT OR IGNORE INTO subjects (id, name, code, year, semester) VALUES (?, ?, ?, ?, ?)');
seedSubjects.forEach(([name, code, year, semester]) => insertSubject.run(randomUUID(), name, code, year, semester));

const insertStudent = db.prepare(`
  INSERT OR IGNORE INTO students (id, name, email, password_hash, roll_number, year, semester, role)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
if (process.env.NODE_ENV === 'production') {
  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  if (!adminEmail || /\s/.test(adminEmail) || adminEmail.length > 255 || adminPassword.length < 12) {
    throw new Error('Production startup requires ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters.');
  }
  insertStudent.run(randomUUID(), String(process.env.ADMIN_NAME || '').trim() || 'Hub Administrator', adminEmail, bcrypt.hashSync(adminPassword, 10), 'ADMIN-01', 1, 1, 'admin');
} else {
  insertStudent.run('demo-student', 'Aarav Sharma', 'student@bcastudyhub.edu', bcrypt.hashSync('Study123!', 10), 'BCA24-018', 1, 1, 'student');
  insertStudent.run('demo-admin', 'Hub Administrator', 'admin@bcastudyhub.edu', bcrypt.hashSync('Admin123!', 10), 'ADMIN-01', 1, 1, 'admin');
}

const materialsCount = db.prepare('SELECT COUNT(*) AS count FROM materials').get().count;
if (process.env.NODE_ENV !== 'production' && !materialsCount) {
  const samples = [
    ['Getting started with C', 'A clear first pass through program structure, compilation, and your first output.', 'notes', 'Programming in C', 'Structure of a C program', 'Unit 1', 1, 1, '', '', '', '', '', '', ''],
    ['Variables, types & operators', 'Practice declaring values and using arithmetic, relational, and logical operators.', 'notes', 'Programming in C', 'Variables and data types', 'Unit 2', 1, 1, '', '', '', '', '', '', ''],
    ['C programming · mid-term', 'Illustrative previous-paper listing for practice. Replace with a college-approved paper.', 'papers', 'Programming in C', '', '', 1, 1, '2024', 'Mid-Term', '', '', '', '', ''],
    ['Pointers explained visually', 'A short visual introduction to memory addresses and pointer basics.', 'videos', 'Programming in C', 'Pointers', 'Unit 4', 1, 1, '', '', '', '', 'https://www.youtube.com/watch?v=irqbmMNs2Bo', '', ''],
    ['C lab: first programs', 'Practice sequence, selection, and iteration with small lab exercises.', 'practical', 'Programming in C', 'Control flow', 'Unit 3', 1, 1, '', '', '', '', '', '', ''],
    ['Unit 1 · quick check', 'A short illustrative quiz on program structure and C fundamentals.', 'questions', 'Programming in C', 'C fundamentals', 'Unit 1', 1, 1, '', '', '', '', '', '', ''],
    ['Computer fundamentals · end-term', 'Illustrative previous-paper listing for practice. Replace with an approved paper.', 'papers', 'Computer Fundamentals', '', '', 1, 1, '2023', 'End-Term', '', '', '', '', ''],
    ['Introduction to data structures', 'Compare linear and non-linear structures, then choose the right representation.', 'notes', 'Data Structures', 'Data types and ADTs', 'Unit 1', 1, 2, '', '', '', '', '', '', ''],
    ['Arrays & linked lists', 'Review the trade-offs behind contiguous and linked storage.', 'notes', 'Data Structures', 'Linear structures', 'Unit 2', 1, 2, '', '', '', '', '', '', ''],
    ['DBMS normalization · practice', 'Work through functional dependencies and first three normal forms.', 'assignment', 'Database Management Systems', 'Normalization', 'Unit 3', 2, 3, '', '', '2026-10-16', '', '', '', ''],
    ['Java collections overview', 'A guided introduction to lists, sets, maps, and their typical use cases.', 'videos', 'Java Programming', 'Collections', 'Unit 3', 2, 4, '', '', '', '', 'https://www.youtube.com/watch?v=grEKMHGYyns', '', ''],
    ['Python: the language reference', 'Official documentation for Python syntax, built-in types, and standard library.', 'books', 'Python Programming', 'Language guide', '', 3, 5, '', '', '', 'Python Software Foundation', 'https://docs.python.org/3/', '', ''],
    ['Web development lab brief', 'Build an accessible multi-page interface with HTML, CSS, and JavaScript.', 'assignment', 'Web Development', 'Frontend foundations', 'Unit 1', 3, 5, '', '', '2026-10-21', '', '', '', ''],
    ['Networks · end-term', 'Illustrative previous-paper listing for practice. Replace with an approved paper.', 'papers', 'Computer Networks', '', '', 2, 4, '2024', 'End-Term', '', '', '', '', ''],
    ['SQL query patterns', 'A compact reference for SELECT, joins, grouping, and subqueries.', 'practical', 'Database Management Systems', 'SQL', 'Unit 2', 2, 3, '', '', '', '', '', '', ''],
    ['Software engineering · viva set', 'Illustrative short and long questions for revision and discussion.', 'questions', 'Software Engineering', 'Testing and quality', 'Unit 5', 2, 4, '', '', '', '', '', '', ''],
    ['OpenStax · Calculus Volume 1', 'A free, open-access reference for single-variable calculus fundamentals.', 'books', 'Mathematics I', 'Calculus', '', 1, 1, '', '', '', 'Gilbert Strang & Edwin Herman', 'https://openstax.org/details/books/calculus-volume-1', '', ''],
    ['Python fundamentals · quiz', 'Check your understanding of variables, control flow, and functions.', 'quiz', 'Python Programming', 'Fundamentals', 'Unit 1', 3, 5, '', '', '', '', '', '', ''],
  ];
  const insertMaterial = db.prepare(`
    INSERT INTO materials (id, title, description, type, subject, topic, unit, year, semester, exam_year, exam_type, deadline, author, resource_url, video_id, file_path, file_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  samples.forEach((item) => {
    const values = [...item, ''];
    if (values[2] === 'videos') {
      const videoUrl = new URL(values[12]);
      values[12] = '';
      values[13] = videoUrl.hostname === 'youtu.be' ? videoUrl.pathname.slice(1) : videoUrl.searchParams.get('v') || '';
    }
    insertMaterial.run(randomUUID(), ...values);
  });
}

const noticeCount = db.prepare('SELECT COUNT(*) AS count FROM notices').get().count;
if (!noticeCount) {
  db.prepare('INSERT INTO notices (id, title, body, audience) VALUES (?, ?, ?, ?)').run(
    randomUUID(), 'Welcome to your study hub', 'Your course materials are grouped by semester. Search by subject, topic, or unit to find a good next step.', 'all',
  );
  db.prepare('INSERT INTO notices (id, title, body, audience) VALUES (?, ?, ?, ?)').run(
    randomUUID(), 'Practical submissions', 'Check assignment deadlines in your semester view and confirm file requirements with your faculty.', 'all',
  );
}

const quizQuestions = process.env.NODE_ENV === 'production' ? [] : [
  {
    id: 'quiz-c-basics', title: 'C fundamentals · 3 questions', subject: 'Programming in C', year: 1, semester: 1,
    questions: [
      { question: 'Which function is the conventional entry point of a C program?', options: ['start()', 'main()', 'run()', 'init()'], answer: 1 },
      { question: 'Which header declares printf?', options: ['<stdlib.h>', '<string.h>', '<stdio.h>', '<math.h>'], answer: 2 },
      { question: 'Which operator accesses a structure member through a pointer?', options: ['.', '->', '::', '&'], answer: 1 },
    ],
  },
  {
    id: 'quiz-web-basics', title: 'Web foundations · 3 questions', subject: 'Web Development', year: 3, semester: 5,
    questions: [
      { question: 'Which attribute gives an input an accessible name?', options: ['placeholder', 'aria-label', 'color', 'target'], answer: 1 },
      { question: 'Which element represents the main page content?', options: ['<main>', '<aside>', '<mark>', '<small>'], answer: 0 },
      { question: 'Which HTTP method is usually used to retrieve a resource?', options: ['POST', 'PATCH', 'GET', 'DELETE'], answer: 2 },
    ],
  },
];
const insertQuiz = db.prepare('INSERT OR IGNORE INTO quizzes (id, title, subject, year, semester, questions) VALUES (?, ?, ?, ?, ?, ?)');
quizQuestions.forEach((quiz) => insertQuiz.run(quiz.id, quiz.title, quiz.subject, quiz.year, quiz.semester, JSON.stringify(quiz.questions)));

const app = express();
const trustedOrigins = new Set([
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean));
app.use(cors({
  origin(origin, callback) {
    if (!origin || trustedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('This origin is not allowed to access the API.'));
  },
}));
app.use(express.json({ limit: '1mb' }));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const auth = (req, res, next) => {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' });
  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Your session expired. Please sign in again.' });
  }
};
const adminOnly = (req, res, next) => req.user.role === 'admin'
  ? next()
  : res.status(403).json({ error: 'Administrator access is required.' });
const profileFor = (id) => db.prepare(`
  SELECT id, name, email, roll_number AS rollNumber, course, year, semester, avatar, role
  FROM students WHERE id = ?
`).get(id);
const makeToken = (student) => jwt.sign(
  { sub: student.id, role: student.role, name: student.name },
  jwtSecret,
  { expiresIn: '12h' },
);
const issueSession = (student) => ({ token: makeToken(student), user: profileFor(student.id) });
const validTerm = (year, semester) => Number.isInteger(Number(year)) && Number.isInteger(Number(semester))
  && db.prepare('SELECT 1 FROM semesters WHERE id = ? AND year = ?').get(Number(semester), Number(year));
const loginAttempts = new Map();
const limitLoginAttempts = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'local';
  const attempts = (loginAttempts.get(key) || []).filter((timestamp) => now - timestamp < 15 * 60 * 1000);
  if (attempts.length >= 10) return res.status(429).json({ error: 'Too many sign-in attempts. Wait 15 minutes and try again.' });
  attempts.push(now);
  loginAttempts.set(key, attempts);
  if (loginAttempts.size > 1000) {
    for (const [ip, stamps] of loginAttempts) {
      if (!stamps.some((timestamp) => now - timestamp < 15 * 60 * 1000)) loginAttempts.delete(ip);
    }
  }
  return next();
};

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/login', limitLoginAttempts, async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const role = req.body.role === 'admin' ? 'admin' : 'student';
  if (!email || !password) return res.status(400).json({ error: 'Enter your email and password.' });
  const student = db.prepare('SELECT * FROM students WHERE email = ? AND role = ?').get(email, role);
  if (!student || !(await bcrypt.compare(password, student.password_hash))) {
    return res.status(401).json({ error: 'That email and password did not match. Please try again.' });
  }
  loginAttempts.delete(req.ip || req.socket.remoteAddress || 'local');
  return res.json(issueSession(student));
});

app.post('/api/auth/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const year = Number(req.body.year);
  const semester = Number(req.body.semester);
  if (name.length < 2 || email.length < 3 || email.length > 255 || /\s/.test(email) || password.length < 8 || !validTerm(year, semester)) {
    return res.status(400).json({ error: 'Add your name, a valid email, a valid year and semester, and a password of at least 8 characters.' });
  }
  try {
    const id = randomUUID();
    const roll = String(req.body.rollNumber || '').trim();
    db.prepare(`
      INSERT INTO students (id, name, email, password_hash, roll_number, year, semester)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, await bcrypt.hash(password, 10), roll, year, semester);
    return res.status(201).json(issueSession(db.prepare('SELECT * FROM students WHERE id = ?').get(id)));
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'An account already uses that email.' });
    throw error;
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = profileFor(req.user.sub);
  if (!user) return res.status(401).json({ error: 'This account is no longer available.' });
  return res.json({ user });
});

app.get('/api/semesters', (_req, res) => res.json(db.prepare('SELECT id, year, label FROM semesters ORDER BY id').all()));
app.get('/api/subjects', (req, res) => {
  const year = Number(req.query.year);
  const semester = Number(req.query.semester);
  if (year && semester) return res.json(db.prepare('SELECT id, name, code, year, semester FROM subjects WHERE year = ? AND semester = ? ORDER BY name').all(year, semester));
  return res.json(db.prepare('SELECT id, name, code, year, semester FROM subjects ORDER BY year, semester, name').all());
});

const materialSelect = `
  SELECT m.id, m.title, m.description, m.type, m.subject, m.topic, m.unit,
    m.year, m.semester, m.exam_year AS examYear, m.exam_type AS examType,
    m.deadline, m.author, m.resource_url AS resourceUrl, m.file_name AS fileName,
    CASE WHEN m.video_id != '' THEN 'https://www.youtube.com/embed/' || m.video_id ELSE '' END AS embedUrl,
    m.created_at AS createdAt
  FROM materials m
`;
app.get('/api/materials', auth, (req, res) => {
  const clauses = [];
  const values = [];
  const term = Number(req.query.semester);
  const year = Number(req.query.year);
  if (req.user.role !== 'admin') {
    clauses.push('(m.year = ? AND m.semester = ?)');
    values.push(profileFor(req.user.sub).year, profileFor(req.user.sub).semester);
  } else if (year && term) {
    clauses.push('(m.year = ? AND m.semester = ?)');
    values.push(year, term);
  } else if (year) {
    clauses.push('m.year = ?');
    values.push(year);
  }
  if (req.query.subject) { clauses.push('m.subject = ?'); values.push(String(req.query.subject)); }
  if (req.query.type && req.query.type !== 'all') { clauses.push('m.type = ?'); values.push(String(req.query.type)); }
  if (req.query.unit) { clauses.push('m.unit = ?'); values.push(String(req.query.unit)); }
  const search = String(req.query.search || '').trim();
  if (search) {
    clauses.push('(m.title LIKE ? OR m.subject LIKE ? OR m.topic LIKE ? OR m.unit LIKE ? OR m.description LIKE ?)');
    const needle = `%${search.replace(/[%_]/g, '\\$&')}%`;
    values.push(needle, needle, needle, needle, needle);
  }
  const sql = materialSelect + (clauses.length ? ` WHERE ${clauses.join(' AND ')}` : '') + ' ORDER BY m.created_at DESC, m.title COLLATE NOCASE';
  return res.json(db.prepare(sql).all(...values));
});

app.get('/api/materials/:id/file', auth, (req, res) => {
  const material = db.prepare('SELECT file_path, file_name, year, semester FROM materials WHERE id = ?').get(req.params.id);
  if (!material) return res.status(404).json({ error: 'This material could not be found.' });
  if (req.user.role !== 'admin') {
    const user = profileFor(req.user.sub);
    if (user.year !== material.year || user.semester !== material.semester) return res.status(403).json({ error: 'This file is outside your current semester.' });
  }
  if (!material.file_path || !fs.existsSync(material.file_path)) return res.status(404).json({ error: 'No uploaded file is available for this material.' });
  return res.download(material.file_path, material.file_name);
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = new Set(['application/pdf', 'text/plain', 'application/zip']);
    if (!allowed.has(file.mimetype)) return cb(new Error('Upload a PDF, text file, or ZIP archive.'));
    return cb(null, true);
  },
});
const videoIdFromUrl = (value) => {
  try {
    const url = new URL(value);
    if (url.hostname === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      if (url.pathname === '/watch') return url.searchParams.get('v') || '';
      const parts = url.pathname.split('/').filter(Boolean);
      if (['embed', 'shorts', 'live'].includes(parts[0])) return parts[1] || '';
    }
  } catch { return ''; }
  return '';
};
const parseMaterialInput = (body) => {
  const year = Number(body.year);
  const semester = Number(body.semester);
  const type = String(body.type || '');
  const title = String(body.title || '').trim();
  if (title.length < 2 || !['notes', 'papers', 'videos', 'assignment', 'practical', 'questions', 'books', 'quiz'].includes(type) || !validTerm(year, semester)) {
    return { error: 'Add a title, choose a supported material type, and select a valid year and semester.' };
  }
  const url = String(body.resourceUrl || '').trim();
  const videoId = type === 'videos' ? videoIdFromUrl(url) : '';
  if (type === 'videos' && !videoId) return { error: 'Enter a valid YouTube watch, share, or embed URL.' };
  if (url && !/^https?:\/\//i.test(url)) return { error: 'Enter a resource link beginning with https:// or http://.' };
  return {
    values: {
      title, description: String(body.description || '').trim().slice(0, 3000), type,
      subject: String(body.subject || '').trim().slice(0, 160), topic: String(body.topic || '').trim().slice(0, 200),
      unit: String(body.unit || '').trim().slice(0, 80), year, semester,
      examYear: String(body.examYear || '').trim().slice(0, 12), examType: String(body.examType || '').trim().slice(0, 40),
      deadline: String(body.deadline || '').trim().slice(0, 40), author: String(body.author || '').trim().slice(0, 160),
      resourceUrl: type === 'videos' ? '' : url, videoId,
    },
  };
};
app.post('/api/materials', auth, adminOnly, upload.single('file'), (req, res) => {
  const result = parseMaterialInput(req.body);
  if (result.error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: result.error });
  }
  const id = randomUUID();
  const data = result.values;
  db.prepare(`
    INSERT INTO materials (id, title, description, type, subject, topic, unit, year, semester, exam_year, exam_type, deadline, author, resource_url, video_id, file_path, file_name)
    VALUES (@id, @title, @description, @type, @subject, @topic, @unit, @year, @semester, @examYear, @examType, @deadline, @author, @resourceUrl, @videoId, @filePath, @fileName)
  `).run({
    id, ...data, filePath: req.file?.path || '', fileName: req.file?.originalname || '',
  });
  return res.status(201).json(db.prepare(materialSelect + ' WHERE m.id = ?').get(id));
});
app.put('/api/materials/:id', auth, adminOnly, upload.single('file'), (req, res) => {
  const existing = db.prepare('SELECT * FROM materials WHERE id = ?').get(req.params.id);
  if (!existing) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(404).json({ error: 'This material could not be found.' });
  }
  const result = parseMaterialInput(req.body);
  if (result.error) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: result.error });
  }
  const data = result.values;
  const filePath = req.file?.path || existing.file_path;
  const fileName = req.file?.originalname || existing.file_name;
  db.prepare(`
    UPDATE materials SET title=@title, description=@description, type=@type, subject=@subject, topic=@topic,
    unit=@unit, year=@year, semester=@semester, exam_year=@examYear, exam_type=@examType,
    deadline=@deadline, author=@author, resource_url=@resourceUrl, video_id=@videoId, file_path=@filePath, file_name=@fileName
    WHERE id=@id
  `).run({ id: req.params.id, ...data, filePath, fileName });
  if (req.file && existing.file_path && fs.existsSync(existing.file_path)) fs.unlinkSync(existing.file_path);
  return res.json(db.prepare(materialSelect + ' WHERE m.id = ?').get(req.params.id));
});
app.delete('/api/materials/:id', auth, adminOnly, (req, res) => {
  const material = db.prepare('SELECT file_path FROM materials WHERE id = ?').get(req.params.id);
  if (!material) return res.status(404).json({ error: 'This material could not be found.' });
  db.prepare('DELETE FROM materials WHERE id = ?').run(req.params.id);
  if (material.file_path && fs.existsSync(material.file_path)) fs.unlinkSync(material.file_path);
  return res.status(204).end();
});

app.get('/api/profile', auth, (req, res) => res.json(profileFor(req.user.sub)));
app.patch('/api/profile', auth, (req, res) => {
  const name = String(req.body.name || '').trim();
  const roll = String(req.body.rollNumber || '').trim();
  const avatar = String(req.body.avatar || '').trim();
  const year = Number(req.body.year);
  const semester = Number(req.body.semester);
  if (name.length < 2 || !validTerm(year, semester)) return res.status(400).json({ error: 'Add a name and choose a valid year and semester.' });
  if (avatar && (avatar.length > 2000 || !/^https?:\/\/\S+$/i.test(avatar))) return res.status(400).json({ error: 'Profile pictures must use a valid http:// or https:// image URL.' });
  db.prepare('UPDATE students SET name = ?, roll_number = ?, avatar = ?, year = ?, semester = ? WHERE id = ?').run(name, roll, avatar, year, semester, req.user.sub);
  return res.json(profileFor(req.user.sub));
});
app.put('/api/profile/password', auth, async (req, res) => {
  const current = String(req.body.currentPassword || '');
  const next = String(req.body.newPassword || '');
  const student = db.prepare('SELECT password_hash FROM students WHERE id = ?').get(req.user.sub);
  if (next.length < 8) return res.status(400).json({ error: 'Use at least 8 characters for your new password.' });
  if (!student || !(await bcrypt.compare(current, student.password_hash))) return res.status(400).json({ error: 'Your current password was not correct.' });
  db.prepare('UPDATE students SET password_hash = ? WHERE id = ?').run(await bcrypt.hash(next, 10), req.user.sub);
  return res.json({ message: 'Password updated. Your current session remains active.' });
});

app.get('/api/favorites', auth, (req, res) => res.json(db.prepare(materialSelect + `
  JOIN favorites f ON f.material_id = m.id
  WHERE f.student_id = ?
  ORDER BY f.created_at DESC
`).all(req.user.sub)));
app.post('/api/favorites/:id', auth, (req, res) => {
  const material = db.prepare('SELECT id, year, semester FROM materials WHERE id = ?').get(req.params.id);
  if (!material) return res.status(404).json({ error: 'This material could not be found.' });
  if (req.user.role !== 'admin') {
    const user = profileFor(req.user.sub);
    if (user.year !== material.year || user.semester !== material.semester) return res.status(403).json({ error: 'This material is outside your current semester.' });
  }
  db.prepare('INSERT OR IGNORE INTO favorites (student_id, material_id) VALUES (?, ?)').run(req.user.sub, req.params.id);
  return res.status(204).end();
});
app.delete('/api/favorites/:id', auth, (req, res) => {
  db.prepare('DELETE FROM favorites WHERE student_id = ? AND material_id = ?').run(req.user.sub, req.params.id);
  return res.status(204).end();
});
app.post('/api/activity/:id', auth, (req, res) => {
  const material = db.prepare('SELECT id, year, semester FROM materials WHERE id = ?').get(req.params.id);
  if (!material) return res.status(404).json({ error: 'This material could not be found.' });
  if (req.user.role !== 'admin') {
    const user = profileFor(req.user.sub);
    if (user.year !== material.year || user.semester !== material.semester) return res.status(403).json({ error: 'This material is outside your current semester.' });
  }
  db.prepare('INSERT INTO activity (id, student_id, material_id) VALUES (?, ?, ?)').run(randomUUID(), req.user.sub, req.params.id);
  return res.status(204).end();
});
app.get('/api/activity/recent', auth, (req, res) => res.json(db.prepare(`
  ${materialSelect}
  JOIN activity a ON a.material_id = m.id
  WHERE a.student_id = ?
  GROUP BY m.id
  ORDER BY MAX(a.viewed_at) DESC
  LIMIT 8
`).all(req.user.sub)));
app.get('/api/progress', auth, (req, res) => {
  const user = profileFor(req.user.sub);
  return res.json(db.prepare('SELECT subject, topic, completed, updated_at AS updatedAt FROM progress WHERE student_id = ? ORDER BY updated_at DESC').all(user.id));
});
app.put('/api/progress', auth, (req, res) => {
  const subject = String(req.body.subject || '').trim();
  const topic = String(req.body.topic || '').trim();
  if (!subject || !topic) return res.status(400).json({ error: 'A subject and topic are required.' });
  db.prepare(`
    INSERT INTO progress (student_id, subject, topic, completed)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(student_id, subject, topic) DO UPDATE SET
      completed = excluded.completed, updated_at = CURRENT_TIMESTAMP
  `).run(req.user.sub, subject, topic, req.body.completed ? 1 : 0);
  return res.status(204).end();
});

app.get('/api/notices', auth, (_req, res) => res.json(db.prepare('SELECT id, title, body, audience, created_at AS createdAt FROM notices ORDER BY created_at DESC').all()));
app.post('/api/notices', auth, adminOnly, (req, res) => {
  const title = String(req.body.title || '').trim();
  const body = String(req.body.body || '').trim();
  if (title.length < 3 || body.length < 3) return res.status(400).json({ error: 'A notice needs a title and message.' });
  const id = randomUUID();
  db.prepare('INSERT INTO notices (id, title, body, audience) VALUES (?, ?, ?, ?)').run(id, title, body, 'all');
  return res.status(201).json(db.prepare('SELECT id, title, body, audience, created_at AS createdAt FROM notices WHERE id = ?').get(id));
});
app.delete('/api/notices/:id', auth, adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM notices WHERE id = ?').run(req.params.id);
  return result.changes ? res.status(204).end() : res.status(404).json({ error: 'This notice could not be found.' });
});

app.get('/api/quizzes', auth, (req, res) => {
  const user = profileFor(req.user.sub);
  const quizzes = db.prepare('SELECT id, title, subject, year, semester, questions FROM quizzes WHERE year = ? AND semester = ?').all(user.year, user.semester);
  return res.json(quizzes.map((quiz) => ({ ...quiz, questions: JSON.parse(quiz.questions).map(({ question, options }) => ({ question, options })) })));
});
app.post('/api/quizzes/:id/submit', auth, (req, res) => {
  const user = profileFor(req.user.sub);
  const quiz = db.prepare('SELECT questions, year, semester FROM quizzes WHERE id = ?').get(req.params.id);
  if (!quiz || quiz.year !== user.year || quiz.semester !== user.semester) return res.status(404).json({ error: 'This quiz is not available in your semester.' });
  const questions = JSON.parse(quiz.questions);
  if (!Array.isArray(req.body.answers) || req.body.answers.length !== questions.length) return res.status(400).json({ error: 'Answer each question before submitting.' });
  const score = questions.reduce((total, item, index) => total + (Number(req.body.answers[index]) === item.answer ? 1 : 0), 0);
  db.prepare('INSERT INTO quiz_scores (id, student_id, score, total) VALUES (?, ?, ?, ?)').run(randomUUID(), req.user.sub, score, questions.length);
  return res.json({ score, total: questions.length });
});
app.get('/api/quiz-scores', auth, (req, res) => res.json(db.prepare('SELECT score, total, created_at AS createdAt FROM quiz_scores WHERE student_id = ? ORDER BY created_at DESC LIMIT 8').all(req.user.sub)));
app.get('/api/timetable', auth, (req, res) => {
  const user = profileFor(req.user.sub);
  const papers = db.prepare(materialSelect + ` WHERE m.year = ? AND m.semester = ? AND m.type = 'papers' ORDER BY m.exam_year DESC`).all(user.year, user.semester);
  return res.json(papers);
});
app.get('/api/exams', auth, (req, res) => {
  if (req.user.role === 'admin' && (!req.query.year || !req.query.semester)) {
    return res.json(db.prepare(`
      SELECT id, title, subject, exam_date AS examDate, exam_time AS examTime, year, semester
      FROM exam_events ORDER BY exam_date, exam_time
    `).all());
  }
  const user = profileFor(req.user.sub);
  const year = req.user.role === 'admin' && req.query.year ? Number(req.query.year) : user.year;
  const semester = req.user.role === 'admin' && req.query.semester ? Number(req.query.semester) : user.semester;
  return res.json(db.prepare(`
    SELECT id, title, subject, exam_date AS examDate, exam_time AS examTime, year, semester
    FROM exam_events WHERE year = ? AND semester = ? ORDER BY exam_date, exam_time
  `).all(year, semester));
});
app.post('/api/exams', auth, adminOnly, (req, res) => {
  const title = String(req.body.title || '').trim();
  const subject = String(req.body.subject || '').trim();
  const examDate = String(req.body.examDate || '').trim();
  const examTime = String(req.body.examTime || '').trim().slice(0, 40);
  const year = Number(req.body.year);
  const semester = Number(req.body.semester);
  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(examDate) ? new Date(`${examDate}T00:00:00Z`) : null;
  if (title.length < 2 || subject.length < 2 || !parsedDate || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== examDate || !validTerm(year, semester)) {
    return res.status(400).json({ error: 'Add an exam name, subject, valid date, year, and semester.' });
  }
  const exam = { id: randomUUID(), title, subject, examDate, examTime, year, semester };
  db.prepare('INSERT INTO exam_events (id, title, subject, exam_date, exam_time, year, semester) VALUES (@id, @title, @subject, @examDate, @examTime, @year, @semester)').run(exam);
  return res.status(201).json(exam);
});
app.delete('/api/exams/:id', auth, adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM exam_events WHERE id = ?').run(req.params.id);
  return result.changes ? res.status(204).end() : res.status(404).json({ error: 'This exam date could not be found.' });
});

app.get('/api/admin/stats', auth, adminOnly, (_req, res) => {
  const count = (table, filter = '') => db.prepare(`SELECT COUNT(*) AS n FROM ${table} ${filter}`).get().n;
  return res.json({
    students: count('students', "WHERE role = 'student'"),
    materials: count('materials'),
    notes: count('materials', "WHERE type = 'notes'"),
    papers: count('materials', "WHERE type = 'papers'"),
    videos: count('materials', "WHERE type = 'videos'"),
    assignments: count('materials', "WHERE type = 'assignment'"),
  });
});
app.get('/api/admin/students', auth, adminOnly, (_req, res) => res.json(db.prepare(`
  SELECT id, name, email, roll_number AS rollNumber, year, semester, created_at AS createdAt
  FROM students WHERE role = 'student' ORDER BY created_at DESC
`).all()));
app.post('/api/admin/students', auth, adminOnly, async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const rollNumber = String(req.body.rollNumber || '').trim();
  const password = String(req.body.password || '');
  const year = Number(req.body.year);
  const semester = Number(req.body.semester);
  if (name.length < 2 || email.length < 3 || email.length > 255 || /\s/.test(email) || password.length < 8 || !validTerm(year, semester)) {
    return res.status(400).json({ error: 'Add a name, college ID/email, password of at least 8 characters, and valid year and semester.' });
  }
  const id = randomUUID();
  try {
    db.prepare(`
      INSERT INTO students (id, name, email, password_hash, roll_number, year, semester, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'student')
    `).run(id, name, email, await bcrypt.hash(password, 10), rollNumber, year, semester);
    return res.status(201).json(profileFor(id));
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'A student account already uses that email or college ID.' });
    throw error;
  }
});
app.put('/api/admin/students/:id', auth, adminOnly, (req, res) => {
  const student = db.prepare("SELECT id FROM students WHERE id = ? AND role = 'student'").get(req.params.id);
  if (!student) return res.status(404).json({ error: 'This student account could not be found.' });
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const rollNumber = String(req.body.rollNumber || '').trim();
  const year = Number(req.body.year);
  const semester = Number(req.body.semester);
  if (name.length < 2 || email.length < 3 || email.length > 255 || /\s/.test(email) || !validTerm(year, semester)) {
    return res.status(400).json({ error: 'Add a name, college ID/email, and valid year and semester.' });
  }
  try {
    db.prepare(`
      UPDATE students SET name = ?, email = ?, roll_number = ?, year = ?, semester = ?
      WHERE id = ?
    `).run(name, email, rollNumber, year, semester, req.params.id);
    return res.json(profileFor(req.params.id));
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'Another student account already uses that email or college ID.' });
    throw error;
  }
});
app.get('/api/admin/subjects', auth, adminOnly, (_req, res) => res.json(db.prepare('SELECT id, name, code, year, semester FROM subjects ORDER BY year, semester, name').all()));
app.post('/api/admin/subjects', auth, adminOnly, (req, res) => {
  const name = String(req.body.name || '').trim();
  const code = String(req.body.code || '').trim();
  const year = Number(req.body.year);
  const semester = Number(req.body.semester);
  if (name.length < 2 || !validTerm(year, semester)) return res.status(400).json({ error: 'Enter a subject name and valid year and semester.' });
  try {
    const subject = { id: randomUUID(), name, code, year, semester };
    db.prepare('INSERT INTO subjects (id, name, code, year, semester) VALUES (@id, @name, @code, @year, @semester)').run(subject);
    return res.status(201).json(subject);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'That subject already exists in this semester.' });
    throw error;
  }
});
app.delete('/api/admin/subjects/:id', auth, adminOnly, (req, res) => {
  const result = db.prepare('DELETE FROM subjects WHERE id = ?').run(req.params.id);
  return result.changes ? res.status(204).end() : res.status(404).json({ error: 'This subject could not be found.' });
});
app.post('/api/admin/semesters', auth, adminOnly, (req, res) => {
  const id = Number(req.body.id);
  const year = Number(req.body.year);
  const label = String(req.body.label || '').trim();
  if (!Number.isInteger(id) || id < 1 || id > 12 || !Number.isInteger(year) || year < 1 || year > 6 || label.length < 3) {
    return res.status(400).json({ error: 'Use a semester number from 1–12, year 1–6, and a descriptive label.' });
  }
  db.prepare('INSERT INTO semesters (id, year, label) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET year = excluded.year, label = excluded.label').run(id, year, label);
  return res.status(201).json({ id, year, label });
});
app.delete('/api/admin/students/:id', auth, adminOnly, (req, res) => {
  const result = db.prepare("DELETE FROM students WHERE id = ? AND role = 'student'").run(req.params.id);
  return result.changes ? res.status(204).end() : res.status(404).json({ error: 'This student could not be found.' });
});

app.use('/uploads', auth, (_req, res) => res.status(404).json({ error: 'Use the material download endpoint.' }));
const dist = path.join(root, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'Files must be 20 MB or smaller.' });
  if (error.message?.startsWith('Upload a PDF')) return res.status(400).json({ error: error.message });
  return res.status(500).json({ error: 'Something went wrong while processing that request.' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, '0.0.0.0', () => console.log(`BCA Study Hub API listening on http://localhost:${port}`));
