import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
    console.log("Seeding database...");
    // Clear existing data
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    const passwordHash = await bcrypt.hash("password123", 10);
    // 1. Create Users
    // Create ME
    const me = await prisma.user.create({
        data: {
            email: "bushra@mit.edu",
            passwordHash,
            name: "Bushra Sehar",
            university: "MIT",
            dept: "Computer Science",
            year: "3rd Year",
            skill: "Machine Learning",
            wants: "UX Design",
            level: "Advanced",
            rating: 4.9,
            reviewsCount: 47,
            avatarIdx: 0,
            availability: "Online",
            bio: "Passionate ML researcher and teaching assistant who loves breaking down complex concepts into digestible lessons.",
            role: "student",
            isApproved: true,
            skillsTeaching: JSON.stringify(["Machine Learning", "Python", "Deep Learning", "TensorFlow", "PyTorch"]),
            skillsLearning: JSON.stringify(["UX/UI Design", "Figma", "Adobe XD", "Prototyping", "Wireframing"])
        }
    });
    // Create Students
    const marcus = await prisma.user.create({
        data: {
            email: "marcus@stanford.edu",
            passwordHash,
            name: "Marcus Johnson",
            university: "Stanford",
            dept: "Design",
            year: "4th Year",
            skill: "UX/UI Design",
            wants: "React Development",
            level: "Advanced",
            rating: 4.8,
            reviewsCount: 38,
            avatarIdx: 1,
            availability: "Hybrid",
            bio: "Product designer with internship experience at Google. Passionate about creating intuitive digital experiences.",
            role: "student",
            isApproved: true,
            skillsTeaching: JSON.stringify(["UX/UI Design", "Figma", "Adobe XD", "Prototyping", "Wireframing"]),
            skillsLearning: JSON.stringify(["React Development", "JavaScript", "TypeScript"])
        }
    });
    const elena = await prisma.user.create({
        data: {
            email: "elena@harvard.edu",
            passwordHash,
            name: "Elena Rodriguez",
            university: "Harvard",
            dept: "Business",
            year: "2nd Year",
            skill: "Digital Marketing",
            wants: "Data Analysis",
            level: "Intermediate",
            rating: 4.7,
            reviewsCount: 29,
            avatarIdx: 2,
            availability: "Online",
            bio: "Marketing enthusiast with hands-on campaign management experience. Growth-mindset driven and results-focused.",
            role: "student",
            isApproved: true,
            skillsTeaching: JSON.stringify(["Digital Marketing", "SEO", "Content Marketing", "Social Media"]),
            skillsLearning: JSON.stringify(["Data Science", "Statistics", "SQL"])
        }
    });
    const aiden = await prisma.user.create({
        data: {
            email: "aiden@caltech.edu",
            passwordHash,
            name: "Aiden Chen",
            university: "Caltech",
            dept: "Mathematics",
            year: "3rd Year",
            skill: "Data Science",
            wants: "Web Development",
            level: "Advanced",
            rating: 4.9,
            reviewsCount: 52,
            avatarIdx: 3,
            availability: "In-Person",
            bio: "Statistical modeling expert and Kaggle top-10% competitor. Making data meaningful and actionable.",
            role: "student",
            isApproved: true,
            skillsTeaching: JSON.stringify(["Data Science", "Statistics", "SQL", "Data Visualization", "Tableau"]),
            skillsLearning: JSON.stringify(["React Development", "JavaScript", "Node.js"])
        }
    });
    const sofia = await prisma.user.create({
        data: {
            email: "sofia@columbia.edu",
            passwordHash,
            name: "Sofia Williams",
            university: "Columbia",
            dept: "Psychology",
            year: "4th Year",
            skill: "Public Speaking",
            wants: "Statistics",
            level: "Expert",
            rating: 5.0,
            reviewsCount: 61,
            avatarIdx: 4,
            availability: "Hybrid",
            bio: "TED talk alumna and debate champion. Helping students unlock their voice and communicate with confidence.",
            role: "student",
            isApproved: true,
            skillsTeaching: JSON.stringify(["Public Speaking", "Presentation Skills", "Debate", "Communication"]),
            skillsLearning: JSON.stringify(["Data Science", "Statistics", "SQL"])
        }
    });
    const armeen = await prisma.user.create({
        data: {
            email: "armeen@cmu.edu",
            passwordHash,
            name: "Armeen",
            university: "Carnegie Mellon",
            dept: "Computer Science",
            year: "2nd Year",
            skill: "iOS Development",
            wants: "Machine Learning",
            level: "Intermediate",
            rating: 4.6,
            reviewsCount: 18,
            avatarIdx: 5,
            availability: "Online",
            bio: "Built 3 apps on the App Store. Swift enthusiast and regular hackathon participant with a product mindset.",
            role: "student",
            isApproved: true,
            skillsTeaching: JSON.stringify(["iOS Development", "Swift", "Android Development", "Kotlin", "Flutter"]),
            skillsLearning: JSON.stringify(["Machine Learning", "Python", "Deep Learning"])
        }
    });
    // Admin user
    const admin = await prisma.user.create({
        data: {
            email: "admin@skillsync.edu",
            passwordHash,
            name: "Admin User",
            university: "SkillSync System",
            dept: "Administration",
            year: "Staff",
            skill: "System Admin",
            wants: "Feedback",
            level: "Expert",
            rating: 5.0,
            avatarIdx: 6,
            availability: "Online",
            role: "admin",
            isApproved: true
        }
    });
    // Pending Approvals (isApproved: false)
    const pendingUsers = [
        { email: "lena@columbia.edu", name: "Lena Park", university: "Columbia University", dept: "Engineering", year: "3rd Year", avatarIdx: 2 },
        { email: "dario@ucsd.edu", name: "Dario Reyes", university: "UC San Diego", dept: "Physics", year: "2nd Year", avatarIdx: 3 },
        { email: "fatima@yale.edu", name: "Fatima Nasser", university: "Yale University", dept: "CS", year: "4th Year", avatarIdx: 4 },
        { email: "tom@nyu.edu", name: "Tom Eriksson", university: "NYU", dept: "Math", year: "1st Year", avatarIdx: 1 }
    ];
    for (const pu of pendingUsers) {
        await prisma.user.create({
            data: {
                email: pu.email,
                passwordHash,
                name: pu.name,
                university: pu.university,
                dept: pu.dept,
                year: pu.year,
                skill: "General",
                wants: "General",
                level: "Beginner",
                avatarIdx: pu.avatarIdx,
                isApproved: false
            }
        });
    }
    // 2. Create Messages (Chat between me and marcus, me and elena, etc.)
    const messages = [
        { senderId: marcus.id, receiverId: me.id, text: "Hey! Are you available this week for a session on Python?", time: "10:23 AM" },
        { senderId: me.id, receiverId: marcus.id, text: "Hi Marcus! Yes, I am free Thursday evening and Friday morning.", time: "10:25 AM" },
        { senderId: marcus.id, receiverId: me.id, text: "Friday morning works perfectly. How about 10am?", time: "10:26 AM" },
        { senderId: me.id, receiverId: marcus.id, text: "10am Friday it is! Should we do it on Zoom or Google Meet?", time: "10:28 AM" },
        { senderId: marcus.id, receiverId: me.id, text: "Zoom is fine. I will send the session invite. Also, I prepared some notes!", time: "10:30 AM" },
        { senderId: marcus.id, receiverId: me.id, text: "ML_Foundations_Notes.pdf", time: "10:30 AM", isFile: true },
        // Message with elena
        { senderId: me.id, receiverId: elena.id, text: "Hey Elena, thanks for the marketing session yesterday! It was super helpful.", time: "Yesterday" },
        { senderId: elena.id, receiverId: me.id, text: "Thanks for the marketing session!", time: "1h ago" },
        // Message with aiden
        { senderId: aiden.id, receiverId: me.id, text: "I shared the data science resources", time: "3h ago" },
        // Message with armeen
        { senderId: armeen.id, receiverId: me.id, text: "Your ML explanations are really clear!", time: "Yesterday" }
    ];
    for (const msg of messages) {
        await prisma.message.create({
            data: {
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                text: msg.text,
                time: msg.time,
                isFile: msg.isFile || false
            }
        });
    }
    // 3. Create Sessions
    await prisma.session.create({
        data: {
            requesterId: marcus.id,
            receiverId: me.id,
            skill: "UX/UI Design",
            date: "Friday",
            time: "10:00 AM",
            status: "approved"
        }
    });
    await prisma.session.create({
        data: {
            requesterId: armeen.id,
            receiverId: me.id,
            skill: "iOS Development",
            date: "Saturday",
            time: "02:00 PM",
            status: "approved"
        }
    });
    // 4. Create Reviews
    await prisma.review.create({
        data: {
            reviewerId: aiden.id,
            revieweeId: me.id,
            rating: 5,
            comment: "Excellent tutor! Made neural networks sound like child's play."
        }
    });
    console.log("Database seeded successfully!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
