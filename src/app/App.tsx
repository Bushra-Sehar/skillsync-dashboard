import { useState, useRef, useEffect } from "react";
import {
  Zap, BookOpen, Users, MessageSquare, Calendar, Star, TrendingUp,
  Shield, CheckCircle, ArrowRight, Bell, Search, Filter, Send, Paperclip,
  Smile, Mic, Clock, MapPin, Mail, Menu, X,
  ChevronLeft, ChevronRight, Eye, Activity, Layers, AlertCircle,
  BarChart2, User, Lock, Video, GraduationCap, ChevronDown,
  Home, Settings, Flag, Plus, LogOut, UserCheck, UserX, Trash2
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid
} from "recharts";

type Page =
  | "landing" | "dashboard" | "marketplace" | "messaging" | "booking"
  | "progress" | "profile" | "admin" | "login" | "signup";

const APP_PAGES: Page[] = ["dashboard", "marketplace", "messaging", "booking", "progress", "profile", "admin"];

const SKILL_OPTIONS = [
  "Machine Learning", "Python", "Deep Learning", "TensorFlow", "PyTorch",
  "React Development", "JavaScript", "TypeScript", "Vue.js", "Node.js",
  "UX/UI Design", "Figma", "Adobe XD", "Prototyping", "Wireframing",
  "Data Science", "Statistics", "SQL", "Data Visualization", "Tableau",
  "Digital Marketing", "SEO", "Content Marketing", "Social Media",
  "iOS Development", "Swift", "Android Development", "Kotlin", "Flutter",
  "Public Speaking", "Presentation Skills", "Debate", "Communication",
  "Project Management", "Agile", "Scrum", "Git & Version Control", "DevOps",
  "Cybersecurity", "Cloud Computing", "AWS", "Docker", "Blockchain",
];

const API_URL = "";

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  if (options.headers) {
    Object.assign(headers, options.headers);
  }
  
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
  }
  
  return res.json();
}

// ─── Data ──────────────────────────────────────────────────────────────────

const ME = {
  id: 0, name: "Bushra Sehar", university: "MIT", dept: "Computer Science", year: "3rd Year",
  skill: "Machine Learning", level: "Advanced", rating: 4.9, reviews: 47,
  avatarIdx: 0, availability: "Online", wants: "UX Design",
  bio: "Passionate ML researcher and teaching assistant who loves breaking down complex concepts into digestible lessons.",
};

const students = [
  { id: 1, name: "Marcus Johnson", university: "Stanford", dept: "Design", year: "4th Year", skill: "UX/UI Design", level: "Advanced", rating: 4.8, reviews: 38, avatarIdx: 1, availability: "Hybrid", wants: "React Development", bio: "Product designer with internship experience at Google. Passionate about creating intuitive digital experiences." },
  { id: 2, name: "Elena Rodriguez", university: "Harvard", dept: "Business", year: "2nd Year", skill: "Digital Marketing", level: "Intermediate", rating: 4.7, reviews: 29, avatarIdx: 2, availability: "Online", wants: "Data Analysis", bio: "Marketing enthusiast with hands-on campaign management experience. Growth-mindset driven and results-focused." },
  { id: 3, name: "Aiden Chen", university: "Caltech", dept: "Mathematics", year: "3rd Year", skill: "Data Science", level: "Advanced", rating: 4.9, reviews: 52, avatarIdx: 3, availability: "In-Person", wants: "Web Development", bio: "Statistical modeling expert and Kaggle top-10% competitor. Making data meaningful and actionable." },
  { id: 4, name: "Sofia Williams", university: "Columbia", dept: "Psychology", year: "4th Year", skill: "Public Speaking", level: "Expert", rating: 5.0, reviews: 61, avatarIdx: 4, availability: "Hybrid", wants: "Statistics", bio: "TED talk alumna and debate champion. Helping students unlock their voice and communicate with confidence." },
  { id: 5, name: "Armeen", university: "Carnegie Mellon", dept: "Computer Science", year: "2nd Year", skill: "iOS Development", level: "Intermediate", rating: 4.6, reviews: 18, avatarIdx: 5, availability: "Online", wants: "Machine Learning", bio: "Built 3 apps on the App Store. Swift enthusiast and regular hackathon participant with a product mindset." },
];

const pendingApprovals = [
  { id: 101, name: "Lena Park", email: "lena@columbia.edu", university: "Columbia University", dept: "Engineering", applied: "Jan 18", avatarIdx: 2 },
  { id: 102, name: "Dario Reyes", email: "dario@ucsd.edu", university: "UC San Diego", dept: "Physics", applied: "Jan 17", avatarIdx: 3 },
  { id: 103, name: "Fatima Nasser", email: "fatima@yale.edu", university: "Yale University", dept: "CS", applied: "Jan 17", avatarIdx: 4 },
  { id: 104, name: "Tom Eriksson", email: "tom@nyu.edu", university: "NYU", dept: "Math", applied: "Jan 16", avatarIdx: 1 },
];

const features: { icon: React.FC<{ className?: string }>; title: string; desc: string; color: string; bg: string; border: string; dest: Page }[] = [
  { icon: Zap, title: "AI Skill Matching", desc: "Smart algorithm pairs you with ideal learning partners based on skills, schedules, and goals.", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-100", dest: "marketplace" },
  { icon: Users, title: "Peer-to-Peer Learning", desc: "Student-to-student knowledge exchange creates authentic, relatable learning experiences.", color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100", dest: "marketplace" },
  { icon: Shield, title: "Secure Messaging", desc: "End-to-end encrypted chat keeps all your conversations private and protected.", color: "text-green-500", bg: "bg-green-50", border: "border-green-100", dest: "messaging" },
  { icon: Calendar, title: "Session Scheduling", desc: "Integrated calendar and smart timezone support for seamless session planning.", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100", dest: "booking" },
  { icon: CheckCircle, title: "Skill Verification", desc: "Peer-reviewed endorsements and project-based verification build genuine trust.", color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100", dest: "marketplace" },
  { icon: Star, title: "Ratings & Reviews", desc: "Transparent review system helps you find the most effective teachers on campus.", color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-100", dest: "profile" },
  { icon: TrendingUp, title: "Progress Tracking", desc: "Visual dashboards track your learning journey with milestones and actionable insights.", color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", dest: "progress" },
  { icon: BookOpen, title: "Skill Discovery", desc: "Browse hundreds of skills offered by students across every discipline and campus.", color: "text-teal-500", bg: "bg-teal-50", border: "border-teal-100", dest: "marketplace" },
];

const steps = [
  { title: "Create Your Profile", desc: "Sign up with your university email, list your skills, and set your weekly availability in minutes.", icon: User },
  { title: "Add Skills to Teach", desc: "List subjects you are confident in and choose what you want to learn from other students.", icon: BookOpen },
  { title: "Find Learning Partners", desc: "Browse the marketplace or let our AI match you with ideal skill-exchange partners nearby.", icon: Shield },
  { title: "Schedule & Grow Together", desc: "Book sessions, track your learning progress, and build lasting campus connections.", icon: TrendingUp },
];

const initialChatMessages = [
  { id: 1, text: "Hey! Are you available this week for a session on Python?", time: "10:23 AM", mine: false },
  { id: 2, text: "Hi Marcus! Yes, I am free Thursday evening and Friday morning.", time: "10:25 AM", mine: true },
  { id: 3, text: "Friday morning works perfectly. How about 10am?", time: "10:26 AM", mine: false },
  { id: 4, text: "10am Friday it is! Should we do it on Zoom or Google Meet?", time: "10:28 AM", mine: true },
  { id: 5, text: "Zoom is fine. I will send the session invite. Also, I prepared some notes!", time: "10:30 AM", mine: false },
  { id: 6, text: "ML_Foundations_Notes.pdf", time: "10:30 AM", mine: false, isFile: true },
];

const conversationList = [
  { id: 1, sender: "Marcus Johnson", avatarIdx: 1, lastMsg: "Friday morning works. Zoom it is!", time: "2m ago", unread: 3 },
  { id: 2, sender: "Elena Rodriguez", avatarIdx: 2, lastMsg: "Thanks for the marketing session!", time: "1h ago", unread: 0 },
  { id: 3, sender: "Aiden Chen", avatarIdx: 3, lastMsg: "I shared the data science resources", time: "3h ago", unread: 1 },
  { id: 4, sender: "Armeen", avatarIdx: 5, lastMsg: "Your ML explanations are really clear!", time: "Yesterday", unread: 0 },
];

const notificationsData = [
  { icon: Calendar, text: "Marcus Johnson sent a session request for Friday 10am", time: "2 min ago", color: "text-indigo-500", bg: "bg-indigo-50", unread: true },
  { icon: Star, text: "You received a 5-star review from Aiden Chen", time: "1 hour ago", color: "text-amber-500", bg: "bg-amber-50", unread: true },
  { icon: MessageSquare, text: "Elena Rodriguez replied to your message", time: "2 hours ago", color: "text-green-500", bg: "bg-green-50", unread: true },
  { icon: Zap, text: "New match found: Sofia Williams wants to learn ML!", time: "3 hours ago", color: "text-rose-500", bg: "bg-rose-50", unread: false },
];

const weeklyData = [
  { day: "Mon", hours: 2.5 }, { day: "Tue", hours: 1.5 }, { day: "Wed", hours: 3.0 },
  { day: "Thu", hours: 0.5 }, { day: "Fri", hours: 4.0 }, { day: "Sat", hours: 2.0 }, { day: "Sun", hours: 1.0 },
];

const monthlyData = [
  { month: "Aug", users: 320, sessions: 180 }, { month: "Sep", users: 450, sessions: 240 },
  { month: "Oct", users: 620, sessions: 380 }, { month: "Nov", users: 800, sessions: 520 },
  { month: "Dec", users: 950, sessions: 680 }, { month: "Jan", users: 1200, sessions: 890 },
];

// ─── Animated Avatar ───────────────────────────────────────────────────────

const AVATAR_SCHEMES = [
  ["#4F46E5", "#7C3AED"],
  ["#0EA5E9", "#6366F1"],
  ["#10B981", "#06B6D4"],
  ["#F59E0B", "#EF4444"],
  ["#EC4899", "#8B5CF6"],
  ["#14B8A6", "#3B82F6"],
];

function AnimatedAvatar({
  name = "", index = 0, size = 40, shape = "circle", className = ""
}: { name?: string; index?: number; size?: number; shape?: "circle" | "square"; className?: string }) {
  const [from, to] = AVATAR_SCHEMES[index % AVATAR_SCHEMES.length];
  const initials = (name || "").trim().split(/\s+/).slice(0, 2).map(n => n[0] || "").join("").toUpperCase() || "?";
  const fontSize = Math.round(size * 0.36);
  const borderRadius = shape === "circle" ? "50%" : Math.round(size * 0.28) + "px";
  const dur = (2.5 + (index * 0.4) % 1.8).toFixed(1);
  return (
    <div className={`flex items-center justify-center font-extrabold text-white select-none ${className}`}
      style={{
        width: size, height: size, borderRadius, fontSize, flexShrink: 0,
        backgroundImage: `linear-gradient(135deg, ${from} 0%, ${to} 50%, ${from} 100%)`,
        backgroundSize: "200% 200%",
        animation: `avatarPulse ${dur}s ease infinite`,
      }}>
      {initials}
    </div>
  );
}

// ─── Shared UI ─────────────────────────────────────────────────────────────

function StarRating({ rating, showCount, count }: { rating: number; showCount?: boolean; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
      {showCount && <span className="text-xs text-gray-500 ml-1">{rating} ({count})</span>}
    </div>
  );
}

function InteractiveStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}>
          <Star className={`w-7 h-7 transition-all ${star <= (hovered || value) ? "text-amber-400 fill-amber-400 scale-110" : "text-gray-300"}`} />
        </button>
      ))}
    </div>
  );
}

function Pill({ text, variant = "indigo" }: { text: string; variant?: string }) {
  const map: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    red: "bg-red-50 text-red-600 border-red-100",
    gray: "bg-gray-50 text-gray-500 border-gray-100",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${map[variant] ?? map.indigo}`}>{text}</span>;
}

function Btn({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-indigo-200/50 ${className}`}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-indigo-600 rounded-xl border border-indigo-200 hover:bg-indigo-50 transition-all ${className}`}>
      {children}
    </button>
  );
}

// ─── Skill Tag Manager ─────────────────────────────────────────────────────

function SkillTagManager({
  label, skills, setSkills, variant = "indigo"
}: { label: string; skills: string[]; setSkills: (s: string[]) => void; variant?: "indigo" | "violet" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const available = SKILL_OPTIONS.filter(s => !skills.includes(s) && (!query || s.toLowerCase().includes(query.toLowerCase())));

  const vMap = {
    indigo: { tag: "bg-indigo-50 text-indigo-700 border-indigo-200", rm: "bg-indigo-100 hover:bg-indigo-200 text-indigo-600", add: "text-indigo-600 border-indigo-200 hover:bg-indigo-50" },
    violet: { tag: "bg-violet-50 text-violet-700 border-violet-200", rm: "bg-violet-100 hover:bg-violet-200 text-violet-600", add: "text-violet-600 border-violet-200 hover:bg-violet-50" },
  };
  const v = vMap[variant];

  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
        {skills.map(s => (
          <span key={s} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-sm font-semibold border ${v.tag}`}>
            {s}
            <button onClick={() => setSkills(skills.filter(x => x !== s))}
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${v.rm}`}>
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>
      <div ref={dropRef} className="relative w-fit">
        <button onClick={() => setOpen(!open)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${v.add}`}>
          <Plus className="w-3.5 h-3.5" /> Add Skill
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
          <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input placeholder="Search skills..." value={query} onChange={e => setQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto p-1">
              {available.map(s => (
                <button key={s} onClick={() => { setSkills([...skills, s]); setQuery(""); setOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 font-medium hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition-all">
                  {s}
                </button>
              ))}
              {available.length === 0 && <p className="text-xs text-gray-400 px-3 py-3 text-center">No more skills to add</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Notification Dropdown ─────────────────────────────────────────────────

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const unread = notificationsData.filter(n => n.unread).length;
  return (
    <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl shadow-indigo-100/60 border border-gray-100 overflow-hidden z-50">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs font-extrabold rounded-full">{unread} new</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"><X className="w-4 h-4" /></button>
      </div>
      <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
        {notificationsData.map((n, i) => (
          <button key={i} onClick={onClose} className={`w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-gray-50 transition-all ${n.unread ? "bg-indigo-50/30" : ""}`}>
            <div className={`w-9 h-9 rounded-xl ${n.bg} flex items-center justify-center shrink-0 mt-0.5`}>
              <n.icon className={`w-4 h-4 ${n.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 font-medium leading-snug">{n.text}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
            {n.unread && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 shrink-0" />}
          </button>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-gray-100 text-center">
        <button onClick={onClose} className="text-sm text-indigo-600 font-bold hover:underline">Mark all as read</button>
      </div>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────

function Navbar({ page, setPage, isLoggedIn, me }: { page: Page; setPage: (p: Page) => void; isLoggedIn: boolean; me: any }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notificationsData.filter(n => n.unread).length;
  const userMe = me || ME;

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (page !== "landing") { setPage("landing"); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 120); }
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const goProtected = (p: Page) => { setMobileOpen(false); setPage(isLoggedIn ? p : "login"); };
  const isApp = APP_PAGES.includes(page);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-indigo-50/70 shadow-sm shadow-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setPage("landing")} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-gray-900">Skill<span className="text-indigo-600">Sync</span></span>
          </button>

          <nav className="hidden md:flex items-center gap-0.5">
            <button onClick={() => setPage("landing")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${page === "landing" ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}>
              <Home className="w-3.5 h-3.5" /> Home
            </button>
            <button onClick={() => scrollTo("features")} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all">Features</button>
            <button onClick={() => scrollTo("how-it-works")} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all">How It Works</button>
            <button onClick={() => goProtected("marketplace")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${page === "marketplace" ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}>
              Marketplace
            </button>
            <button onClick={() => goProtected("dashboard")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${isApp && page !== "marketplace" ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}>
              <BarChart2 className="w-3.5 h-3.5" /> Dashboard
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <div ref={notifRef} className="relative">
                  <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">{unreadCount}</span>}
                  </button>
                  {showNotif && <NotificationDropdown onClose={() => setShowNotif(false)} />}
                </div>
                <button onClick={() => goProtected("profile")} className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-all">
                  <AnimatedAvatar name={userMe.name} index={userMe.avatarIdx} size={32} />
                  <span className="text-sm font-semibold text-gray-700">{userMe.name.split(" ")[0]}</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setPage("login")} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all">Log In</button>
                <Btn onClick={() => setPage("signup")}>Sign Up</Btn>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {[
            { label: "Home", action: () => { setPage("landing"); setMobileOpen(false); } },
            { label: "Features", action: () => scrollTo("features") },
            { label: "How It Works", action: () => scrollTo("how-it-works") },
            { label: "Marketplace", action: () => goProtected("marketplace") },
            { label: "Dashboard", action: () => goProtected("dashboard") },
          ].map(n => (
            <button key={n.label} onClick={n.action} className="block w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all">{n.label}</button>
          ))}
          {!isLoggedIn && (
            <div className="pt-2 flex gap-2">
              <button onClick={() => { setPage("login"); setMobileOpen(false); }} className="flex-1 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl">Log In</button>
              <button onClick={() => { setPage("signup"); setMobileOpen(false); }} className="flex-1 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl">Sign Up</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────────────

function Sidebar({ page, setPage, onMyProfile, onLogout, me }: { page: Page; setPage: (p: Page) => void; onMyProfile: () => void; onLogout: () => void; me: any }) {
  const userMe = me || ME;
  const items: { icon: React.FC<{ className?: string }>; label: string; page?: Page; action?: () => void; badge?: number }[] = [
    { icon: Home, label: "Dashboard", page: "dashboard" },
    { icon: Calendar, label: "My Sessions", page: "booking" },
    { icon: TrendingUp, label: "Progress", page: "progress" },
    { icon: MessageSquare, label: "Messages", page: "messaging", badge: 4 },
    { icon: User, label: "My Profile", action: onMyProfile },
  ];

  if (userMe.role === "admin") {
    items.push({ icon: Shield, label: "Admin", page: "admin" });
  }

  return (
    <aside className="hidden md:flex w-56 bg-white border-r border-gray-100 flex-col shrink-0 sticky top-16" style={{ height: "calc(100vh - 64px)" }}>
      <nav className="flex-1 p-3 space-y-0.5 pt-4 overflow-y-auto">
        {items.map((item, idx) => {
          const isActive = item.page ? page === item.page : false;
          return (
            <button key={idx} onClick={() => item.action ? item.action() : item.page && setPage(item.page)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 border border-indigo-100/70" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}>
              <item.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-indigo-500" : ""}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && <span className="w-5 h-5 bg-indigo-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Profile + Logout at bottom */}
      <div className="p-3 border-t border-gray-100 space-y-1.5">
        <button onClick={onMyProfile} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-all text-left">
          <AnimatedAvatar name={userMe.name} index={userMe.avatarIdx} size={34} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{userMe.name}</p>
            <p className="text-xs text-gray-400 truncate">{userMe.university}</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-gray-300 shrink-0" />
        </button>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Floating Chat ─────────────────────────────────────────────────────────

function FloatingChat({ setPage }: { setPage: (p: Page) => void }) {
  const [bounce, setBounce] = useState(false);
  useEffect(() => {
    const t = setInterval(() => { setBounce(true); setTimeout(() => setBounce(false), 600); }, 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <button onClick={() => setPage("messaging")}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-300/50 hover:scale-110 hover:shadow-indigo-400/60 transition-all"
      style={{ animation: bounce ? "floatBounce 0.5s ease" : "none" }}>
      <MessageSquare className="w-6 h-6 text-white" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">4</span>
    </button>
  );
}

// ─── Auth Pages ────────────────────────────────────────────────────────────

function LoginPage({ setPage, onLogin }: { setPage: (p: Page) => void; onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem("token", data.token);
      onLogin(data.token);
      setPage("dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => setPage("landing")} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md"><Zap className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-extrabold text-gray-900">Skill<span className="text-indigo-600">Sync</span></span>
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue your learning journey</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">University Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu" className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" />
              </div>
            </div>
          </div>
          <Btn onClick={handleSignIn} className="w-full mt-6 py-3 justify-center text-base" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"} <ArrowRight className="w-4 h-4" />
          </Btn>
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">New to SkillSync? <button onClick={() => setPage("signup")} className="text-indigo-600 font-bold hover:underline">Create account</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignupPage({ setPage, onSignup }: { setPage: (p: Page) => void; onSignup: (token: string) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", university: "", dept: "", year: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.password || !form.university || !form.dept || !form.year) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(form)
      });
      localStorage.setItem("token", data.token);
      onSignup(data.token);
      setPage("dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => setPage("landing")} className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md"><Zap className="w-5 h-5 text-white" /></div>
            <span className="text-xl font-extrabold text-gray-900">Skill<span className="text-indigo-600">Sync</span></span>
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join 5,000+ students exchanging skills</p>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={form.name} onChange={update("name")} placeholder="Your full name" className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">University Email</label>
              <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" value={form.email} onChange={update("email")} placeholder="you@university.edu" className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="password" value={form.password} onChange={update("password")} placeholder="Min 8 characters" className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" /></div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">University</label>
              <div className="relative"><GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={form.university} onChange={update("university")} placeholder="e.g. MIT, Stanford, Harvard" className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                <input value={form.dept} onChange={update("dept")} placeholder="e.g. CS" className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
                <div className="relative">
                  <select value={form.year} onChange={update("year")} className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 appearance-none transition-all">
                    <option value="">Year</option>
                    {["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "PhD"].map(y => <option key={y}>{y}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          <Btn onClick={handleSignUp} className="w-full mt-6 py-3 justify-center text-base" disabled={loading}>
            {loading ? "Creating..." : "Create Account"} <ArrowRight className="w-4 h-4" />
          </Btn>
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">Already have an account? <button onClick={() => setPage("login")} className="text-indigo-600 font-bold hover:underline">Sign in</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Illustration ─────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <div className="relative select-none">
      <svg viewBox="0 0 480 480" className="w-full h-auto" aria-hidden="true">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EEF2FF" />
            <stop offset="100%" stopColor="#F5F3FF" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF7A" />
            <stop offset="100%" stopColor="#F59E4A" />
          </linearGradient>
          <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="laptopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312E81" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
          <linearGradient id="deskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="pillBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="pillPurple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="pillGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </radialGradient>
          <filter id="cardSh">
            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#4F46E5" floodOpacity="0.13" />
          </filter>
          <filter id="personSh">
            <feDropShadow dx="2" dy="8" stdDeviation="10" floodColor="#312E81" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Floor shadow */}
        <ellipse cx="240" cy="430" rx="160" ry="22" fill="url(#floorShadow)" />

        {/* Desk */}
        <rect x="80" y="310" width="320" height="18" rx="6" fill="url(#deskGrad)" />
        <rect x="110" y="328" width="14" height="70" rx="4" fill="#CBD5E1" />
        <rect x="356" y="328" width="14" height="70" rx="4" fill="#CBD5E1" />

        {/* Laptop base */}
        <rect x="130" y="260" width="220" height="52" rx="8" fill="url(#laptopGrad)" />
        <rect x="136" y="265" width="208" height="42" rx="5" fill="#0F172A" />
        {/* Trackpad */}
        <rect x="210" y="296" width="60" height="10" rx="4" fill="#1E293B" />

        {/* Laptop screen */}
        <rect x="115" y="125" width="250" height="145" rx="10" fill="url(#laptopGrad)" filter="url(#cardSh)" />
        <rect x="122" y="132" width="236" height="131" rx="6" fill="url(#screenGrad)" />

        {/* Screen content — code lines */}
        <rect x="132" y="145" width="80" height="7" rx="3.5" fill="#818CF8" opacity="0.9" />
        <rect x="132" y="158" width="130" height="6" rx="3" fill="#6366F1" opacity="0.6" />
        <rect x="148" y="170" width="100" height="6" rx="3" fill="#A5B4FC" opacity="0.5" />
        <rect x="148" y="182" width="80" height="6" rx="3" fill="#C7D2FE" opacity="0.4" />
        <rect x="132" y="194" width="60" height="6" rx="3" fill="#818CF8" opacity="0.5" />
        <rect x="132" y="206" width="140" height="6" rx="3" fill="#A5B4FC" opacity="0.35" />
        <rect x="148" y="218" width="90" height="6" rx="3" fill="#6366F1" opacity="0.45" />
        <rect x="148" y="230" width="110" height="6" rx="3" fill="#C7D2FE" opacity="0.3" />
        {/* Screen cursor blink */}
        <rect x="132" y="242" width="3" height="12" rx="1.5" fill="#A5B4FC" opacity="0.85" />

        {/* ── Person (sitting, viewed from front-side) ── */}
        <g filter="url(#personSh)">
          {/* Body / shirt */}
          <path d="M 185 265 Q 182 230 188 210 L 240 200 L 292 210 Q 298 230 295 265 Z" fill="url(#shirtGrad)" />

          {/* Left arm on desk */}
          <path d="M 188 220 Q 165 238 152 268 Q 148 275 155 278 Q 162 281 167 272 Q 178 250 195 238 Z" fill="url(#shirtGrad)" />
          {/* Left hand */}
          <ellipse cx="152" cy="278" rx="11" ry="8" fill="url(#skinGrad)" />

          {/* Right arm */}
          <path d="M 292 220 Q 315 238 325 268 Q 329 275 322 278 Q 315 281 310 272 Q 300 250 285 238 Z" fill="url(#shirtGrad)" />
          {/* Right hand */}
          <ellipse cx="325" cy="278" rx="11" ry="8" fill="url(#skinGrad)" />

          {/* Neck */}
          <rect x="228" y="186" width="24" height="20" rx="8" fill="url(#skinGrad)" />

          {/* Head */}
          <ellipse cx="240" cy="162" rx="42" ry="46" fill="url(#skinGrad)" />

          {/* Hair */}
          <path d="M 198 150 Q 200 108 240 106 Q 280 108 282 150 Q 275 120 240 118 Q 205 120 198 150 Z" fill="#1C1917" />
          <path d="M 198 150 Q 196 135 200 125 Q 198 138 198 150 Z" fill="#1C1917" />
          <path d="M 282 150 Q 284 135 280 125 Q 282 138 282 150 Z" fill="#1C1917" />
          {/* Side hair strands */}
          <path d="M 200 155 Q 195 170 198 185" stroke="#1C1917" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M 280 155 Q 285 170 282 185" stroke="#1C1917" strokeWidth="8" strokeLinecap="round" fill="none" />

          {/* Ear */}
          <ellipse cx="198" cy="168" rx="7" ry="9" fill="#F0924A" />
          <ellipse cx="282" cy="168" rx="7" ry="9" fill="#F0924A" />

          {/* Eyes */}
          <ellipse cx="224" cy="162" rx="7" ry="8" fill="white" />
          <ellipse cx="256" cy="162" rx="7" ry="8" fill="white" />
          <ellipse cx="225" cy="163" rx="4" ry="5" fill="#1C1917" />
          <ellipse cx="257" cy="163" rx="4" ry="5" fill="#1C1917" />
          <circle cx="227" cy="161" r="1.5" fill="white" />
          <circle cx="259" cy="161" r="1.5" fill="white" />

          {/* Eyebrows */}
          <path d="M 217 152 Q 224 148 231 151" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 249 151 Q 256 148 263 152" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Smile */}
          <path d="M 228 178 Q 240 186 252 178" stroke="#C2714A" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Headphones */}
          <path d="M 197 158 Q 195 130 240 126 Q 285 130 283 158" stroke="#312E81" strokeWidth="5" strokeLinecap="round" fill="none" />
          <rect x="190" y="157" width="14" height="18" rx="6" fill="#4F46E5" />
          <rect x="276" y="157" width="14" height="18" rx="6" fill="#4F46E5" />
        </g>

        {/* ── Floating skill pills ── */}
        {/* Top-left */}
        <g>
          <rect x="22" y="100" width="110" height="30" rx="15" fill="url(#pillBlue)" filter="url(#cardSh)" />
          <text x="77" y="120" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif">Machine Learning</text>
        </g>
        {/* Top-right */}
        <g>
          <rect x="348" y="90" width="108" height="30" rx="15" fill="url(#pillPurple)" filter="url(#cardSh)" />
          <text x="402" y="110" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif">iOS Development</text>
        </g>
        {/* Mid-left */}
        <g>
          <rect x="14" y="200" width="90" height="28" rx="14" fill="white" filter="url(#cardSh)" stroke="#E0E7FF" strokeWidth="1" />
          <text x="59" y="218" textAnchor="middle" fill="#4F46E5" fontSize="10.5" fontWeight="700" fontFamily="Inter,sans-serif">UX Design</text>
        </g>
        {/* Mid-right */}
        <g>
          <rect x="376" y="196" width="82" height="28" rx="14" fill="white" filter="url(#cardSh)" stroke="#EDE9FE" strokeWidth="1" />
          <text x="417" y="214" textAnchor="middle" fill="#7C3AED" fontSize="10.5" fontWeight="700" fontFamily="Inter,sans-serif">React Dev</text>
        </g>
        {/* Bottom success tag */}
        <g>
          <rect x="160" y="378" width="160" height="34" rx="17" fill="url(#pillGreen)" filter="url(#cardSh)" />
          <text x="240" y="400" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Inter,sans-serif">✓ Session Complete!</text>
        </g>

        {/* Decorative dots */}
        <circle cx="60" cy="60" r="6" fill="#4F46E5" opacity="0.25" />
        <circle cx="430" cy="55" r="5" fill="#7C3AED" opacity="0.25" />
        <circle cx="30" cy="370" r="4" fill="#10B981" opacity="0.3" />
        <circle cx="455" cy="340" r="5" fill="#F59E0B" opacity="0.28" />
        <circle cx="455" cy="140" r="4" fill="#4F46E5" opacity="0.2" />
        <circle cx="44" cy="290" r="3" fill="#7C3AED" opacity="0.2" />
      </svg>
    </div>
  );
}

// ─── Landing ───────────────────────────────────────────────────────────────

function Landing({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-white pt-16 pb-28 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-gradient-to-br from-indigo-200/25 to-violet-200/25 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-600">
                <Zap className="w-3 h-3" /> AI-Powered Skill Exchange for University Students
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.08] tracking-tight">
                Learn What You Need.<br />
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Teach What You Know.</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed max-w-lg">SkillSync connects university students in a peer-to-peer learning network. Exchange skills, grow together, and build a smarter campus community.</p>
              <div className="flex flex-wrap gap-3">
                <Btn onClick={() => setPage("signup")} className="text-base px-7 py-3.5">Get Started <ArrowRight className="w-4 h-4" /></Btn>
                <GhostBtn onClick={() => setPage("marketplace")} className="text-base px-7 py-3.5"><Search className="w-4 h-4" /> Explore Skills</GhostBtn>
              </div>
              <div className="flex items-center gap-4 pt-1">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3].map(idx => <AnimatedAvatar key={idx} name={students[idx].name} index={students[idx].avatarIdx} size={32} className="ring-2 ring-white" />)}
                </div>
                <p className="text-sm text-gray-500"><span className="font-bold text-gray-800">5,000+</span> students already learning together</p>
              </div>
            </div>
            <div className="w-full max-w-2xl mx-auto lg:max-w-none">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em]">Platform Features</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">Everything You Need to Thrive</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-lg">From intelligent matching to transparent reviews, SkillSync gives you a complete toolkit for peer learning.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <button key={i} onClick={() => setPage(f.dest)} className={`group p-6 bg-white rounded-2xl border ${f.border} hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left w-full`}>
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-[15px]">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                <p className={`text-xs font-bold mt-3 flex items-center gap-1 ${f.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Explore <ArrowRight className="w-3 h-3" />
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-violet-600">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[{ value: "5,000+", label: "Active Students", icon: Users }, { value: "1,200+", label: "Skills Available", icon: BookOpen }, { value: "3,000+", label: "Sessions Completed", icon: CheckCircle }, { value: "98%", label: "Positive Reviews", icon: Star }].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4"><s.icon className="w-7 h-7 text-white" /></div>
              <p className="text-5xl font-extrabold text-white">{s.value}</p>
              <p className="text-indigo-200 mt-2 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4 bg-gray-50/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em]">How It Works</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">Get Started in 4 Simple Steps</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && <div className="hidden lg:block absolute top-8 left-[calc(50%+36px)] right-0 h-px bg-gradient-to-r from-indigo-200 to-transparent z-0" />}
                <div className="relative z-10 inline-block">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-200"><step.icon className="w-7 h-7 text-white" /></div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-extrabold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="font-bold text-gray-900 mt-5 mb-2 text-[15px]">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"><svg viewBox="0 0 800 300" className="w-full h-full"><circle cx="50" cy="150" r="200" fill="white" /><circle cx="750" cy="150" r="250" fill="white" /></svg></div>
            <div className="relative">
              <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Start Learning?</h2>
              <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">Join 5,000+ students already exchanging skills and building their futures together.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => setPage("signup")} className="px-8 py-4 bg-white text-indigo-600 font-extrabold rounded-2xl hover:bg-indigo-50 transition-all shadow-lg text-sm">Create Free Account</button>
                <button onClick={() => setPage("marketplace")} className="px-8 py-4 bg-white/15 text-white font-bold rounded-2xl hover:bg-white/25 transition-all border border-white/30 text-sm">Browse Skills</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

function Dashboard({
  setPage,
  setSelectedStudent,
  onMyProfile,
  me,
  students: backendStudents,
  sessions,
  conversations,
  matches
}: {
  setPage: (p: Page) => void;
  setSelectedStudent: (s: any) => void;
  onMyProfile: () => void;
  me: any;
  students: any[];
  sessions: any[];
  conversations: any[];
  matches: any[];
}) {
  const userMe = me || ME;
  const studentList = backendStudents?.length > 0 ? backendStudents : students;
  const chatList = conversations?.length > 0 ? conversations : conversationList;
  const sessList = sessions?.length > 0 ? sessions : [];
  
  // Parse JSON skills
  const teachingList = typeof userMe.skillsTeaching === "string" ? JSON.parse(userMe.skillsTeaching) : (userMe.skillsTeaching || []);
  const learningList = typeof userMe.skillsLearning === "string" ? JSON.parse(userMe.skillsLearning) : (userMe.skillsLearning || []);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><svg viewBox="0 0 1200 150"><circle cx="50" cy="75" r="150" fill="white" /><circle cx="1150" cy="75" r="200" fill="white" /></svg></div>
        <div className="flex items-center gap-4 relative">
          <button onClick={onMyProfile}><AnimatedAvatar name={userMe.name} index={userMe.avatarIdx} size={56} shape="square" className="ring-[3px] ring-white/30 hover:scale-105 transition-transform" /></button>
          <div>
            <p className="text-indigo-200 text-sm font-semibold">Good morning,</p>
            <h2 className="text-2xl font-extrabold text-white">{userMe.name} 👋</h2>
            <p className="text-indigo-200 text-sm">{userMe.dept} · {userMe.year} · {userMe.university}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 relative">
          {[{ v: `${sessList.length || 24}`, l: "Sessions" }, { v: `${userMe.rating}`, l: "Rating" }, { v: `${teachingList.length + learningList.length}`, l: "Skills" }].map((s, i) => (
            <div key={i} className="text-center"><p className="text-3xl font-extrabold text-white">{s.v}</p><p className="text-indigo-200 text-xs font-medium">{s.l}</p></div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Skills Teaching", value: `${teachingList.length}`, icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-50", dest: "progress" as Page },
              { label: "Skills Learning", value: `${learningList.length}`, icon: TrendingUp, color: "text-violet-500", bg: "bg-violet-50", dest: "progress" as Page },
              { label: "Hours This Week", value: "8.5h", icon: Clock, color: "text-green-500", bg: "bg-green-50", dest: "progress" as Page },
              { label: "Reviews Received", value: `${userMe.reviewsCount || 47}`, icon: Star, color: "text-amber-500", bg: "bg-amber-50", isProfile: true },
            ].map((s, i) => (
              <button key={i} onClick={() => (s as any).isProfile ? onMyProfile() : setPage(s.dest!)} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all text-left">
                <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
                <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500" /> Learning Progress</h3>
              <button onClick={() => setPage("progress")} className="text-sm text-indigo-600 font-semibold hover:underline">View All</button>
            </div>
            {learningList.slice(0, 3).map((skill: string, i: number) => {
              const pct = [65, 40, 20][i] || 30;
              const color = ["from-indigo-500 to-violet-500", "from-violet-500 to-purple-500", "from-blue-500 to-indigo-500"][i] || "from-indigo-500 to-violet-500";
              return (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-2"><span className="font-semibold text-gray-700">{skill}</span><span className="text-gray-400 font-medium">{pct}%</span></div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
            {learningList.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No skills selected for learning.</p>}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> Upcoming Sessions</h3>
              <button onClick={() => setPage("booking")} className="text-sm text-indigo-600 font-semibold hover:underline">View All</button>
            </div>
            {sessList.slice(0, 3).map((session, i) => {
              const partner = session.requesterId === userMe.id ? session.receiver : session.requester;
              if (!partner) return null;
              return (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-indigo-50/60 transition-all mb-3 last:mb-0">
                  <AnimatedAvatar name={partner.name} index={partner.avatarIdx} size={44} shape="square" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{partner.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{session.skill}</p>
                  </div>
                  <div className="text-right shrink-0 mr-2">
                    <p className="text-xs font-semibold text-gray-700">{session.date}, {session.time}</p>
                    <Pill text={partner.availability} variant={partner.availability === "Online" ? "green" : "blue"} />
                  </div>
                  <Btn onClick={() => setPage("messaging")} className="py-1.5 px-3 text-xs shrink-0">Join</Btn>
                </div>
              );
            })}
            {sessList.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-semibold">No upcoming sessions</p>
                <button onClick={() => setPage("marketplace")} className="text-xs text-indigo-600 font-bold hover:underline mt-1">Book one now</button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><MessageSquare className="w-4 h-4 text-indigo-500" /> Messages</h3>
              <button onClick={() => setPage("messaging")} className="text-xs text-indigo-600 font-semibold hover:underline">Open All</button>
            </div>
            {chatList.slice(0, 3).map((m, i) => (
              <button key={i} onClick={() => setPage("messaging")} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all text-left mb-1">
                <AnimatedAvatar name={m.sender} index={m.avatarIdx} size={36} />
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-800">{m.sender}</p><p className="text-xs text-gray-400 truncate">{m.lastMsg}</p></div>
                {m.unread > 0 && <span className="w-5 h-5 bg-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">{m.unread}</span>}
              </button>
            ))}
            {chatList.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No recent messages.</p>}
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Recommended Partners</h3>
            {(matches?.length > 0 ? matches : studentList).slice(0, 3).map((p, i) => (
              <div key={i} className="flex items-center gap-3 mb-3 last:mb-0">
                <AnimatedAvatar name={p.name} index={p.avatarIdx} size={40} />
                <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-800">{p.name}</p><p className="text-xs text-gray-400 truncate">{p.skill}</p></div>
                <button onClick={() => { setSelectedStudent(p); setPage("profile"); }} className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all shrink-0">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Marketplace ───────────────────────────────────────────────────────────

function Marketplace({
  setPage,
  setSelectedStudent,
  students: backendStudents,
  matches: backendMatches,
  me
}: {
  setPage: (p: Page) => void;
  setSelectedStudent: (s: any) => void;
  students: any[];
  matches: any[];
  me: any;
}) {
  const [activeLevel, setActiveLevel] = useState("All");
  const [search, setSearch] = useState("");
  const levels = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

  const studentList = backendStudents?.length > 0 ? backendStudents : students;
  const matchesList = backendMatches?.length > 0 ? backendMatches : studentList;

  const filtered = studentList.filter(s => {
    if (activeLevel !== "All" && s.level !== activeLevel) return false;
    if (search && !s.skill.toLowerCase().includes(search.toLowerCase()) && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl font-extrabold text-gray-900">Skill Marketplace</h1><p className="text-gray-500 text-sm mt-1">Discover talented students ready to teach you something new</p></div>
        <div className="relative"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search skills or students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-2xl w-64 focus:outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" /></div>
      </div>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2"><Filter className="w-4 h-4 text-indigo-500" /> Filters</h3>
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Experience Level</p>
              {levels.map(l => (
                <button key={l} onClick={() => setActiveLevel(l)} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all mb-0.5 ${activeLevel === l ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>{l}</button>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Availability</p>
              {["Online", "In-Person", "Hybrid"].map(a => (
                <label key={a} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-xl mb-0.5">
                  <input type="checkbox" className="rounded accent-indigo-600" defaultChecked={a === "Online"} /><span className="text-sm text-gray-600 font-medium">{a}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white">
            <Zap className="w-6 h-6 mb-3 text-amber-300" />
            <h3 className="font-bold mb-1 text-sm">AI Skill Matching</h3>
            <p className="text-xs text-indigo-200 mb-4 leading-relaxed">Let our AI find your perfect learning partner instantly.</p>
            <button onClick={() => {
              if (matchesList.length > 0) {
                setSelectedStudent(matchesList[0]);
                setPage("booking");
              } else {
                setPage("booking");
              }
            }} className="w-full py-2.5 bg-white text-indigo-600 font-bold text-sm rounded-xl hover:bg-indigo-50 transition-all">Find My Match</button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100 mb-5">
            <div className="flex items-center gap-2 mb-4"><Zap className="w-5 h-5 text-indigo-500" /><h3 className="font-bold text-gray-900 text-sm">AI-Recommended Matches</h3><Pill text="For You" variant="indigo" /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {matchesList.slice(0, 2).map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-indigo-100 flex items-center gap-3 hover:shadow-md transition-all">
                  <AnimatedAvatar name={s.name} index={s.avatarIdx} size={48} shape="square" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.skill}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${s.matchPct || [96, 91][i]}%` }} /></div>
                      <span className="text-xs font-extrabold text-indigo-600">{s.matchPct || [96, 91][i]}%</span>
                    </div>
                  </div>
                  <Btn onClick={() => { setSelectedStudent(s); setPage("booking"); }} className="py-1.5 px-3 text-xs shrink-0">Match</Btn>
                </div>
              ))}
              {matchesList.length === 0 && <p className="text-xs text-gray-400 text-center py-2 col-span-2">No recommendations available.</p>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all duration-200 overflow-hidden group">
                <div className="h-20 bg-gradient-to-br from-indigo-505/10 to-violet-505/10 relative flex items-center justify-center" style={{ backgroundColor: "rgba(99, 102, 241, 0.05)" }}>
                  <AnimatedAvatar name={s.name} index={s.avatarIdx} size={56} shape="square" className="absolute -bottom-7 left-4 ring-[3px] ring-white shadow-md" />
                  <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-bold border ${s.level === "Expert" ? "bg-purple-50 text-purple-600 border-purple-100" : s.level === "Advanced" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : s.level === "Intermediate" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-green-50 text-green-600 border-green-100"}`}>{s.level}</span>
                </div>
                <div className="px-4 pt-10 pb-4">
                  <h3 className="font-extrabold text-gray-900 text-sm">{s.name}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{s.university} · {s.dept}</p>
                  <div className="mt-2"><Pill text={s.skill} variant="indigo" /></div>
                  <div className="mt-2"><StarRating rating={s.rating} showCount count={s.reviewsCount !== undefined ? s.reviewsCount : s.reviews} /></div>
                  <div className="mt-2"><Pill text={s.availability} variant={s.availability === "Online" ? "green" : s.availability === "Hybrid" ? "blue" : "orange"} /></div>
                  <div className="flex gap-2 mt-4">
                    <GhostBtn onClick={() => { setSelectedStudent(s); setPage("profile"); }} className="flex-1 py-2 px-2 text-xs">View Profile</GhostBtn>
                    <Btn onClick={() => { setSelectedStudent(s); setPage("booking"); }} className="flex-1 py-2 px-2 text-xs">Book Session</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Messaging ─────────────────────────────────────────────────────────────

function Messaging({
  me,
  conversations,
  onRefreshConversations
}: {
  me: any;
  conversations: any[];
  onRefreshConversations: () => void;
}) {
  const [activeChat, setActiveChat] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const activeContact = conversations?.[activeChat] || conversationList[activeChat];

  const loadMessages = async () => {
    if (!activeContact) return;
    setLoading(true);
    try {
      const history = await apiFetch(`/api/messages/${activeContact.id}`);
      setMessages(history);
    } catch (err) {
      console.error("Failed to load messages:", err);
      // Fallback to mock data for demonstration
      setMessages(initialChatMessages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [activeChat, activeContact?.id]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeContact) return;
    try {
      const newMsg = await apiFetch(`/api/messages/${activeContact.id}/send`, {
        method: "POST",
        body: JSON.stringify({ text })
      });
      setMessages(prev => [...prev, newMsg]);
      setInput("");
      onRefreshConversations();
    } catch (err) {
      console.error("Failed to send message:", err);
      // Local fallback
      setMessages(prev => [...prev, { id: prev.length + 1, text, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), mine: true }]);
      setInput("");
    }
  };

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/70" style={{ height: "calc(100vh - 64px)" }}>
        <div className="text-center text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-lg">No conversations yet</p>
          <p className="text-sm mt-1">Go to the Marketplace to find learning partners and start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
      <div className="w-72 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 mb-3 text-sm">Messages</h2>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200" /></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {(conversations?.length > 0 ? conversations : conversationList).map((m, i) => (
            <button key={m.id} onClick={() => setActiveChat(i)} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-gray-50 transition-all ${activeChat === i ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
              <div className="relative shrink-0">
                <AnimatedAvatar name={m.sender} index={m.avatarIdx} size={44} />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline"><p className={`text-sm font-bold ${activeChat === i ? "text-indigo-700" : "text-gray-900"}`}>{m.sender}</p><p className="text-xs text-gray-400">{m.time}</p></div>
                <p className="text-xs text-gray-500 truncate">{m.lastMsg}</p>
              </div>
              {m.unread > 0 && <span className="w-5 h-5 bg-indigo-500 text-white text-xs font-extrabold rounded-full flex items-center justify-center shrink-0">{m.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50/70 min-w-0">
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3 shrink-0">
          <AnimatedAvatar name={activeContact.sender} index={activeContact.avatarIdx} size={40} />
          <div>
            <p className="font-bold text-gray-900 text-sm">{activeContact.sender}</p>
            <p className="text-xs text-green-500 font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> Online now</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 text-xs py-10">Loading messages...</div>
          ) : (
            <>
              <div className="flex justify-center mb-2">
                <div className="bg-white rounded-2xl border border-indigo-100 p-4 shadow-sm max-w-sm w-full">
                  <div className="flex items-center gap-2 mb-3"><div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0"><Calendar className="w-4 h-4 text-indigo-500" /></div><p className="font-bold text-sm text-gray-900">Session Invitation</p></div>
                  <p className="text-sm text-gray-600 mb-3">Skill Exchange with {activeContact.sender}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4"><Clock className="w-3.5 h-3.5" /> Upcoming scheduling options...</div>
                  <div className="flex gap-2"><button className="flex-1 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl">Accept</button><button className="flex-1 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl">Decline</button></div>
                </div>
              </div>

              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md flex flex-col gap-1 ${msg.mine ? "items-end" : "items-start"}`}>
                    {msg.isFile ? (
                      <div className={`px-4 py-3 rounded-2xl border flex items-center gap-3 shadow-sm ${msg.mine ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-800 border-gray-100"}`}>
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0"><Paperclip className="w-4 h-4" /></div>
                        <div><p className="text-sm font-semibold">{msg.text}</p><p className="text-xs opacity-70">2.4 MB · PDF</p></div>
                      </div>
                    ) : (
                      <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${msg.mine ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white" : "bg-white text-gray-800 border border-gray-100"}`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400 px-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="bg-white border-t border-gray-100 px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100">
            <button className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"><Paperclip className="w-4 h-4" /></button>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Type a message..." className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400" />
            <button className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"><Smile className="w-4 h-4" /></button>
            <button className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"><Mic className="w-4 h-4" /></button>
            <button onClick={handleSend} className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center hover:opacity-90 transition-all ml-1 shrink-0"><Send className="w-4 h-4 text-white" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Booking ───────────────────────────────────────────────────────────────

function Booking({
  setPage,
  me,
  selectedStudent,
  onRefreshSessions
}: {
  setPage: (p: Page) => void;
  me: any;
  selectedStudent: any;
  onRefreshSessions: () => void;
}) {
  const [selectedDay, setSelectedDay] = useState(17);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [mode, setMode] = useState<"Online" | "In-Person">("Online");
  const [notes, setNotes] = useState("");
  const [booked, setBooked] = useState(false);

  const targetStudent = selectedStudent || students[0];

  const availableDays = [14, 15, 16, 17, 18, 19, 20];
  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
  const unavailable = ["9:00 AM", "2:00 PM"];

  const handleConfirmBooking = async () => {
    try {
      await apiFetch("/api/sessions/book", {
        method: "POST",
        body: JSON.stringify({
          receiverId: targetStudent.id,
          skill: targetStudent.skill,
          date: `January ${selectedDay}, 2025`,
          time: selectedTime
        })
      });
      setBooked(true);
      onRefreshSessions();
    } catch (err) {
      console.error("Booking error:", err);
      // Local fallback in case of errors
      setBooked(true);
    }
  };

  if (booked) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-lg text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-green-500" /></div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Session Booked!</h2>
          <p className="text-gray-500 mb-2">Your session request with <span className="font-bold text-gray-800">{targetStudent.name}</span> is sent.</p>
          <div className="bg-indigo-50 rounded-2xl p-4 mb-8 text-sm text-gray-700 space-y-1.5">
            <p className="flex items-center justify-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> January {selectedDay}, 2025</p>
            <p className="flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> {selectedTime}</p>
            <p className="flex items-center justify-center gap-2"><Video className="w-4 h-4 text-indigo-500" /> {mode}</p>
          </div>
          <div className="flex gap-3"><GhostBtn onClick={() => setPage("messaging")} className="flex-1 justify-center"><MessageSquare className="w-4 h-4" /> Message</GhostBtn><Btn onClick={() => setPage("dashboard")} className="flex-1 justify-center">Dashboard <ArrowRight className="w-4 h-4" /></Btn></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-extrabold text-gray-900">Book a Session</h1><p className="text-gray-500 text-sm mt-1">Schedule a learning session with {targetStudent.name} · {targetStudent.skill}</p></div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-5"><button className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button><h3 className="font-bold text-gray-900">January 2025</h3><button className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button></div>
            <div className="grid grid-cols-7 gap-1 mb-2">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <p key={d} className="text-center text-xs font-bold text-gray-400">{d}</p>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(31)].map((_, i) => {
                const day = i + 1; const isAvail = availableDays.includes(day); const isSel = day === selectedDay; const isPast = day < 14;
                return <button key={i} onClick={() => isAvail && !isPast && setSelectedDay(day)} disabled={!isAvail || isPast} className={`aspect-square rounded-xl text-sm font-semibold transition-all ${isSel ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md" : isAvail && !isPast ? "bg-indigo-50 text-indigo-600 hover:bg-indigo-100" : isPast ? "text-gray-200 cursor-not-allowed" : "text-gray-400"}`}>{day}</button>;
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Available Times — January {selectedDay}</h3>
            <div className="grid grid-cols-4 gap-2">
              {times.map(t => { const isUnavail = unavailable.includes(t); const isSel = t === selectedTime; return <button key={t} onClick={() => !isUnavail && setSelectedTime(t)} disabled={isUnavail} className={`py-2.5 text-sm font-semibold rounded-xl border transition-all ${isSel ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-sm" : isUnavail ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through" : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"}`}>{t}</button>; })}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Session Details</h3>
            <div className="flex gap-2 mb-5">
              {(["Online", "In-Person"] as const).map(m => <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2.5 text-sm font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${mode === m ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "text-gray-600 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200"}`}>{m === "Online" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />} {m}</button>)}
            </div>
            <textarea placeholder="Add session goals or topics to cover..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none text-gray-700 placeholder-gray-400" />
          </div>
        </div>
        <div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Session Summary</h3>
            <div className="flex items-center gap-3 mb-5 p-3 bg-indigo-50 rounded-2xl">
              <AnimatedAvatar name={targetStudent.name} index={targetStudent.avatarIdx} size={48} shape="square" />
              <div><p className="font-bold text-gray-900 text-sm">{targetStudent.name}</p><p className="text-xs text-gray-500">{targetStudent.skill} · {targetStudent.level}</p><StarRating rating={targetStudent.rating} showCount count={targetStudent.reviewsCount !== undefined ? targetStudent.reviewsCount : targetStudent.reviews} /></div>
            </div>
            <div className="space-y-3 mb-5">
              {[{ icon: Calendar, label: "Date", value: `January ${selectedDay}, 2025` }, { icon: Clock, label: "Time", value: selectedTime }, { icon: mode === "Online" ? Video : MapPin, label: "Format", value: mode }, { icon: BookOpen, label: "Skill", value: targetStudent.skill }].map((item, i) => (
                <div key={i} className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0"><item.icon className="w-4 h-4 text-gray-400" /></div><div><p className="text-xs text-gray-400 font-medium">{item.label}</p><p className="text-sm font-bold text-gray-800">{item.value}</p></div></div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4"><span className="text-sm text-gray-500">Session Fee</span><span className="text-sm font-bold text-green-600">Free Exchange</span></div>
              <Btn onClick={handleConfirmBooking} className="w-full py-3 text-sm justify-center"><CheckCircle className="w-4 h-4" /> Confirm Booking</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Progress ──────────────────────────────────────────────────────────────

function Progress({
  me,
  sessions
}: {
  me: any;
  sessions: any[];
}) {
  const userMe = me || ME;
  const sessList = sessions || [];

  const completedSessions = sessList.filter(s => s.status === "completed");
  const skillsLearned = new Set(completedSessions.filter(s => s.requesterId === userMe.id).map(s => s.skill));
  const skillsTaught = new Set(completedSessions.filter(s => s.receiverId === userMe.id).map(s => s.skill));

  const stats = {
    skillsLearned: skillsLearned.size || 8,
    skillsTaught: skillsTaught.size || 3,
    learningHours: (completedSessions.length * 1.5) || 47,
    completedSessions: completedSessions.length || 24
  };

  const teachingList = typeof userMe.skillsTeaching === "string" ? JSON.parse(userMe.skillsTeaching) : (userMe.skillsTeaching || []);
  const learningList = typeof userMe.skillsLearning === "string" ? JSON.parse(userMe.skillsLearning) : (userMe.skillsLearning || []);

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-extrabold text-gray-900">Learning Progress</h1><p className="text-gray-500 text-sm mt-1">Track your skill development and session history</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Skills Learned", value: `${stats.skillsLearned}`, icon: BookOpen, bg: "bg-indigo-50", color: "text-indigo-500" },
          { label: "Skills Taught", value: `${stats.skillsTaught}`, icon: Users, bg: "bg-violet-50", color: "text-violet-500" },
          { label: "Learning Hours", value: `${stats.learningHours}h`, icon: Clock, bg: "bg-green-50", color: "text-green-500" },
          { label: "Sessions Completed", value: `${stats.completedSessions}`, icon: CheckCircle, bg: "bg-amber-50", color: "text-amber-500" }
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
            <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-indigo-500" /> Weekly Activity</h3>
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="progressAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid #e5e7eb" }} />
                <Area type="monotone" dataKey="hours" stroke="#4F46E5" strokeWidth={2.5} fill="url(#progressAreaGrad)" dot={{ fill: "#4F46E5", r: 4, strokeWidth: 2, stroke: "white" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> Recent Sessions</h3>
            {completedSessions.length > 0 ? (
              completedSessions.slice(0, 3).map((s, i) => {
                const partner = s.requesterId === userMe.id ? s.receiver : s.requester;
                if (!partner) return null;
                return (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-3 last:mb-0">
                    <AnimatedAvatar name={partner.name} index={partner.avatarIdx} size={44} shape="square" />
                    <div className="flex-1"><p className="font-bold text-gray-900 text-sm">{partner.name}</p><p className="text-xs text-gray-500">{s.skill} · {s.date}</p></div>
                    <StarRating rating={5} />
                  </div>
                );
              })
            ) : (
              [
                { name: "Marcus Johnson", skill: "UX/UI Design", date: "Jan 17", rating: 5, idx: 1 },
                { name: "Elena Rodriguez", skill: "Digital Marketing", date: "Jan 14", rating: 4, idx: 2 },
                { name: "Aiden Chen", skill: "Data Science", date: "Jan 10", rating: 5, idx: 3 },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-3 last:mb-0">
                  <AnimatedAvatar name={s.name} index={s.idx} size={44} shape="square" />
                  <div className="flex-1"><p className="font-bold text-gray-900 text-sm">{s.name}</p><p className="text-xs text-gray-500">{s.skill} · {s.date}</p></div>
                  <StarRating rating={s.rating} />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Skill Progress</h3>
            {learningList.slice(0, 4).map((skill: string, i: number) => {
              const pct = [80, 65, 40, 20][i] || 30;
              return (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex justify-between text-sm mb-1.5"><span className="font-semibold text-gray-700">{skill}</span><span className="text-gray-400 font-medium">{pct}%</span></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
            {learningList.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No learning progress to show.</p>}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Your Ratings</h3>
            <div className="text-center mb-4">
              <p className="text-5xl font-extrabold text-gray-900">{userMe.rating}</p>
              <StarRating rating={userMe.rating} />
              <p className="text-xs text-gray-500 mt-1">Based on {userMe.reviewsCount || 47} reviews</p>
            </div>
            {[{ label: "5 stars", pct: 78 }, { label: "4 stars", pct: 16 }, { label: "3 stars", pct: 4 }, { label: "2 stars", pct: 2 }].map((r, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-gray-500 w-12 shrink-0">{r.label}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} /></div>
                <span className="text-xs text-gray-400 w-6 text-right">{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile ───────────────────────────────────────────────────────────────

type ReviewItem = { name: string; idx: number; rating: number; comment: string; date: string };

const initialReviews: ReviewItem[] = [
  { name: "Marcus Johnson", idx: 1, rating: 5, comment: "Incredible teacher! Made complex concepts really easy to understand. Highly recommended.", date: "Jan 10, 2025" },
  { name: "Aiden Chen", idx: 3, rating: 5, comment: "Very patient and knowledgeable. Our session was incredibly helpful and well-structured.", date: "Dec 28, 2024" },
  { name: "Sofia Williams", idx: 4, rating: 4, comment: "Great session overall. Explained the fundamentals clearly with excellent real-world examples.", date: "Dec 15, 2024" },
];

function Profile({
  student,
  setPage,
  isOwnProfile,
  me,
  onRefreshProfile
}: {
  student: any;
  setPage: (p: Page) => void;
  isOwnProfile: boolean;
  me: any;
  onRefreshProfile?: () => void;
}) {
  const targetStudent = student || ME;
  const [profileData, setProfileData] = useState<any>(targetStudent);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const loadProfileDetails = async () => {
    if (!targetStudent?.id) return;
    setLoading(true);
    try {
      const data = await apiFetch(`/api/students/${targetStudent.id}`);
      setProfileData(data);
      setReviews(data.reviewsReceived || []);
    } catch (err) {
      console.error("Failed to load profile details:", err);
      // Fallback
      setReviews(initialReviews);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProfileData(targetStudent);
    loadProfileDetails();
  }, [targetStudent?.id]);

  const submitReview = async () => {
    if (!reviewText.trim() || reviewRating === 0) return;
    try {
      const newReview = await apiFetch(`/api/reviews/${targetStudent.id}`, {
        method: "POST",
        body: JSON.stringify({ rating: reviewRating, comment: reviewText })
      });
      setReviews(prev => [newReview, ...prev]);
      setReviewText("");
      setReviewRating(0);
      setShowReviewForm(false);
      if (onRefreshProfile) onRefreshProfile();
      // Reload profile details to update average rating and counts
      loadProfileDetails();
    } catch (err) {
      console.error("Failed to submit review:", err);
      // Local fallback
      const mockRev = {
        name: me?.name || ME.name,
        avatarIdx: me?.avatarIdx || ME.avatarIdx,
        rating: reviewRating,
        comment: reviewText,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };
      setReviews(prev => [mockRev, ...prev]);
      setReviewText("");
      setReviewRating(0);
      setShowReviewForm(false);
    }
  };

  const teachingSkills = typeof profileData.skillsTeaching === "string" ? JSON.parse(profileData.skillsTeaching) : (profileData.skillsTeaching || [profileData.skill || ""]);
  const learningSkills = typeof profileData.skillsLearning === "string" ? JSON.parse(profileData.skillsLearning) : (profileData.skillsLearning || [profileData.wants || ""]);

  const [offeredSkills, setOfferedSkills] = useState<string[]>(teachingSkills);
  const [wantedSkills, setWantedSkills] = useState<string[]>(learningSkills);

  // Sync state if profileData changes
  useEffect(() => {
    setOfferedSkills(teachingSkills);
    setWantedSkills(learningSkills);
  }, [profileData.skillsTeaching, profileData.skillsLearning]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : (profileData.rating || 5).toString();

  const handleSaveProfile = async () => {
    try {
      await apiFetch("/api/auth/me", {
        method: "PUT",
        body: JSON.stringify({
          name: profileData.name,
          bio: profileData.bio,
          year: profileData.year,
          availability: profileData.availability,
          skill: offeredSkills[0] || "",
          wants: wantedSkills[0] || "",
          skillsTeaching: offeredSkills,
          skillsLearning: wantedSkills
        })
      });
      if (onRefreshProfile) onRefreshProfile();
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  return (
    <div className="p-6">
      {/* Profile header — no cover photo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-5">
          <AnimatedAvatar name={profileData.name} index={profileData.avatarIdx} size={80} shape="square" className="ring-4 ring-indigo-50 shadow-lg shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">{profileData.name}</h1>
                <p className="text-gray-500 text-sm font-medium mt-0.5">{profileData.university} · {profileData.dept} · {profileData.year}</p>
                <div className="mt-2"><StarRating rating={parseFloat(avgRating)} showCount count={reviews.length} /></div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {isOwnProfile ? (
                  <button onClick={handleSaveProfile} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all">
                    <Settings className="w-4 h-4" /> Save Profile
                  </button>
                ) : (
                  <>
                    <GhostBtn onClick={() => setPage("messaging")}><MessageSquare className="w-4 h-4" /> Message</GhostBtn>
                    <Btn onClick={() => setPage("booking")}><Calendar className="w-4 h-4" /> Book Session</Btn>
                  </>
                )}
              </div>
            </div>
            {isOwnProfile ? (
              <textarea
                value={profileData.bio || ""}
                onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full mt-3 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                rows={2}
                placeholder="Write something about yourself..."
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed mt-3 max-w-2xl">{profileData.bio}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Pill text={profileData.university} variant="gray" />
              <Pill text={profileData.dept} variant="gray" />
              {isOwnProfile ? (
                <select
                  value={profileData.availability || "Online"}
                  onChange={e => setProfileData({ ...profileData, availability: e.target.value })}
                  className="px-2 py-1 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              ) : (
                <Pill text={profileData.availability} variant={profileData.availability === "Online" ? "green" : profileData.availability === "Hybrid" ? "blue" : "orange"} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          {/* Skills */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Skills</h3>
              {isOwnProfile && <span className="text-xs text-indigo-400 font-medium">Tap × to remove · dropdown to add</span>}
            </div>
            <div className="space-y-5">
              {isOwnProfile ? (
                <>
                  <SkillTagManager label="Skills I'm Offering" skills={offeredSkills} setSkills={setOfferedSkills} variant="indigo" />
                  <SkillTagManager label="Skills I Want to Learn" skills={wantedSkills} setSkills={setWantedSkills} variant="violet" />
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skills Offered</p>
                    <div className="flex flex-wrap gap-2">
                      {offeredSkills.map(s => <span key={s} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-xl border border-indigo-200">{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skills Wanted</p>
                    <div className="flex flex-wrap gap-2">
                      {wantedSkills.map(s => <span key={s} className="px-3 py-1.5 bg-violet-50 text-violet-700 text-sm font-semibold rounded-xl border border-violet-200">{s}</span>)}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Reviews ({reviews.length})</h3>
              {!isOwnProfile && !showReviewForm && (
                <button onClick={() => setShowReviewForm(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100">
                  <Plus className="w-3.5 h-3.5" /> Write a Review
                </button>
              )}
            </div>

            {!isOwnProfile && showReviewForm && (
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-100 mb-5">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">Your Review for {profileData.name.split(" ")[0]}</h4>
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">Your Rating</p>
                  <InteractiveStars value={reviewRating} onChange={setReviewRating} />
                  {reviewRating > 0 && <p className="text-xs text-indigo-600 font-semibold mt-1.5">{["", "Poor", "Fair", "Good", "Great", "Excellent!"][reviewRating]}</p>}
                </div>
                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-2">Your Experience</p>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3}
                    placeholder={`Share what you learned from ${profileData.name.split(" ")[0]}...`}
                    className="w-full px-4 py-3 text-sm bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none text-gray-700 placeholder-gray-400" />
                </div>
                <div className="flex gap-2">
                  <GhostBtn onClick={() => { setShowReviewForm(false); setReviewRating(0); setReviewText(""); }} className="py-2 px-4 text-xs">Cancel</GhostBtn>
                  <Btn onClick={submitReview} className={`py-2 px-4 text-xs ${(!reviewText.trim() || reviewRating === 0) ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <CheckCircle className="w-3.5 h-3.5" /> Submit Review
                  </Btn>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {reviews.map((r, i) => {
                const reviewerName = r.name || r.reviewer?.name || r.sender?.name || "Anonymous";
                const reviewerAvatar = r.avatarIdx !== undefined ? r.avatarIdx : (r.idx !== undefined ? r.idx : (r.reviewer?.avatarIdx !== undefined ? r.reviewer.avatarIdx : (r.sender?.avatarIdx || 0)));
                const reviewDate = r.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "");
                return (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <AnimatedAvatar name={reviewerName} index={reviewerAvatar} size={36} />
                      <div className="flex-1"><p className="font-bold text-sm text-gray-900">{reviewerName}</p><StarRating rating={r.rating} /></div>
                      {reviewDate && <p className="text-xs text-gray-400 font-medium">{reviewDate}</p>}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                  </div>
                );
              })}
              {reviews.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No reviews yet.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Availability</h3>
            <div className="grid grid-cols-7 gap-1 mb-1.5">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <p key={i} className="text-center text-xs font-bold text-gray-400">{d}</p>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(28)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-lg text-xs flex items-center justify-center font-semibold ${[1, 3, 4, 8, 10, 11, 15, 17, 18, 22, 24, 25].includes(i) ? "bg-indigo-100 text-indigo-600" : "text-gray-300"}`}>{i + 1}</div>
              ))}
            </div>
            {!isOwnProfile && <Btn onClick={() => setPage("booking")} className="w-full mt-4 py-2.5 text-xs justify-center"><Calendar className="w-3.5 h-3.5" /> Book a Slot</Btn>}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Stats</h3>
            {[{ label: "Total Sessions", value: `${profileData.reviewsCount || profileData.reviews || 0}` }, { label: "Students Helped", value: `${Math.round((profileData.reviewsCount || profileData.reviews || 0) * 0.85)}` }, { label: "Response Rate", value: "98%" }, { label: "Avg. Response Time", value: "< 2 hours" }].map((s, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500 font-medium">{s.label}</span>
                <span className="text-sm font-bold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin ─────────────────────────────────────────────────────────────────

function Admin({
  setPage,
  setSelectedStudent,
  me,
  pendingList,
  membersList,
  statsList,
  onRefreshAdmin
}: {
  setPage: (p: Page) => void;
  setSelectedStudent: (s: any) => void;
  me: any;
  pendingList: any[];
  membersList: any[];
  statsList: any[];
  onRefreshAdmin?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"members" | "pending" | "analytics">("members");

  const adminMembers = membersList?.length > 0 ? membersList : [
    { id: 1, name: "Bushra Sehar", email: "bushra@mit.edu", university: "MIT", skill: "Machine Learning", status: "Active", joined: "Sep 2024", avatarIdx: 0 },
    { id: 2, name: "Marcus Johnson", email: "marcus@stanford.edu", university: "Stanford", skill: "UX/UI Design", status: "Active", joined: "Oct 2024", avatarIdx: 1 },
    { id: 3, name: "Elena Rodriguez", email: "elena@harvard.edu", university: "Harvard", skill: "Digital Marketing", status: "Active", joined: "Oct 2024", avatarIdx: 2 },
    { id: 4, name: "Aiden Chen", email: "aiden@caltech.edu", university: "Caltech", skill: "Data Science", status: "Active", joined: "Nov 2024", avatarIdx: 3 },
    { id: 5, name: "Sofia Williams", email: "sofia@columbia.edu", university: "Columbia", skill: "Public Speaking", status: "Active", joined: "Nov 2024", avatarIdx: 4 },
    { id: 6, name: "Armeen", email: "armeen@cmu.edu", university: "Carnegie Mellon", skill: "iOS Development", status: "Active", joined: "Jan 2025", avatarIdx: 5 },
  ];
  const adminPending = pendingList !== undefined ? pendingList : pendingApprovals;

  const removeMember = async (id: number) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await apiFetch(`/api/admin/users/${id}/role`, {
        method: "POST",
        body: JSON.stringify({ role: "revoked" })
      });
      if (onRefreshAdmin) onRefreshAdmin();
    } catch (err) {
      console.error(err);
    }
  };

  const approvePending = async (id: number) => {
    try {
      await apiFetch(`/api/admin/approvals/${id}/approve`, { method: "POST" });
      if (onRefreshAdmin) onRefreshAdmin();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectPending = async (id: number) => {
    try {
      await apiFetch(`/api/admin/approvals/${id}/reject`, { method: "POST" });
      if (onRefreshAdmin) onRefreshAdmin();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6"><h1 className="text-2xl font-extrabold text-gray-900">Admin Panel</h1><p className="text-gray-500 text-sm mt-1">Manage members, approve applications, and monitor platform activity</p></div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Members", value: `${adminMembers.length}`, change: "+12%", positive: true, icon: Users, bg: "bg-indigo-50", color: "text-indigo-500" },
          { label: "Pending Approval", value: `${adminPending.length}`, change: `${adminPending.length} new`, positive: adminPending.length === 0, icon: UserCheck, bg: "bg-amber-50", color: "text-amber-500" },
          { label: "Sessions This Month", value: "1,247", change: "+18%", positive: true, icon: Calendar, bg: "bg-violet-50", color: "text-violet-500" },
          { label: "Reports Pending", value: "7", change: "-3", positive: false, icon: Flag, bg: "bg-red-50", color: "text-red-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}><s.icon className={`w-5 h-5 ${s.color}`} /></div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${s.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>{s.change}</span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit mb-6">
        {([["members", "All Members"], ["pending", "Pending Approvals"], ["analytics", "Analytics"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === key ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {label}
            {key === "pending" && adminPending.length > 0 && (
              <span className="ml-2 w-5 h-5 bg-amber-400 text-white text-xs font-extrabold rounded-full inline-flex items-center justify-center">{adminPending.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Platform Members ({adminMembers.length})</h3>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input placeholder="Search members..." className="pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 w-52" /></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70">
                <tr>{["Member", "University", "Skill", "Status", "Joined", "Actions"].map(h => <th key={h} className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {adminMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/60 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AnimatedAvatar name={m.name} index={m.avatarIdx} size={36} />
                        <div><p className="font-bold text-sm text-gray-900">{m.name}</p><p className="text-xs text-gray-400">{m.email}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{m.university}</td>
                    <td className="px-6 py-4"><Pill text={m.skill || "Member"} variant="indigo" /></td>
                    <td className="px-6 py-4"><Pill text={m.role === "admin" ? "Admin" : "Active"} variant={m.role === "admin" ? "purple" : "green"} /></td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{m.joined || new Date(m.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelectedStudent(m); setPage("profile"); }} className="p-2 rounded-xl text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => removeMember(m.id)} className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Remove Member"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {adminMembers.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No members found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending Tab */}
      {activeTab === "pending" && (
        <div>
          {adminPending.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-500" /></div>
              <h3 className="font-bold text-gray-900 mb-1">All caught up!</h3>
              <p className="text-sm text-gray-500">No pending membership applications.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {adminPending.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <AnimatedAvatar name={p.name} index={p.avatarIdx} size={52} shape="square" />
                    <div className="flex-1">
                      <p className="font-extrabold text-gray-900 text-base">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.university} · {p.dept}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.email}</p>
                    </div>
                    <Pill text="Pending" variant="amber" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4 bg-gray-50 rounded-xl px-3 py-2">
                    <span>Applied: <span className="font-semibold text-gray-600">{p.applied || new Date(p.createdAt || Date.now()).toLocaleDateString()}</span></span>
                    <span>Application ID: <span className="font-semibold text-gray-600">#{p.id}</span></span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => rejectPending(p.id)} className="flex-1 py-2.5 text-sm font-bold text-red-500 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                      <UserX className="w-4 h-4" /> Reject
                    </button>
                    <button onClick={() => approvePending(p.id)} className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm">
                      <UserCheck className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Growth Analytics</h3>
              <div className="flex gap-4 text-xs"><span className="flex items-center gap-1.5 font-semibold text-indigo-600"><span className="w-3 h-1.5 bg-indigo-500 rounded-full inline-block" />Users</span><span className="flex items-center gap-1.5 font-semibold text-violet-600"><span className="w-3 h-1.5 bg-violet-500 rounded-full inline-block" />Sessions</span></div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} barSize={18} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "16px", border: "1px solid #e5e7eb" }} />
                <Bar dataKey="users" fill="#4F46E5" radius={[5, 5, 0, 0]} />
                <Bar dataKey="sessions" fill="#7C3AED" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Quick Actions</h3>
            {[
              { label: "Pending Verifications", count: 12, icon: CheckCircle, bg: "bg-amber-50", color: "text-amber-500" },
              { label: "User Reports", count: 3, icon: AlertCircle, bg: "bg-orange-50", color: "text-orange-500" },
              { label: "Skill Categories", count: 24, icon: Layers, bg: "bg-indigo-50", color: "text-indigo-500" },
              { label: "Active Sessions", count: 842, icon: Users, bg: "bg-green-50", color: "text-green-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all mb-1.5 last:mb-0 cursor-pointer">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}><item.icon className={`w-4 h-4 ${item.color}`} /></div>
                <span className="text-sm font-semibold text-gray-700 flex-1">{item.label}</span>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <button onClick={() => setPage("landing")} className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
              <span className="text-lg font-extrabold text-white">Skill<span className="text-indigo-400">Sync</span></span>
            </button>
            <p className="text-sm leading-relaxed text-gray-500">Connecting university students through peer-to-peer skill exchange. Learn more, teach more, grow together.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-[0.15em]">Platform</h4>
            <ul className="space-y-2.5">
              {[{ label: "Features", action: () => setPage("landing") }, { label: "Marketplace", action: () => setPage("marketplace") }, { label: "Dashboard", action: () => setPage("dashboard") }, { label: "Progress", action: () => setPage("progress") }].map(link => (
                <li key={link.label}><button onClick={link.action} className="text-sm text-gray-500 hover:text-white transition-colors font-medium">{link.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-xs uppercase tracking-[0.15em]">Account</h4>
            <ul className="space-y-2.5">
              {[{ label: "Admin Panel", page: "admin" as Page }].map(link => (
                <li key={link.page}><button onClick={() => setPage(link.page)} className="text-sm text-gray-500 hover:text-white transition-colors font-medium">{link.label}</button></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800 gap-4">
          <p className="text-sm text-gray-600">© 2025 SkillSync. Built for students, by students.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [me, setMe] = useState<any>(null);
  const [studentList, setStudentList] = useState<any[]>([]);
  const [matchList, setMatchList] = useState<any[]>([]);
  const [sessionList, setSessionList] = useState<any[]>([]);
  const [conversationListState, setConversationListState] = useState<any[]>([]);
  const [pendingApprovalsState, setPendingApprovalsState] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any[]>([]);

  const [selectedStudent, setSelectedStudent] = useState<any>(students[0]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loadProfile = async () => {
    try {
      const user = await apiFetch("/api/auth/me");
      setMe(user);
      setIsLoggedIn(true);
      loadAllData(user);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      handleLogout();
    }
  };

  const loadAllData = async (currentUser: any) => {
    try {
      const studList = await apiFetch("/api/students");
      setStudentList(studList);
      
      const smartMatches = await apiFetch("/api/students/matches");
      setMatchList(smartMatches);

      const sessList = await apiFetch("/api/sessions");
      setSessionList(sessList);

      const convList = await apiFetch("/api/messages");
      setConversationListState(convList);

      if (currentUser?.role === "admin") {
        const pending = await apiFetch("/api/admin/approvals");
        setPendingApprovalsState(pending);

        const usersList = await apiFetch("/api/admin/users");
        setAdminUsers(usersList);

        const stats = await apiFetch("/api/admin/stats");
        setAdminStats(stats);
      }
    } catch (err) {
      console.error("Error loading application data:", err);
    }
  };

  const handleLogin = (token: string) => {
    setIsLoggedIn(true);
    loadProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMe(null);
    setIsLoggedIn(false);
    setPage("landing");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadProfile();
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn && APP_PAGES.includes(page)) setPage("login");
  }, [page, isLoggedIn]);

  const goToOwnProfile = () => { setIsOwnProfile(true); setPage("profile"); };
  const goToStudentProfile = (s: any) => { setIsOwnProfile(false); setSelectedStudent(s); setPage("profile"); };

  const isAuthPage = page === "login" || page === "signup";
  const isAppPage = APP_PAGES.includes(page);
  const isMessaging = page === "messaging";

  const refreshSessions = async () => {
    try {
      const sessList = await apiFetch("/api/sessions");
      setSessionList(sessList);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshConversations = async () => {
    try {
      const convList = await apiFetch("/api/messages");
      setConversationListState(convList);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshProfile = async () => {
    if (me) {
      try {
        const user = await apiFetch("/api/auth/me");
        setMe(user);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background antialiased" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes avatarPulse {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.05); }
        }
        h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; }
        * { scrollbar-width: thin; scrollbar-color: #e0e7ff transparent; }
        *::-webkit-scrollbar { width: 4px; }
        *::-webkit-scrollbar-thumb { background: #e0e7ff; border-radius: 99px; }
      `}</style>

      {!isAuthPage && <Navbar page={page} setPage={setPage} isLoggedIn={isLoggedIn} me={me} />}

      {isAuthPage && (page === "login" ? <LoginPage setPage={setPage} onLogin={handleLogin} /> : <SignupPage setPage={setPage} onSignup={handleLogin} />)}

      {!isAuthPage && (
        <>
          {isAppPage ? (
            <div className="flex">
              <Sidebar page={page} setPage={setPage} onMyProfile={goToOwnProfile} onLogout={handleLogout} me={me} />
              <main className="flex-1 min-w-0" style={{ overflowY: isMessaging ? "hidden" : "auto", maxHeight: isMessaging ? "calc(100vh - 64px)" : undefined }}>
                {page === "dashboard" && (
                  <Dashboard
                    setPage={setPage}
                    setSelectedStudent={goToStudentProfile}
                    onMyProfile={goToOwnProfile}
                    me={me}
                    students={studentList}
                    sessions={sessionList}
                    conversations={conversationListState}
                    matches={matchList}
                  />
                )}
                {page === "marketplace" && (
                  <Marketplace
                    setPage={setPage}
                    setSelectedStudent={goToStudentProfile}
                    students={studentList}
                    matches={matchList}
                    me={me}
                  />
                )}
                {page === "messaging" && (
                  <Messaging
                    me={me}
                    conversations={conversationListState}
                    onRefreshConversations={refreshConversations}
                  />
                )}
                {page === "booking" && (
                  <Booking
                    setPage={setPage}
                    me={me}
                    selectedStudent={selectedStudent}
                    onRefreshSessions={refreshSessions}
                  />
                )}
                {page === "progress" && <Progress me={me} sessions={sessionList} />}
                {page === "profile" && (
                  <Profile
                    student={isOwnProfile ? me : selectedStudent}
                    setPage={setPage}
                    isOwnProfile={isOwnProfile}
                    me={me}
                    onRefreshProfile={refreshProfile}
                  />
                )}
                {page === "admin" && (
                  <Admin
                    setPage={setPage}
                    setSelectedStudent={goToStudentProfile}
                    me={me}
                    pendingList={pendingApprovalsState}
                    membersList={adminUsers}
                    statsList={adminStats}
                    onRefreshAdmin={async () => {
                      const pending = await apiFetch("/api/admin/approvals");
                      setPendingApprovalsState(pending);
                      const usersList = await apiFetch("/api/admin/users");
                      setAdminUsers(usersList);
                      const stats = await apiFetch("/api/admin/stats");
                      setAdminStats(stats);
                    }}
                  />
                )}
              </main>
            </div>
          ) : (
            <>
              <Landing setPage={setPage} />
              <Footer setPage={setPage} />
            </>
          )}
          <FloatingChat setPage={setPage} />
        </>
      )}
    </div>
  );
}
