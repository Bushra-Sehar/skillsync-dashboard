import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "./db.js";
import { authenticateToken, JWT_SECRET } from "./middleware/auth.js";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Helper to update student rating stats
async function updateStudentRating(studentId) {
    const reviews = await prisma.review.findMany({
        where: { revieweeId: studentId }
    });
    if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await prisma.user.update({
            where: { id: studentId },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewsCount: reviews.length
            }
        });
    }
}
// ─── AUTH ENDPOINTS ─────────────────────────────────────────────────────────
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { name, email, password, university, dept, year } = req.body;
        if (!name || !email || !password || !university || !dept || !year) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "Email is already registered" });
            return;
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                university,
                dept,
                year,
                skill: "Machine Learning", // Default skill
                wants: "UX Design", // Default wants
                level: "Beginner",
                avatarIdx: Math.floor(Math.random() * 6),
                availability: "Online",
                bio: `Hi, I am ${name}. Passionate to teach and learn!`,
                role: "student",
                isApproved: true, // Auto-approve for demo simplicity
                skillsTeaching: JSON.stringify(["Machine Learning"]),
                skillsLearning: JSON.stringify(["UX Design"])
            }
        });
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Missing email or password" });
            return;
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isApproved) {
            res.status(401).json({ error: "Invalid email or account is pending approval" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Update Profile
app.put("/api/auth/me", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, bio, availability, skill, wants, skillsTeaching, skillsLearning } = req.body;
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                availability,
                skill,
                wants,
                skillsTeaching: skillsTeaching ? JSON.stringify(skillsTeaching) : undefined,
                skillsLearning: skillsLearning ? JSON.stringify(skillsLearning) : undefined
            }
        });
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// ─── STUDENT / MARKETPLACE ENDPOINTS ───────────────────────────────────────
app.get("/api/students", authenticateToken, async (req, res) => {
    try {
        const currentUserId = req.user?.id;
        const { search, level, availability } = req.query;
        const whereClause = {
            isApproved: true,
            role: "student",
            id: { not: currentUserId } // Exclude self
        };
        const students = await prisma.user.findMany({
            where: whereClause
        });
        // Post-filtering for search and JSON fields in Javascript to keep it simple and robust on SQLite
        let filtered = students;
        if (search) {
            const q = search.toLowerCase();
            filtered = filtered.filter(s => s.name.toLowerCase().includes(q) ||
                s.skill.toLowerCase().includes(q) ||
                s.university.toLowerCase().includes(q) ||
                s.dept.toLowerCase().includes(q));
        }
        if (level && level !== "All") {
            filtered = filtered.filter(s => s.level === level);
        }
        if (availability) {
            // availability can be string (comma-separated or single)
            const avList = availability.split(",");
            filtered = filtered.filter(s => avList.includes(s.availability));
        }
        res.json(filtered);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Smart AI Matching
app.get("/api/students/matches", authenticateToken, async (req, res) => {
    try {
        const currentUserId = req.user?.id;
        const me = await prisma.user.findUnique({ where: { id: currentUserId } });
        if (!me) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const others = await prisma.user.findMany({
            where: {
                isApproved: true,
                role: "student",
                id: { not: currentUserId }
            }
        });
        // Score match percentage
        const matches = others.map(student => {
            let score = 50; // Base score
            // Perfect cross match: what I want is what they teach AND what they want is what I teach
            const myWants = JSON.parse(me.skillsLearning || "[]");
            const myTeaches = JSON.parse(me.skillsTeaching || "[]");
            const theirWants = JSON.parse(student.skillsLearning || "[]");
            const theirTeaches = JSON.parse(student.skillsTeaching || "[]");
            const teachesMyWant = theirTeaches.some(s => myWants.includes(s)) || student.skill === me.wants;
            const wantsMyTeach = myTeaches.some(s => theirWants.includes(s)) || me.skill === student.wants;
            if (teachesMyWant && wantsMyTeach) {
                score += 40; // Double match
            }
            else if (teachesMyWant) {
                score += 25; // They teach what I want
            }
            else if (wantsMyTeach) {
                score += 15; // They want what I teach
            }
            // Shared university
            if (me.university.toLowerCase() === student.university.toLowerCase()) {
                score += 5;
            }
            // Shared dept
            if (me.dept.toLowerCase() === student.dept.toLowerCase()) {
                score += 3;
            }
            const matchPct = Math.min(98, score); // Cap at 98% for realistic feel
            return {
                ...student,
                matchPct
            };
        });
        // Sort by matchPct desc
        matches.sort((a, b) => b.matchPct - a.matchPct);
        res.json(matches);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Specific Student Profile + Reviews
app.get("/api/students/:id", authenticateToken, async (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        const student = await prisma.user.findUnique({
            where: { id: studentId },
            include: {
                reviewsReceived: {
                    include: { reviewer: true },
                    orderBy: { createdAt: "desc" }
                }
            }
        });
        if (!student) {
            res.status(404).json({ error: "Student not found" });
            return;
        }
        res.json(student);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Write Review
app.post("/api/students/:id/reviews", authenticateToken, async (req, res) => {
    try {
        const revieweeId = parseInt(req.params.id);
        const reviewerId = req.user?.id;
        const { rating, comment } = req.body;
        if (!rating || !comment) {
            res.status(400).json({ error: "Rating and comment are required" });
            return;
        }
        if (reviewerId === revieweeId) {
            res.status(400).json({ error: "You cannot review yourself" });
            return;
        }
        const review = await prisma.review.create({
            data: {
                reviewerId: reviewerId,
                revieweeId,
                rating: parseInt(rating),
                comment
            }
        });
        await updateStudentRating(revieweeId);
        res.status(201).json(review);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// ─── BOOKING / SESSIONS ENDPOINTS ──────────────────────────────────────────
app.get("/api/sessions", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const sessions = await prisma.session.findMany({
            where: {
                OR: [
                    { requesterId: userId },
                    { receiverId: userId }
                ]
            },
            include: {
                requester: true,
                receiver: true
            }
        });
        res.json(sessions);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/api/sessions/book", authenticateToken, async (req, res) => {
    try {
        const requesterId = req.user?.id;
        const { receiverId, skill, date, time } = req.body;
        if (!receiverId || !skill || !date || !time) {
            res.status(400).json({ error: "Missing required session details" });
            return;
        }
        const session = await prisma.session.create({
            data: {
                requesterId: requesterId,
                receiverId: parseInt(receiverId),
                skill,
                date,
                time,
                status: "pending"
            },
            include: {
                requester: true,
                receiver: true
            }
        });
        res.status(201).json(session);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.patch("/api/sessions/:id/status", authenticateToken, async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id);
        const { status } = req.body; // "approved" | "rejected" | "completed"
        if (!["approved", "rejected", "completed"].includes(status)) {
            res.status(400).json({ error: "Invalid status value" });
            return;
        }
        const session = await prisma.session.update({
            where: { id: sessionId },
            data: { status },
            include: {
                requester: true,
                receiver: true
            }
        });
        res.json(session);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// ─── MESSAGING ENDPOINTS ───────────────────────────────────────────────────
// Retrieve recent conversations list
app.get("/api/messages", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        // Find all users the current user has chatted with
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            orderBy: { createdAt: "desc" }
        });
        // Group messages by contact
        const contactIds = new Set();
        const conversations = [];
        for (const msg of messages) {
            const contactId = msg.senderId === userId ? msg.receiverId : msg.senderId;
            if (!contactIds.has(contactId)) {
                contactIds.add(contactId);
                const contact = await prisma.user.findUnique({ where: { id: contactId } });
                if (contact) {
                    conversations.push({
                        id: contact.id,
                        sender: contact.name,
                        avatarIdx: contact.avatarIdx,
                        lastMsg: msg.text,
                        time: msg.time,
                        unread: 0 // Mocked unread for simplicity, or can count
                    });
                }
            }
        }
        res.json(conversations);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get Chat history with a specific student
app.get("/api/messages/:studentId", authenticateToken, async (req, res) => {
    try {
        const userId = req.user?.id;
        const contactId = parseInt(req.params.studentId);
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: contactId },
                    { senderId: contactId, receiverId: userId }
                ]
            },
            orderBy: { createdAt: "asc" }
        });
        const formatted = messages.map(m => ({
            id: m.id,
            text: m.text,
            time: m.time,
            mine: m.senderId === userId,
            isFile: m.isFile
        }));
        res.json(formatted);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Send Message
app.post("/api/messages/:studentId/send", authenticateToken, async (req, res) => {
    try {
        const senderId = req.user?.id;
        const receiverId = parseInt(req.params.studentId);
        const { text, isFile } = req.body;
        if (!text) {
            res.status(400).json({ error: "Message text is required" });
            return;
        }
        const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const msg = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                text,
                time: timeStr,
                isFile: isFile || false
            }
        });
        res.status(201).json({
            id: msg.id,
            text: msg.text,
            time: msg.time,
            mine: true,
            isFile: msg.isFile
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// ─── ADMIN ENDPOINTS ───────────────────────────────────────────────────────
// Check Admin Middleware
function requireAdmin(req, res, next) {
    if (req.user?.role !== "admin") {
        res.status(403).json({ error: "Forbidden: Admins only" });
        return;
    }
    next();
}
app.get("/api/admin/approvals", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const pending = await prisma.user.findMany({
            where: { isApproved: false }
        });
        res.json(pending);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/api/admin/approvals/:id/approve", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        await prisma.user.update({
            where: { id: studentId },
            data: { isApproved: true }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/api/admin/approvals/:id/reject", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        await prisma.user.delete({
            where: { id: studentId }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: "student" }
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const studentId = parseInt(req.params.id);
        await prisma.user.delete({
            where: { id: studentId }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
        // Generate some admin dashboard monthly statistics
        const totalUsers = await prisma.user.count({ where: { role: "student", isApproved: true } });
        const totalSessions = await prisma.session.count();
        const monthlyData = [
            { month: "Aug", users: 320, sessions: 180 },
            { month: "Sep", users: 450, sessions: 240 },
            { month: "Oct", users: 620, sessions: 380 },
            { month: "Nov", users: 800, sessions: 520 },
            { month: "Dec", users: 950, sessions: 680 },
            { month: "Jan", users: totalUsers, sessions: totalSessions },
        ];
        res.json(monthlyData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
