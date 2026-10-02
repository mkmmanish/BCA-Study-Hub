import { useCallback, useEffect, useMemo, useState } from 'react';

const icons = {
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22z" /><path d="M4 5.5v14A2.5 2.5 0 0 1 6.5 17H20M8 7h8M8 10h8" /></>,
  grid: <><rect x="3" y="3" width="8" height="8" rx="1" /><rect x="13" y="3" width="8" height="5" rx="1" /><rect x="13" y="10" width="8" height="11" rx="1" /><rect x="3" y="13" width="8" height="8" rx="1" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></>,
  bookmark: <><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
  moon: <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
  file: <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M13 2v7h7M8 14h8m-8 4h8" /></>,
  play: <><path d="m9 6 10 6-10 6z" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1A1.7 1.7 0 0 0 4.2 12H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1A1.7 1.7 0 0 0 20.6 9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.6Z" /></>,
};
const Icon = ({ name, size = 18, className = '' }) => (
  <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {icons[name] || icons.file}
  </svg>
);

const types = {
  notes: { label: 'Class notes', singular: 'Note', mark: 'N', tone: 'blue' },
  papers: { label: 'Past papers', singular: 'Paper', mark: 'P', tone: 'coral' },
  videos: { label: 'Video lectures', singular: 'Video', mark: 'V', tone: 'violet' },
  assignment: { label: 'Assignments', singular: 'Assignment', mark: 'A', tone: 'green' },
  practical: { label: 'Practical files', singular: 'Practical', mark: 'L', tone: 'yellow' },
  questions: { label: 'Important questions', singular: 'Questions', mark: 'Q', tone: 'pink' },
  books: { label: 'Reference shelf', singular: 'Reference', mark: 'R', tone: 'slate' },
  quiz: { label: 'Quick quizzes', singular: 'Quiz', mark: '✓', tone: 'green' },
};
const navItems = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'library', label: 'All materials', icon: 'book' },
  { id: 'favorites', label: 'Saved for later', icon: 'bookmark' },
  { id: 'recent', label: 'Recently viewed', icon: 'clock' },
];
const adminItems = [
  { id: 'adminMaterials', label: 'Study materials', icon: 'book' },
  { id: 'subjects', label: 'Subjects & terms', icon: 'grid' },
  { id: 'examSchedule', label: 'Exam timetable', icon: 'clock' },
  { id: 'students', label: 'Students', icon: 'user' },
  { id: 'notices', label: 'Notices', icon: 'bell' },
];
const years = [
  { year: 1, label: 'First year', short: '01' },
  { year: 2, label: 'Second year', short: '02' },
  { year: 3, label: 'Third year', short: '03' },
];
const termsForYear = (year, allTerms = []) => allTerms.filter((item) => item.year === Number(year));
const readableDate = (value) => {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(date);
};
const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('bca-token') || '');
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(() => localStorage.getItem('bca-theme') === 'dark');
  const [authRole, setAuthRole] = useState('student');
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [authYear, setAuthYear] = useState(1);
  const [authSemester, setAuthSemester] = useState(1);
  const [terms, setTerms] = useState([]);
  const [activeView, setActiveView] = useState('overview');
  const [materials, setMaterials] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [exams, setExams] = useState([]);
  const [notices, setNotices] = useState([]);
  const [progress, setProgress] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [scores, setScores] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({});
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentBusy, setStudentBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [materialDialog, setMaterialDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materialBusy, setMaterialBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [noticeForm, setNoticeForm] = useState({ title: '', body: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', year: '1', semester: '1' });
  const [semesterForm, setSemesterForm] = useState({ id: '', year: '1', label: '' });
  const [examForm, setExamForm] = useState({ title: '', subject: '', examDate: '', examTime: '', year: '1', semester: '1' });
  const [studentForm, setStudentForm] = useState({ name: '', email: '', rollNumber: '', password: '', year: 1, semester: 1 });
  const [profileForm, setProfileForm] = useState({ name: '', rollNumber: '', avatar: '', year: 1, semester: 1 });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [profileError, setProfileError] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('bca-theme', dark ? 'dark' : 'light');
  }, [dark]);
  useEffect(() => {
    const timer = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    fetch('/api/semesters').then((res) => res.json()).then(setTerms).catch(() => setTerms([]));
  }, []);
  useEffect(() => {
    const handleShortcut = (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k' || !user) return;
      event.preventDefault();
      const selector = user.role === 'student' ? '.library-search-input' : '.admin-search input';
      setActiveView(user.role === 'student' ? 'library' : 'adminMaterials');
      setSearch('');
      window.setTimeout(() => document.querySelector(selector)?.focus(), 50);
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [user]);

  const api = useCallback(async (url, options = {}) => {
    const headers = { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...(options.headers || {}) };
    const activeToken = options.token === undefined ? token : options.token;
    if (activeToken) headers.Authorization = `Bearer ${activeToken}`;
    const response = await fetch(`/api${url}`, { ...options, headers });
    if (response.status === 204) return null;
    const content = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(content.error || `Request failed (${response.status}).`);
    return content;
  }, [token]);

  const loadWorkspace = useCallback(async (activeUser) => {
    if (!activeUser) return;
    try {
      const isAdmin = activeUser.role === 'admin';
      const activeSemester = activeUser.semester;
      const jobs = [
        api(`/materials${isAdmin ? '' : `?year=${activeUser.year}&semester=${activeSemester}`}`),
        api(`/subjects${isAdmin ? '' : `?year=${activeUser.year}&semester=${activeSemester}`}`),
        api('/notices'),
        api('/exams'),
      ];
      if (isAdmin) {
        jobs.push(api('/admin/stats'), api('/admin/students'), api('/admin/subjects'));
      } else {
        jobs.push(api('/favorites'), api('/activity/recent'), api('/progress'), api('/quizzes'), api('/quiz-scores'));
      }
      const result = await Promise.all(jobs);
      setMaterials(result[0]);
      setAllMaterials(result[0]);
      setSubjects(result[1]);
      setNotices(result[2]);
      setExams(result[3]);
      if (isAdmin) {
        setStats(result[4]);
        setStudents(result[5]);
        setSubjects(result[6]);
      } else {
        setFavorites(result[4]);
        setRecent(result[5]);
        setProgress(result[6]);
        setQuizzes(result[7]);
        setScores(result[8]);
      }
      setProfileForm({ name: activeUser.name, rollNumber: activeUser.rollNumber || '', avatar: activeUser.avatar || '', year: activeUser.year, semester: activeUser.semester });
    } catch (error) {
      if (/session|sign in/i.test(error.message)) signOut();
      else setToast(error.message);
    }
  }, [api]);

  useEffect(() => {
    if (!token) { setUser(null); return; }
    api('/auth/me').then(({ user: currentUser }) => {
      setUser(currentUser);
      loadWorkspace(currentUser);
    }).catch(() => {
      localStorage.removeItem('bca-token');
      setToken('');
      setUser(null);
    });
  }, [token, api, loadWorkspace]);

  const signOut = () => {
    localStorage.removeItem('bca-token');
    setToken('');
    setUser(null);
    setActiveView('overview');
    setMobileNav(false);
    setSearch('');
    setTypeFilter('all');
    setSubjectFilter('all');
  };
  const submitAuth = async (event) => {
    event.preventDefault();
    setAuthBusy(true);
    setAuthError('');
    const data = new FormData(event.currentTarget);
    const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
    const body = authMode === 'register'
      ? { name: data.get('name'), email: data.get('email'), password: data.get('password'), rollNumber: data.get('rollNumber'), year: Number(authYear), semester: Number(authSemester) }
      : { email: data.get('email'), password: data.get('password'), role: authRole };
    try {
      const result = await api(endpoint, { method: 'POST', body: JSON.stringify(body), token: '' });
      localStorage.setItem('bca-token', result.token);
      setToken(result.token);
      setUser(result.user);
      setActiveView(result.user.role === 'admin' ? 'adminMaterials' : 'overview');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthBusy(false);
    }
  };
  const changeYear = (nextYear) => {
    const available = termsForYear(nextYear, terms);
    setAuthYear(Number(nextYear));
    setAuthSemester(available[0]?.id || 1);
  };
  const changeProfileYear = (nextYear) => {
    const available = termsForYear(nextYear, terms);
    setProfileForm((current) => ({ ...current, year: Number(nextYear), semester: available[0]?.id || 1 }));
  };
  const refreshStudentLibrary = async (currentUser = user) => {
    if (!currentUser) return;
    const params = new URLSearchParams();
    if (currentUser.role === 'admin' && currentUser.viewingYear) params.set('year', currentUser.viewingYear);
    if (search.trim()) params.set('search', search.trim());
    if (typeFilter !== 'all') params.set('type', typeFilter);
    if (subjectFilter !== 'all') params.set('subject', subjectFilter);
    try {
      const data = await api(`/materials${params.size ? `?${params.toString()}` : ''}`);
      setMaterials(data);
    } catch (error) { setToast(error.message); }
  };
  useEffect(() => {
    if (user && activeView === 'library') refreshStudentLibrary();
    // The selected filters are the intended search inputs for this request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, typeFilter, subjectFilter, activeView]);

  const toggleFavorite = async (material) => {
    const saved = favorites.some((item) => item.id === material.id);
    try {
      await api(`/favorites/${material.id}`, { method: saved ? 'DELETE' : 'POST' });
      setFavorites((current) => saved ? current.filter((item) => item.id !== material.id) : [material, ...current]);
      setToast(saved ? 'Removed from saved materials' : 'Saved for later');
    } catch (error) { setToast(error.message); }
  };
  const openMaterial = async (material) => {
    setSelectedMaterial(material);
    setMaterialDialog(true);
    if (user?.role === 'student') {
      try {
        await api(`/activity/${material.id}`, { method: 'POST' });
        const updated = await api('/activity/recent');
        setRecent(updated);
      } catch (error) { setToast(error.message); }
    }
  };
  const downloadMaterial = async (material) => {
    try {
      const response = await fetch(`/api/materials/${material.id}/file`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Could not download this file.');
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = material.fileName || material.title;
      link.click();
      URL.revokeObjectURL(objectUrl);
    } catch (error) { setToast(error.message); }
  };
  const toggleProgress = async (material) => {
    const complete = progress.some((item) => item.subject === material.subject && item.topic === material.topic && item.completed);
    try {
      await api('/progress', { method: 'PUT', body: JSON.stringify({ subject: material.subject, topic: material.topic || material.title, completed: !complete }) });
      const updated = await api('/progress');
      setProgress(updated);
      setToast(!complete ? 'Topic marked as complete' : 'Topic moved back to your study list');
    } catch (error) { setToast(error.message); }
  };
  const addMaterial = async (event) => {
    event.preventDefault();
    setMaterialBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const method = editingMaterial ? 'PUT' : 'POST';
      const url = editingMaterial ? `/materials/${editingMaterial.id}` : '/materials';
      await api(url, { method, body: form });
      setToast(editingMaterial ? 'Material updated' : 'Material added to the library');
      setMaterialDialog(false);
      setEditingMaterial(null);
      const updated = await api('/materials');
      setMaterials(updated);
      setAllMaterials(updated);
      const refreshed = await api('/admin/stats');
      setStats(refreshed);
    } catch (error) { setToast(error.message); }
    finally { setMaterialBusy(false); }
  };
  const deleteMaterial = async (material) => {
    if (!window.confirm(`Delete “${material.title}”? This cannot be undone.`)) return;
    try {
      await api(`/materials/${material.id}`, { method: 'DELETE' });
      const updated = await api('/materials');
      setMaterials(updated);
      setAllMaterials(updated);
      setStats(await api('/admin/stats'));
      setToast('Material deleted');
    } catch (error) { setToast(error.message); }
  };
  const publishNotice = async (event) => {
    event.preventDefault();
    try {
      await api('/notices', { method: 'POST', body: JSON.stringify(noticeForm) });
      setNotices(await api('/notices'));
      setNoticeForm({ title: '', body: '' });
      setToast('Notice published');
    } catch (error) { setToast(error.message); }
  };
  const deleteNotice = async (notice) => {
    if (!window.confirm(`Delete the notice “${notice.title}”?`)) return;
    try {
      await api(`/notices/${notice.id}`, { method: 'DELETE' });
      setNotices(await api('/notices'));
      setToast('Notice removed');
    } catch (error) { setToast(error.message); }
  };
  const saveSubject = async (event) => {
    event.preventDefault();
    try {
      await api('/admin/subjects', { method: 'POST', body: JSON.stringify(subjectForm) });
      setSubjects(await api('/admin/subjects'));
      setSubjectForm((current) => ({ ...current, name: '', code: '' }));
      setToast('Subject added');
    } catch (error) { setToast(error.message); }
  };
  const deleteSubject = async (subject) => {
    if (!window.confirm(`Remove “${subject.name}” from the subject list?`)) return;
    try {
      await api(`/admin/subjects/${subject.id}`, { method: 'DELETE' });
      setSubjects(await api('/admin/subjects'));
      setToast('Subject removed');
    } catch (error) { setToast(error.message); }
  };
  const saveSemester = async (event) => {
    event.preventDefault();
    try {
      await api('/admin/semesters', { method: 'POST', body: JSON.stringify(semesterForm) });
      setTerms(await api('/semesters'));
      setSemesterForm({ id: '', year: '1', label: '' });
      setToast('Semester structure updated');
    } catch (error) { setToast(error.message); }
  };
  const saveExam = async (event) => {
    event.preventDefault();
    try {
      await api('/exams', { method: 'POST', body: JSON.stringify(examForm) });
      setExams(await api('/exams'));
      setExamForm((current) => ({ ...current, title: '', subject: '', examDate: '', examTime: '' }));
      setToast('Exam timetable updated');
    } catch (error) { setToast(error.message); }
  };
  const deleteExam = async (exam) => {
    if (!window.confirm(`Remove “${exam.title}” from the exam timetable?`)) return;
    try {
      await api(`/exams/${exam.id}`, { method: 'DELETE' });
      setExams(await api('/exams'));
      setToast('Exam date removed');
    } catch (error) { setToast(error.message); }
  };
  const removeStudent = async (student) => {
    if (!window.confirm(`Remove ${student.name}'s student account?`)) return;
    try {
      await api(`/admin/students/${student.id}`, { method: 'DELETE' });
      setStudents(await api('/admin/students'));
      setStats(await api('/admin/stats'));
      setToast('Student account removed');
    } catch (error) { setToast(error.message); }
  };
  const openStudentEditor = (student = null) => {
    setEditingStudent(student);
    setStudentForm(student
      ? { name: student.name, email: student.email, rollNumber: student.rollNumber || '', password: '', year: student.year, semester: student.semester }
      : { name: '', email: '', rollNumber: '', password: '', year: 1, semester: termsForYear(1, terms)[0]?.id || 1 });
    setStudentDialogOpen(true);
  };
  const saveStudent = async (event) => {
    event.preventDefault();
    setStudentBusy(true);
    try {
      const url = editingStudent ? `/admin/students/${editingStudent.id}` : '/admin/students';
      await api(url, { method: editingStudent ? 'PUT' : 'POST', body: JSON.stringify(studentForm) });
      setStudents(await api('/admin/students'));
      setStats(await api('/admin/stats'));
      setStudentDialogOpen(false);
      setEditingStudent(null);
      setToast(editingStudent ? 'Student account updated' : 'Student account created');
    } catch (error) { setToast(error.message); }
    finally { setStudentBusy(false); }
  };
  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileError('');
    try {
      const updated = await api('/profile', { method: 'PATCH', body: JSON.stringify(profileForm) });
      setUser((current) => ({ ...current, ...updated }));
      await loadWorkspace({ ...user, ...updated });
      setToast('Profile saved');
    } catch (error) { setProfileError(error.message); }
  };
  const changePassword = async (event) => {
    event.preventDefault();
    setProfileError('');
    try {
      const result = await api('/profile/password', { method: 'PUT', body: JSON.stringify(passwordForm) });
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setToast(result.message);
    } catch (error) { setProfileError(error.message); }
  };
  const submitQuiz = async (quiz) => {
    try {
      const result = await api(`/quizzes/${quiz.id}/submit`, { method: 'POST', body: JSON.stringify({ answers: quizAnswers[quiz.id] || [] }) });
      setQuizResult({ ...result, quizId: quiz.id });
      setScores(await api('/quiz-scores'));
    } catch (error) { setToast(error.message); }
  };

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites]);
  const doneCount = progress.filter((item) => item.completed).length;
  const subjectCounts = useMemo(() => materials.reduce((count, item) => {
    if (item.subject) count[item.subject] = (count[item.subject] || 0) + 1;
    return count;
  }, {}), [materials]);
  const completionPercent = progress.length ? Math.round(doneCount / progress.length * 100) : 0;

  if (!user) return (
    <div className="auth-screen" data-theme={dark ? 'dark' : 'light'}>
      <div className="auth-left">
        <div className="brand brand-on-auth"><span className="brand-mark">b<span>.</span></span><span>BCA Study Hub</span></div>
        <div className="auth-visual">
          <div className="auth-orbit orbit-one"></div><div className="auth-orbit orbit-two"></div>
          <div className="paper-stack">
            <div className="paper-topline"><span>COURSE SCHEME</span><span>2026—27</span></div>
            <div className="paper-title">Your next<br /><em>good idea</em><br />starts here.</div>
            <div className="paper-rule"></div>
            <div className="paper-row"><b>SEM 01</b><span>Programming in C</span><i>↗</i></div>
            <div className="paper-row"><b>UNIT 02</b><span>Variables &amp; types</span><i>04</i></div>
            <div className="paper-row paper-row-coral"><b>UP NEXT</b><span>Mid-term · 16 Oct</span><i>!</i></div>
            <div className="paper-footer"><span>ONE SEMESTER AT A TIME</span><span>01 / 06</span></div>
          </div>
          <div className="auth-note note-coral"><span>✳</span> Make room for<br />the big picture.</div>
          <div className="auth-note note-blue">A better way<br />to study <span>↗</span></div>
        </div>
        <div className="auth-left-footer"><span>Built around your course.</span><span>Scroll less. Learn more.</span></div>
      </div>
      <div className="auth-right">
        <div className="auth-top-actions">
          <button className="icon-button" aria-label={dark ? 'Use light theme' : 'Use dark theme'} onClick={() => setDark(!dark)}><Icon name={dark ? 'sun' : 'moon'} /></button>
          <span>{authMode === 'login' ? 'New to the hub?' : 'Already have an account?'}</span>
          <button className="text-button" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}>{authMode === 'login' ? 'Create account' : 'Sign in'}</button>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-heading-mark">✳ &nbsp; STUDY, IN GOOD ORDER</div>
          <h1>{authMode === 'login' ? 'Welcome back.' : 'Make it yours.'}</h1>
          <p className="auth-subtitle">{authMode === 'login' ? 'Pick up right where your semester left off.' : 'Start with your course and we’ll bring the right resources together.'}</p>
          {authMode === 'login' && <div className="role-switch" role="tablist" aria-label="Account type">
            <button className={authRole === 'student' ? 'selected' : ''} onClick={() => { setAuthRole('student'); setAuthError(''); }}>Student</button>
            <button className={authRole === 'admin' ? 'selected' : ''} onClick={() => { setAuthRole('admin'); setAuthError(''); }}>Administrator</button>
          </div>}
          <form className="auth-form" onSubmit={submitAuth}>
            {authMode === 'register' && <>
              <label>Student name<input name="name" autoComplete="name" placeholder="e.g. Aarav Sharma" required minLength="2" /></label>
              <label>Roll number <span className="optional">(optional)</span><input name="rollNumber" placeholder="Your college roll number" /></label>
            </>}
            <label>{authRole === 'admin' && authMode === 'login' ? 'Admin email' : 'Email / college ID'}
              <input name="email" type={authMode === 'login' && authRole === 'admin' ? 'email' : 'text'} autoComplete={authMode === 'login' && authRole === 'admin' ? 'email' : 'username'} placeholder={authRole === 'admin' ? 'admin@college.edu' : 'you@college.edu or college ID'} required />
            </label>
            <label>Password<input name="password" type="password" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} placeholder={authMode === 'login' ? 'Enter your password' : 'At least 8 characters'} minLength={authMode === 'register' ? 8 : undefined} required />
            </label>
            {authMode === 'register' && <div className="form-split">
              <label>Year<select value={authYear} onChange={(event) => changeYear(event.target.value)}>{years.map((item) => <option key={item.year} value={item.year}>{item.label}</option>)}</select></label>
              <label>Semester<select value={authSemester} onChange={(event) => setAuthSemester(Number(event.target.value))}>{termsForYear(authYear, terms).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            </div>}
            {authMode === 'login' && authRole === 'student' && <div className="forgot-row"><button type="button" className="text-button" onClick={() => setToast('For a password reset, contact your college administrator. Self-service email recovery is not configured in this local demo.')}>Forgot password?</button></div>}
            {authError && <div className="inline-error" role="alert">{authError}</div>}
            <button className="button button-primary auth-submit" disabled={authBusy}>{authBusy ? 'One moment…' : authMode === 'login' ? 'Sign in to your hub' : 'Create your account'}<Icon name="arrow" size={16} /></button>
          </form>
          {authMode === 'login' && <div className="demo-credentials">
            <span className="demo-dot"></span><div><b>Local demo account</b><p>{authRole === 'student' ? 'student@bcastudyhub.edu · Study123!' : 'admin@bcastudyhub.edu · Admin123!'}</p></div>
          </div>}
          <p className="auth-legal">By continuing, you agree to use shared study resources responsibly.</p>
        </div>
        <div className="auth-right-footer">BCA STUDY HUB <span>·</span> MADE FOR THE WORK AHEAD</div>
      </div>
      {toast && <div className="toast" role="status">{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={14} /></button></div>}
    </div>
  );

  const currentTerm = terms.find((item) => item.id === user.semester);
  const navTo = (next) => { setActiveView(next); setMobileNav(false); setSearch(''); setTypeFilter('all'); setSubjectFilter('all'); setMaterials(allMaterials); };
  const materialOpen = (material) => (
    <button className="material-open" aria-label={`Open ${material.title}`} onClick={() => openMaterial(material)}>
      <span className={`type-stamp stamp-${types[material.type]?.tone || 'blue'}`}>{types[material.type]?.mark || 'R'}</span>
      <span className="material-copy"><b>{material.title}</b><span>{material.subject}{material.unit ? ` · ${material.unit}` : ''}{material.topic ? ` · ${material.topic}` : ''}</span></span>
      <span className="material-kind">{types[material.type]?.singular || 'Resource'}</span>
      <Icon name="arrow" size={17} />
    </button>
  );
  const favoriteButton = (material) => (
    <button className={`mini-icon ${favoriteIds.has(material.id) ? 'is-saved' : ''}`} title={favoriteIds.has(material.id) ? 'Remove bookmark' : 'Save for later'} aria-label={favoriteIds.has(material.id) ? 'Remove bookmark' : 'Save for later'} onClick={(event) => { event.stopPropagation(); toggleFavorite(material); }}>
      <Icon name="bookmark" size={16} />
    </button>
  );
  const itemRow = (material, admin = false) => (
    <div className="resource-row" key={material.id}>
      {materialOpen(material)}
      {!admin && favoriteButton(material)}
      {admin && <div className="row-actions"><button className="mini-icon" aria-label={`Edit ${material.title}`} onClick={() => { setEditingMaterial(material); setMaterialDialog(true); }}><Icon name="settings" size={15} /></button><button className="mini-icon danger-icon" aria-label={`Delete ${material.title}`} onClick={() => deleteMaterial(material)}><Icon name="close" size={16} /></button></div>}
      {material.deadline && <span className="deadline-mini">Due {readableDate(material.deadline)}</span>}
    </div>
  );
  const renderResources = (collection, admin = false) => collection.length
    ? <div className="resource-list">{collection.map((item) => itemRow(item, admin))}</div>
    : <div className="empty-state"><span className="empty-mark">—</span><b>Nothing filed here yet.</b><p>{admin ? 'Add a resource and it’ll appear in this course register.' : 'Try another search or a different material type.'}</p></div>;

  const sidebar = <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
    <div className="brand"><span className="brand-mark">b<span>.</span></span><span>BCA Study Hub</span></div>
    {user.role === 'student' ? <>
      <div className="side-label">YOUR STUDY SPACE</div>
      <div className="course-switcher"><div className="course-avatar">{user.year}Y</div><div><b>{years[user.year - 1]?.label || 'BCA'} course</b><span>{currentTerm?.label || `Semester ${user.semester}`}</span></div><Icon name="more" size={17} /></div>
      <nav className="side-nav" aria-label="Student navigation">
        {navItems.map((item) => <button key={item.id} onClick={() => navTo(item.id)} className={activeView === item.id ? 'active' : ''}><Icon name={item.icon} /><span>{item.label}</span>{item.id === 'favorites' && favorites.length > 0 && <small>{favorites.length}</small>}</button>)}
      </nav>
      <div className="side-label subject-side-label">YOUR SUBJECTS <button aria-label="Browse all subjects" onClick={() => navTo('library')}><Icon name="plus" size={15} /></button></div>
      <div className="subject-nav">{Object.entries(subjectCounts).slice(0, 6).map(([subject, count]) => <button key={subject} onClick={() => { navTo('library'); setSubjectFilter(subject); }}><span className="subject-bullet">{subject.slice(0, 1)}</span><span>{subject}</span><small>{count}</small></button>)}</div>
      <div className="side-divider"></div>
      <nav className="side-nav"><button className={activeView === 'quiz' ? 'active' : ''} onClick={() => navTo('quiz')}><Icon name="check" /><span>Quick quizzes</span></button><button className={activeView === 'schedule' ? 'active' : ''} onClick={() => navTo('schedule')}><Icon name="clock" /><span>Exam timetable</span></button></nav>
      <div className="semester-rail">
        <div className="rail-header"><span>COURSE MAP</span><span>0{user.year} / 03</span></div>
        {years.map((item) => <div key={item.year} className={`year-row ${item.year === user.year ? 'year-current' : ''}`}><b>{item.short}</b><span>{item.label}</span><div>{termsForYear(item.year, terms).map((term) => <button key={term.id} title={term.label} className={term.id === user.semester ? 'term-current' : ''} onClick={() => item.year === user.year ? null : setToast('Change your current year and semester from your profile.')}>{String(term.id).padStart(2, '0')}</button>)}</div></div>)}
      </div>
    </> : <>
      <div className="side-label">ADMINISTRATION</div>
      <div className="admin-side-note"><span className="admin-indicator"></span><div><b>Admin workspace</b><small>Course content controls</small></div></div>
      <nav className="side-nav" aria-label="Administration">
        {adminItems.map((item) => <button key={item.id} onClick={() => navTo(item.id)} className={activeView === item.id ? 'active' : ''}><Icon name={item.icon} /><span>{item.label}</span></button>)}
      </nav>
      <div className="semester-rail admin-rail">
        <div className="rail-header"><span>COURSE STRUCTURE</span><Icon name="grid" size={14} /></div>
        {years.map((item) => <div key={item.year} className="admin-year-row"><b>{item.short}</b><span>{item.label}</span><small>{termsForYear(item.year, terms).length} terms</small></div>)}
      </div>
    </>}
    <div className="sidebar-bottom">
      {user.role === 'student' && <button className={`profile-link ${activeView === 'profile' ? 'active' : ''}`} onClick={() => navTo('profile')}>{user.avatar ? <img className="avatar profile-photo" src={user.avatar} alt="" /> : <span className="avatar">{initials(user.name)}</span>}<span><b>{user.name}</b><small>Student profile</small></span><Icon name="settings" size={16} /></button>}
      {user.role === 'admin' && <button className="profile-link"><span className="avatar avatar-admin">{initials(user.name)}</span><span><b>{user.name}</b><small>Administrator</small></span></button>}
      <button className="signout-link" onClick={signOut}><Icon name="logout" size={16} /><span>Sign out</span></button>
    </div>
  </aside>;

  const topbar = <header className="topbar">
    <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNav(!mobileNav)}><Icon name="menu" /></button>
    <div className="breadcrumb"><span>{user.role === 'admin' ? 'Administration' : 'Study space'}</span><span className="crumb-sep">/</span><b>{activeView === 'adminMaterials' ? 'Study materials' : ({ overview: 'Overview', library: 'All materials', favorites: 'Saved for later', recent: 'Recently viewed', quiz: 'Quick quizzes', schedule: 'Exam timetable', profile: 'Your profile', subjects: 'Subjects & terms', examSchedule: 'Exam timetable', students: 'Students', notices: 'Notices' })[activeView]}</b></div>
    <div className="topbar-actions">
      <button className="global-search" onClick={() => { if (user.role === 'student') { navTo('library'); setTimeout(() => document.querySelector('.library-search-input')?.focus(), 50); } else navTo('adminMaterials'); }}><Icon name="search" size={16} /><span>Search anything</span><kbd>Ctrl K</kbd></button>
      <button className="icon-button notice-button" aria-label={`${notices.length} notices`} onClick={() => setNoticeOpen(!noticeOpen)}><Icon name="bell" /><span className="notification-dot"></span></button>
      <button className="icon-button" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => setDark(!dark)}><Icon name={dark ? 'sun' : 'moon'} /></button>
      <button className="top-avatar" aria-label="Open profile" onClick={() => navTo(user.role === 'admin' ? 'adminMaterials' : 'profile')}>{user.avatar ? <img src={user.avatar} alt="" /> : initials(user.name)}</button>
    </div>
    {noticeOpen && <div className="notice-popover"><div className="popover-head"><b>Notices</b><button className="mini-icon" onClick={() => setNoticeOpen(false)} aria-label="Close notices"><Icon name="close" size={14} /></button></div>{notices.slice(0, 4).map((notice) => <div className="notice-popover-row" key={notice.id}><span className="notice-dot"></span><div><b>{notice.title}</b><p>{notice.body}</p></div></div>)}</div>}
  </header>;

  const materialSection = (title, items, action, className = '', emptyTitle = 'Nothing filed here yet.', emptyText = 'Try another search or a different material type.') => <section className={`content-section ${className}`}>
    <div className="section-heading"><h2>{title}</h2>{action}</div>{items.length ? renderResources(items) : <div className="empty-state"><span className="empty-mark">—</span><b>{emptyTitle}</b><p>{emptyText}</p></div>}
  </section>;

  const studentViews = () => {
    if (activeView === 'overview') return <>
      <section className="welcome-strip">
        <div><p className="date-line">{new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()).toUpperCase()}</p><h1>Good to see you, {user.name.split(' ')[0]}<span>.</span></h1><p>Your next small step is already mapped out.</p></div>
        <button className="button button-ink" onClick={() => navTo('library')}>Browse your materials <Icon name="arrow" size={16} /></button>
        <span className="welcome-flower">✳</span>
      </section>
      <section className="semester-sheet">
        <div className="sheet-margin"><span>YOUR COURSE</span><b>0{user.year}</b><span>YEAR</span><i></i><span>0{user.semester}</span><span>SEMESTER</span></div>
        <div className="sheet-main">
          <div className="sheet-heading"><div><span className="section-overline">BACHELOR OF COMPUTER APPLICATIONS</span><h2>{currentTerm?.label || `Semester ${user.semester}`} <span>·</span> Year {user.year}</h2></div><button className="text-link" onClick={() => navTo('profile')}>Course details <Icon name="arrow" size={15} /></button></div>
          <div className="subject-register">
            {subjects.map((subject, index) => {
              const match = materials.filter((item) => item.subject === subject.name);
              return <button key={subject.id || subject.name} className="subject-register-row" onClick={() => { navTo('library'); setSubjectFilter(subject.name); }}>
                <span className="register-index">{String(index + 1).padStart(2, '0')}</span><span className="register-subject"><b>{subject.name}</b><small>{subject.code || `Semester ${subject.semester} course`}</small></span><span className="register-materials">{match.length} {match.length === 1 ? 'resource' : 'resources'}</span><span className="register-arrow"><Icon name="arrow" size={16} /></span>
              </button>;
            })}
            {!subjects.length && <div className="empty-state"><b>No subjects added yet.</b><p>Your administrator can add your semester subjects.</p></div>}
          </div>
        </div>
        <div className="sheet-index"><span>SEMESTER INDEX</span><div className="term-index-list">{termsForYear(user.year, terms).map((term) => <span key={term.id} className={term.id === user.semester ? 'current' : ''}>{String(term.id).padStart(2, '0')}</span>)}</div><small>{termsForYear(user.year, terms).length} TERMS IN YEAR {user.year}</small></div>
      </section>
      <div className="dashboard-columns">
        <div className="dashboard-main-column">
          {materialSection('Pick up where you left off', recent.slice(0, 3), <button className="text-link" onClick={() => navTo('recent')}>See history <Icon name="arrow" size={14} /></button>, 'compact-section', 'No recent resources just yet.', 'Open a course resource and it’ll be waiting here when you return.')}
          {materialSection('Recently added to your course', materials.slice(0, 4), <button className="text-link" onClick={() => navTo('library')}>View all <Icon name="arrow" size={14} /></button>)}
        </div>
        <aside className="study-aside">
          <div className="aside-heading"><h2>Your study rhythm</h2><span>THIS SEMESTER</span></div>
          <div className="rhythm-number">{doneCount}<span> / {Math.max(progress.length, subjects.length)}</span><i>topics checked off</i></div>
          <div className="rhythm-track"><span style={{ transform: `scaleX(${completionPercent / 100})` }}></span></div>
          <p className="rhythm-note">{completionPercent ? `${completionPercent}% of tracked topics complete. Keep your pace.` : 'Mark a topic complete as you study. Small steps add up.'}</p>
          <button className="aside-action" onClick={() => navTo('library')}>Open a topic <Icon name="arrow" size={15} /></button>
          <div className="aside-divider"></div>
          <div className="aside-heading notice-title"><h2>From your college</h2><button className="text-link" onClick={() => setNoticeOpen(true)}>All notices</button></div>
          {notices.slice(0, 2).map((notice) => <div className="college-notice" key={notice.id}><span className="notice-dot"></span><div><b>{notice.title}</b><p>{notice.body}</p></div></div>)}
          <div className="upcoming-title">COMING UP</div>
          {materials.filter((item) => item.deadline).length ? materials.filter((item) => item.deadline).slice(0, 2).map((item) => <button className="upcoming-row" key={item.id} onClick={() => openMaterial(item)}><span className="deadline-date">{readableDate(item.deadline)}</span><span><b>{item.title}</b><small>{item.subject}</small></span></button>) : <p className="quiet-note">No deadlines on your semester register.</p>}
        </aside>
      </div>
    </>;
    if (activeView === 'library' || activeView === 'favorites' || activeView === 'recent') {
      const selected = activeView === 'favorites' ? favorites : activeView === 'recent' ? recent : materials;
      const heading = activeView === 'favorites' ? 'Saved for a little later.' : activeView === 'recent' ? 'Your recent trail.' : 'The course, in full.';
      const subheading = activeView === 'favorites' ? 'The resources you marked to come back to.' : activeView === 'recent' ? 'Pick up from a topic you opened recently.' : 'Everything filed for your current year and semester.';
      return <><section className="page-intro"><div><p className="date-line">YEAR {user.year} <span>·</span> SEMESTER {user.semester}</p><h1>{heading}</h1><p>{subheading}</p></div><span className="intro-count">{selected.length.toString().padStart(2, '0')} <small>ITEMS</small></span></section>
        <div className="filter-bar"><label className="library-search"><Icon name="search" size={17} /><input className="library-search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search subject, topic, or unit…" /><kbd>/</kbd></label><select aria-label="Filter by material type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="all">All material types</option>{Object.entries(types).map(([id, type]) => <option key={id} value={id}>{type.label}</option>)}</select><select aria-label="Filter by subject" value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}><option value="all">All subjects</option>{subjects.map((item) => <option key={item.id || item.name} value={item.name}>{item.name}</option>)}</select></div>
        <div className="type-tabs"><button className={typeFilter === 'all' ? 'selected' : ''} onClick={() => setTypeFilter('all')}>All materials <span>{allMaterials.length}</span></button>{Object.entries(types).slice(0, 6).map(([id, type]) => <button key={id} className={typeFilter === id ? 'selected' : ''} onClick={() => setTypeFilter(typeFilter === id ? 'all' : id)}>{type.label}</button>)}</div>
        <section className="content-section library-results"><div className="section-heading"><h2>{search ? `Matches for “${search}”` : typeFilter === 'all' ? 'Your resource register' : types[typeFilter]?.label}</h2><span className="results-count">{selected.length} {selected.length === 1 ? 'result' : 'results'}</span></div>{renderResources(selected)}</section>
      </>;
    }
    if (activeView === 'quiz') return <><section className="page-intro"><div><p className="date-line">A QUICK CHECK-IN</p><h1>Try what you know.</h1><p>Short quizzes to test the ideas you’ve been studying.</p></div><div className="score-chip"><span>✳</span> {scores.length} {scores.length === 1 ? 'attempt' : 'attempts'}</div></section>{quizzes.length ? <div className="quiz-layout">{quizzes.map((quiz, index) => <section className="quiz-sheet" key={quiz.id}><div className="quiz-header"><span className="type-stamp stamp-green">Q</span><span><b>{quiz.subject}</b><small>{quiz.title}</small></span><span className="quiz-number">0{index + 1}</span></div>{quiz.questions.map((item, questionIndex) => <fieldset className="quiz-question" key={`${quiz.id}-${questionIndex}`}><legend><span>{String(questionIndex + 1).padStart(2, '0')}</span>{item.question}</legend><div className="quiz-options">{item.options.map((option, optionIndex) => <label key={option}><input type="radio" name={`${quiz.id}-${questionIndex}`} checked={quizAnswers[quiz.id]?.[questionIndex] === optionIndex} onChange={() => setQuizAnswers((current) => { const answers = [...(current[quiz.id] || Array(quiz.questions.length).fill(null))]; answers[questionIndex] = optionIndex; return { ...current, [quiz.id]: answers }; })} />{option}</label>)}</div></fieldset>)}{quizResult?.quizId === quiz.id && <div className="quiz-result" role="status">You scored <b>{quizResult.score} / {quizResult.total}</b>. {quizResult.score === quizResult.total ? 'Perfectly done.' : 'Good practice — review any missed questions and try again.'}</div>}<button className="button button-primary" onClick={() => submitQuiz(quiz)}>Check my answers <Icon name="arrow" size={15} /></button></section>)}<aside className="quiz-aside"><p className="date-line">YOUR RECENT SCORES</p><h2>Practice adds up.</h2>{scores.length ? scores.map((score, index) => <div className="score-row" key={`${score.createdAt}-${index}`}><b>{score.score}<span> / {score.total}</span></b><small>{new Date(score.createdAt).toLocaleDateString()}</small></div>) : <p>Scores from your completed quizzes appear here.</p>}<div className="aside-divider"></div><p>These sample questions are for practice. Confirm course coverage with your faculty.</p></aside></div> : <div className="empty-state"><b>No quizzes for this semester yet.</b><p>Your administrator can add a quiz when one is ready.</p></div>}</>;
    if (activeView === 'schedule') {
      const papers = materials.filter((item) => item.type === 'papers');
      const deadlines = materials.filter((item) => item.deadline);
      return <>
        <section className="page-intro"><div><p className="date-line">SEMESTER {user.semester} · EXAM PREPARATION</p><h1>Dates to keep in mind.</h1><p>Upcoming exam dates, assignments, and papers for your course.</p></div><span className="schedule-mark">↗</span></section>
        <div className="schedule-columns">
          <section className="content-section">
            <div className="section-heading"><h2>Published exam timetable</h2><span className="results-count">{exams.length} dates</span></div>
            {exams.length ? <div className="exam-event-list">{exams.map((exam) => <div className="exam-event-row" key={exam.id}><span className="exam-date">{new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short' }).format(new Date(`${exam.examDate}T12:00:00`))}<small>{new Date(`${exam.examDate}T12:00:00`).getFullYear()}</small></span><span><b>{exam.title}</b><small>{exam.subject}{exam.examTime ? ` · ${exam.examTime}` : ''}</small></span></div>)}</div> : <div className="empty-state"><b>No exam dates have been published.</b><p>Your college timetable will appear here when it’s added by an administrator.</p></div>}
          </section>
          <section className="content-section"><div className="section-heading"><h2>Assignment deadlines</h2><span className="results-count">{deadlines.length} items</span></div>{renderResources(deadlines)}</section>
          <section className="content-section"><div className="section-heading"><h2>Past papers</h2></div>{renderResources(papers)}</section>
          <p className="schedule-footnote">Exam dates are published by your college administrator. Confirm dates against official college communications.</p>
        </div>
      </>;
    }
    if (activeView === 'profile') return <><section className="page-intro"><div><p className="date-line">YOUR DETAILS, YOUR WAY</p><h1>A little about you.</h1><p>Keep your course and account details up to date.</p></div>{profileForm.avatar ? <img className="profile-big-avatar profile-photo" src={profileForm.avatar} alt="" /> : <span className="profile-big-avatar">{initials(user.name)}</span>}</section><div className="profile-layout"><form className="profile-card" onSubmit={saveProfile}><div className="section-heading"><h2>Student profile</h2><span className="profile-status">● ACTIVE</span></div><label>Student name<input value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} required minLength="2" /></label><label>Email / college ID<input value={user.email} readOnly /></label><label>Roll number<input value={profileForm.rollNumber} onChange={(event) => setProfileForm({ ...profileForm, rollNumber: event.target.value })} placeholder="Add your roll number" /></label><label>Profile picture URL <span className="optional">(optional)</span><input type="url" value={profileForm.avatar} onChange={(event) => setProfileForm({ ...profileForm, avatar: event.target.value })} placeholder="https://…" /></label><label>Course<input value={user.course} readOnly /></label><div className="form-split"><label>Year<select value={profileForm.year} onChange={(event) => changeProfileYear(event.target.value)}>{years.map((item) => <option key={item.year} value={item.year}>{item.label}</option>)}</select></label><label>Semester<select value={profileForm.semester} onChange={(event) => setProfileForm({ ...profileForm, semester: Number(event.target.value) })}>{termsForYear(profileForm.year, terms).map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></label></div>{profileError && <div className="inline-error">{profileError}</div>}<button className="button button-primary">Save profile changes <Icon name="arrow" size={15} /></button></form><form className="profile-card password-card" onSubmit={changePassword}><div className="section-heading"><h2>Change password</h2><Icon name="settings" size={17} /></div><p>Choose a password that is at least 8 characters long.</p><label>Current password<input type="password" autoComplete="current-password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} required /></label><label>New password<input type="password" autoComplete="new-password" minLength="8" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} required /></label><button className="button button-outline">Update password</button><div className="profile-note">Password recovery by email is not configured in this local demo. Contact your administrator if you can’t sign in.</div></form></div></>;
    return null;
  };

  const adminViews = () => {
    if (activeView === 'adminMaterials') return <>
      <section className="welcome-strip admin-welcome"><div><p className="date-line">CONTENT DESK · BCA STUDY HUB</p><h1>Keep the course <span>in good order.</span></h1><p>Add, update, and organize resources by year and semester.</p></div><button className="button button-ink" onClick={() => { setEditingMaterial(null); setMaterialDialog(true); }}><Icon name="plus" size={16} /> Add material</button><span className="welcome-flower">✳</span></section>
      <div className="stats-grid">{[['STUDENTS', stats.students ?? '—', 'user'], ['ALL MATERIALS', stats.materials ?? '—', 'book'], ['CLASS NOTES', stats.notes ?? '—', 'file'], ['PAST PAPERS', stats.papers ?? '—', 'clock'], ['VIDEO LESSONS', stats.videos ?? '—', 'play'], ['ASSIGNMENTS', stats.assignments ?? '—', 'check']].map(([label, value, icon]) => <div className="stat-register" key={label}><div className="stat-label"><Icon name={icon} size={15} />{label}</div><b>{value}</b><span>IN THE COURSE HUB</span></div>)}</div>
      <div className="admin-filter-row"><div><p className="date-line">COURSE MATERIALS</p><h2>Resource register</h2></div><label className="filter-select"><span>YEAR</span><select value={subjectForm.year} onChange={(event) => setSubjectForm({ ...subjectForm, year: event.target.value, semester: termsForYear(event.target.value, terms)[0]?.id || 1 })}>{years.map((item) => <option key={item.year} value={item.year}>{item.label}</option>)}</select></label><label className="filter-select"><span>SEMESTER</span><select value={subjectForm.semester} onChange={(event) => setSubjectForm({ ...subjectForm, semester: event.target.value })}>{termsForYear(subjectForm.year, terms).map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></label><label className="admin-search"><Icon name="search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find materials" /></label></div>
      <div className="admin-material-groups">{Object.entries(types).map(([type, details]) => { const group = materials.filter((item) => item.type === type && item.year === Number(subjectForm.year) && item.semester === Number(subjectForm.semester) && (!search || `${item.title} ${item.subject} ${item.topic}`.toLowerCase().includes(search.toLowerCase()))); return <section className="content-section admin-material-section" key={type}><div className="section-heading"><h2><span className={`type-stamp stamp-${details.tone}`}>{details.mark}</span>{details.label}</h2><button className="text-link" onClick={() => { setEditingMaterial({ type, year: Number(subjectForm.year), semester: Number(subjectForm.semester) }); setMaterialDialog(true); }}><Icon name="plus" size={14} /> Add</button></div>{renderResources(group, true)}</section>; })}</div>
    </>;
    if (activeView === 'subjects') return <><section className="page-intro"><div><p className="date-line">THE COURSE FRAMEWORK</p><h1>Shape the course map.</h1><p>Maintain year, semester, and subject structure as your program grows.</p></div></section><div className="admin-structure-grid"><section className="profile-card"><div className="section-heading"><h2>Add a subject</h2><span className="profile-status">COURSE SETUP</span></div><form className="stack-form" onSubmit={saveSubject}><label>Subject name<input value={subjectForm.name} onChange={(event) => setSubjectForm({ ...subjectForm, name: event.target.value })} placeholder="e.g. Computer Networks" required /></label><label>Subject code <span className="optional">(optional)</span><input value={subjectForm.code} onChange={(event) => setSubjectForm({ ...subjectForm, code: event.target.value })} placeholder="e.g. BCA-402" /></label><div className="form-split"><label>Year<select value={subjectForm.year} onChange={(event) => setSubjectForm({ ...subjectForm, year: event.target.value, semester: termsForYear(event.target.value, terms)[0]?.id || 1 })}>{years.map((item) => <option value={item.year} key={item.year}>{item.label}</option>)}</select></label><label>Semester<select value={subjectForm.semester} onChange={(event) => setSubjectForm({ ...subjectForm, semester: event.target.value })}>{termsForYear(subjectForm.year, terms).map((term) => <option value={term.id} key={term.id}>{term.label}</option>)}</select></label></div><button className="button button-primary"><Icon name="plus" size={15} /> Add subject</button></form></section><section className="profile-card"><div className="section-heading"><h2>Add or change a semester</h2><span className="profile-status">FLEXIBLE STRUCTURE</span></div><form className="stack-form" onSubmit={saveSemester}><div className="form-split"><label>Semester number<input type="number" min="1" max="12" value={semesterForm.id} onChange={(event) => setSemesterForm({ ...semesterForm, id: event.target.value })} placeholder="e.g. 7" required /></label><label>Course year<input type="number" min="1" max="6" value={semesterForm.year} onChange={(event) => setSemesterForm({ ...semesterForm, year: event.target.value })} required /></label></div><label>Semester label<input value={semesterForm.label} onChange={(event) => setSemesterForm({ ...semesterForm, label: event.target.value })} placeholder="e.g. Semester 7" required /></label><p className="form-hint">A matching number updates the semester label and year. Add new terms to extend the default six-semester map.</p><button className="button button-outline">Save semester structure</button></form></section><section className="structure-register"><div className="section-heading"><h2>Subjects by semester</h2><span className="results-count">{subjects.length} subjects</span></div>{years.map((year) => <div className="year-subject-group" key={year.year}><h3>{year.label}</h3>{termsForYear(year.year, terms).map((term) => <div className="term-subject-row" key={term.id}><div><b>{term.label}</b><small>Year {term.year} · {subjects.filter((subject) => subject.year === year.year && subject.semester === term.id).length} subjects</small></div><div className="subject-tag-list">{subjects.filter((subject) => subject.year === year.year && subject.semester === term.id).map((subject) => <span key={subject.id}>{subject.name}<button onClick={() => deleteSubject(subject)} aria-label={`Remove ${subject.name}`}><Icon name="close" size={13} /></button></span>)}</div></div>)}</div>)}</section></div></>;
    if (activeView === 'examSchedule') {
      const schedule = exams.filter((exam) => exam.year === Number(subjectForm.year) && exam.semester === Number(subjectForm.semester));
      return <>
        <section className="page-intro"><div><p className="date-line">OFFICIAL COURSE DATES</p><h1>Publish the exam timetable.</h1><p>Add only dates confirmed by your college; students see dates for their current semester.</p></div></section>
        <div className="exam-admin-layout">
          <form className="profile-card" onSubmit={saveExam}>
            <div className="section-heading"><h2>Add an exam date</h2><span className="profile-status">COLLEGE NOTICE</span></div>
            <label>Exam or assessment<input value={examForm.title} onChange={(event) => setExamForm({ ...examForm, title: event.target.value })} placeholder="e.g. End-term examination" required minLength="2" /></label>
            <label>Subject<input list="exam-subject-list" value={examForm.subject} onChange={(event) => setExamForm({ ...examForm, subject: event.target.value })} placeholder="Choose or type a subject" required minLength="2" /><datalist id="exam-subject-list">{subjects.map((subject) => <option value={subject.name} key={subject.id} />)}</datalist></label>
            <label>Exam date<input type="date" value={examForm.examDate} onChange={(event) => setExamForm({ ...examForm, examDate: event.target.value })} required /></label>
            <label>Time <span className="optional">(optional)</span><input value={examForm.examTime} onChange={(event) => setExamForm({ ...examForm, examTime: event.target.value })} placeholder="e.g. 10:00 AM – 1:00 PM" /></label>
            <div className="form-split"><label>Year<select value={examForm.year} onChange={(event) => { const year = event.target.value; setExamForm({ ...examForm, year, semester: String(termsForYear(year, terms)[0]?.id || 1) }); }}>{years.map((item) => <option value={item.year} key={item.year}>{item.label}</option>)}</select></label><label>Semester<select value={examForm.semester} onChange={(event) => setExamForm({ ...examForm, semester: event.target.value })}>{termsForYear(examForm.year, terms).map((term) => <option value={term.id} key={term.id}>{term.label}</option>)}</select></label></div>
            <button className="button button-primary">Publish exam date <Icon name="arrow" size={15} /></button>
          </form>
          <section className="notice-admin-list">
            <div className="section-heading"><h2>Exam dates</h2><span>{schedule.length} FOR THIS TERM</span></div>
            {schedule.length ? schedule.map((exam) => <article className="notice-admin-row exam-admin-row" key={exam.id}><span className="exam-date">{new Intl.DateTimeFormat('en', { day: '2-digit', month: 'short' }).format(new Date(`${exam.examDate}T12:00:00`))}<small>{new Date(`${exam.examDate}T12:00:00`).getFullYear()}</small></span><div><b>{exam.title}</b><p>{exam.subject}{exam.examTime ? ` · ${exam.examTime}` : ''}</p><small>Year {exam.year} · Semester {exam.semester}</small></div><button className="mini-icon danger-icon" aria-label={`Remove ${exam.title}`} onClick={() => deleteExam(exam)}><Icon name="close" size={16} /></button></article>) : <div className="empty-state"><b>No timetable dates for this term yet.</b><p>Dates published here appear on the matching student timetable.</p></div>}
          </section>
        </div>
      </>;
    }
    if (activeView === 'students') return <>
      <section className="page-intro">
        <div><p className="date-line">STUDENT DIRECTORY</p><h1>The people you support.</h1><p>Review student accounts and their current course placement.</p></div>
        <button className="button button-primary" onClick={() => openStudentEditor()}><Icon name="plus" size={15} /> Add student</button>
      </section>
      <section className="content-section directory-section">
        <div className="section-heading"><h2>Enrolled students</h2><span className="results-count">{students.length} accounts</span></div>
        {students.length ? <div className="student-table">
          <div className="student-table-head"><span>STUDENT</span><span>ROLL NUMBER</span><span>COURSE POSITION</span><span>JOINED</span><span>ACTIONS</span></div>
          {students.map((student) => <div className="student-table-row" key={student.id}>
            <span className="directory-person"><span className="avatar">{initials(student.name)}</span><span><b>{student.name}</b><small>{student.email}</small></span></span>
            <span>{student.rollNumber || '—'}</span><span>Year {student.year} · Semester {student.semester}</span><span>{new Date(student.createdAt).toLocaleDateString()}</span>
            <div className="row-actions">
              <button className="mini-icon" aria-label={`Edit ${student.name}`} onClick={() => openStudentEditor(student)}><Icon name="settings" size={15} /></button>
              <button className="mini-icon danger-icon" aria-label={`Remove ${student.name}`} onClick={() => removeStudent(student)}><Icon name="close" size={16} /></button>
            </div>
          </div>)}
        </div> : <div className="empty-state"><b>No student accounts yet.</b><p>Add a student to give them their own semester-specific study space.</p></div>}
      </section>
    </>;
    if (activeView === 'notices') return <><section className="page-intro"><div><p className="date-line">COLLEGE ANNOUNCEMENTS</p><h1>Keep everyone in the loop.</h1><p>Publish a clear update for students across the course.</p></div></section><div className="notice-admin-layout"><form className="profile-card" onSubmit={publishNotice}><div className="section-heading"><h2>Write a notice</h2><Icon name="bell" size={17} /></div><label>Notice title<input value={noticeForm.title} onChange={(event) => setNoticeForm({ ...noticeForm, title: event.target.value })} placeholder="What should students know?" required minLength="3" /></label><label>Message<textarea value={noticeForm.body} onChange={(event) => setNoticeForm({ ...noticeForm, body: event.target.value })} placeholder="Add the details and any next steps…" required minLength="3" rows="5" /></label><button className="button button-primary">Publish notice <Icon name="arrow" size={15} /></button></form><section className="notice-admin-list"><div className="section-heading"><h2>Published notices</h2><span>{notices.length} LIVE</span></div>{notices.map((notice) => <article className="notice-admin-row" key={notice.id}><span className="notice-dot"></span><div><b>{notice.title}</b><p>{notice.body}</p><small>{new Date(notice.createdAt).toLocaleDateString()}</small></div><button className="mini-icon danger-icon" aria-label={`Delete ${notice.title}`} onClick={() => deleteNotice(notice)}><Icon name="close" size={16} /></button></article>)}</section></div></>;
    return null;
  };

  const currentMaterials = user.role === 'admin' ? materials : materials;
  return <div className="app-shell">
    {mobileNav && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    {sidebar}
    <main className="main-shell">{topbar}<div className="page-content">{user.role === 'student' ? studentViews() : adminViews()}</div><footer className="page-footer"><span>BCA STUDY HUB <i>✳</i></span><span>YOUR COURSE, IN GOOD ORDER.</span><button onClick={() => navTo(user.role === 'student' ? 'profile' : 'subjects')}>{user.role === 'student' ? 'Your profile' : 'Manage course structure'} <Icon name="arrow" size={14} /></button></footer></main>
    {materialDialog && <div className="dialog-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setMaterialDialog(false); setEditingMaterial(null); setSelectedMaterial(null); } }}>
      <section className={`material-dialog ${selectedMaterial ? 'detail-dialog' : ''}`} role="dialog" aria-modal="true" aria-labelledby="material-dialog-title">
        <div className="dialog-top"><span>{selectedMaterial ? 'COURSE MATERIAL' : editingMaterial?.id ? 'EDIT MATERIAL' : 'ADD TO THE COURSE'}</span><button className="icon-button" onClick={() => { setMaterialDialog(false); setEditingMaterial(null); setSelectedMaterial(null); }} aria-label="Close"><Icon name="close" /></button></div>
        {selectedMaterial ? <>
          <div className="detail-tag"><span className={`type-stamp stamp-${types[selectedMaterial.type]?.tone || 'blue'}`}>{types[selectedMaterial.type]?.mark || 'R'}</span><span>{types[selectedMaterial.type]?.singular} · {selectedMaterial.subject}</span></div>
          <h2 id="material-dialog-title">{selectedMaterial.title}</h2><p className="detail-description">{selectedMaterial.description || 'A course resource added by your administrator.'}</p>
          <div className="detail-meta"><span>{selectedMaterial.unit || `Semester ${selectedMaterial.semester}`}</span>{selectedMaterial.topic && <span>{selectedMaterial.topic}</span>}{selectedMaterial.deadline && <span>Due {readableDate(selectedMaterial.deadline)}</span>}{selectedMaterial.examYear && <span>{selectedMaterial.examYear} · {selectedMaterial.examType}</span>}</div>
          {selectedMaterial.embedUrl && <div className="video-frame"><iframe title={selectedMaterial.title} src={selectedMaterial.embedUrl} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>}
          <div className="detail-actions">{selectedMaterial.resourceUrl && <a className="button button-primary" href={selectedMaterial.resourceUrl} target="_blank" rel="noreferrer">Open resource <Icon name="arrow" size={15} /></a>}{selectedMaterial.fileName && <button className="button button-primary" onClick={() => downloadMaterial(selectedMaterial)}>Download {selectedMaterial.fileName} <Icon name="arrow" size={15} /></button>}{user.role === 'student' && <button className="button button-outline" onClick={() => toggleProgress(selectedMaterial)}><Icon name="check" size={15} /> Mark {progress.some((item) => item.subject === selectedMaterial.subject && item.topic === (selectedMaterial.topic || selectedMaterial.title) && item.completed) ? 'not done' : 'complete'}</button>}{user.role === 'student' && favoriteButton(selectedMaterial)}</div>
        </> : <form className="material-form" onSubmit={addMaterial} key={editingMaterial?.id || editingMaterial?.type || 'new'}>
          <h2 id="material-dialog-title">{editingMaterial?.id ? 'Update this material.' : 'Add a course resource.'}</h2><p>Give students enough context to know if this is the right next step.</p>
          <div className="form-split"><label>Material type<select name="type" defaultValue={editingMaterial?.type || 'notes'}>{Object.entries(types).filter(([id]) => id !== 'quiz').map(([id, item]) => <option value={id} key={id}>{item.label}</option>)}</select></label><label>Course year<select name="year" defaultValue={editingMaterial?.year || subjectForm.year}>{years.map((item) => <option key={item.year} value={item.year}>{item.label}</option>)}</select></label></div>
          <div className="form-split"><label>Semester<select name="semester" defaultValue={editingMaterial?.semester || subjectForm.semester}>{terms.map((term) => <option value={term.id} key={term.id}>Year {term.year} · {term.label}</option>)}</select></label><label>Subject<input name="subject" list="subject-list" defaultValue={editingMaterial?.subject || ''} placeholder="Choose or type a subject" /><datalist id="subject-list">{subjects.map((subject) => <option value={subject.name} key={subject.id || subject.name} />)}</datalist></label></div>
          <label>Title<input name="title" defaultValue={editingMaterial?.title || ''} placeholder="A clear, useful title" required minLength="2" /></label>
          <div className="form-split"><label>Unit<input name="unit" defaultValue={editingMaterial?.unit || ''} placeholder="e.g. Unit 2" /></label><label>Topic<input name="topic" defaultValue={editingMaterial?.topic || ''} placeholder="e.g. Variables & types" /></label></div>
          <label>Description<textarea name="description" defaultValue={editingMaterial?.description || ''} placeholder="What will students learn or practice?" rows="3" /></label>
          <label>PDF or file <span className="optional">PDF, TXT, ZIP · max 20 MB</span><input name="file" type="file" accept=".pdf,.txt,.zip,application/pdf,text/plain,application/zip" /></label>
          <label>Resource or YouTube URL<input name="resourceUrl" defaultValue={editingMaterial?.resourceUrl || (editingMaterial?.embedUrl ? editingMaterial.embedUrl.replace('/embed/', '/watch?v=') : '') || ''} placeholder="https://…" /></label>
          <div className="form-split"><label>Exam year <span className="optional">(papers)</span><input name="examYear" defaultValue={editingMaterial?.examYear || ''} placeholder="2024" /></label><label>Exam type <span className="optional">(papers)</span><select name="examType" defaultValue={editingMaterial?.examType || ''}><option value="">Not applicable</option><option>Mid-Term</option><option>End-Term</option><option>Supplementary</option></select></label></div>
          <div className="form-split"><label>Submission deadline <span className="optional">(assignments)</span><input type="date" name="deadline" defaultValue={editingMaterial?.deadline || ''} /></label><label>Author <span className="optional">(references)</span><input name="author" defaultValue={editingMaterial?.author || ''} placeholder="Author or organization" /></label></div>
          <div className="dialog-actions"><button className="button button-outline" type="button" onClick={() => { setMaterialDialog(false); setEditingMaterial(null); }}>Cancel</button><button className="button button-primary" disabled={materialBusy}>{materialBusy ? 'Saving…' : editingMaterial?.id ? 'Save changes' : 'Add material'} <Icon name="arrow" size={15} /></button></div>
        </form>}
      </section>
    </div>}
    {studentDialogOpen && <div className="dialog-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setStudentDialogOpen(false); }}>
      <section className="material-dialog student-dialog" role="dialog" aria-modal="true" aria-labelledby="student-dialog-title">
        <div className="dialog-top"><span>{editingStudent ? 'EDIT STUDENT ACCOUNT' : 'NEW STUDENT ACCOUNT'}</span><button className="icon-button" onClick={() => setStudentDialogOpen(false)} aria-label="Close"><Icon name="close" /></button></div>
        <form className="material-form" onSubmit={saveStudent}>
          <h2 id="student-dialog-title">{editingStudent ? 'Update student details.' : 'Add a student.'}</h2>
          <p>{editingStudent ? 'Keep their account and course placement current.' : 'Create a sign-in for a student to access their course materials.'}</p>
          <label>Student name<input autoComplete="name" value={studentForm.name} onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })} placeholder="e.g. Aarav Sharma" required minLength="2" /></label>
          <label>Email / college ID<input autoComplete="username" value={studentForm.email} onChange={(event) => setStudentForm({ ...studentForm, email: event.target.value })} placeholder="student@college.edu or BCA24-018" required minLength="3" /></label>
          <label>Roll number <span className="optional">(optional)</span><input value={studentForm.rollNumber} onChange={(event) => setStudentForm({ ...studentForm, rollNumber: event.target.value })} placeholder="College roll number" /></label>
          {!editingStudent && <label>Initial password<input type="password" autoComplete="new-password" value={studentForm.password} onChange={(event) => setStudentForm({ ...studentForm, password: event.target.value })} placeholder="At least 8 characters" required minLength="8" /></label>}
          <div className="form-split">
            <label>Year<select value={studentForm.year} onChange={(event) => { const year = Number(event.target.value); setStudentForm({ ...studentForm, year, semester: termsForYear(year, terms)[0]?.id || 1 }); }}>{years.map((item) => <option key={item.year} value={item.year}>{item.label}</option>)}</select></label>
            <label>Semester<select value={studentForm.semester} onChange={(event) => setStudentForm({ ...studentForm, semester: Number(event.target.value) })}>{termsForYear(studentForm.year, terms).map((term) => <option key={term.id} value={term.id}>{term.label}</option>)}</select></label>
          </div>
          <div className="dialog-actions"><button className="button button-outline" type="button" onClick={() => setStudentDialogOpen(false)}>Cancel</button><button className="button button-primary" disabled={studentBusy}>{studentBusy ? 'Saving…' : editingStudent ? 'Save student changes' : 'Create student account'} <Icon name="arrow" size={15} /></button></div>
        </form>
      </section>
    </div>}
    {toast && <div className="toast" role="status"><span className="toast-check">✳</span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><Icon name="close" size={14} /></button></div>}
  </div>;
}

export default App;
