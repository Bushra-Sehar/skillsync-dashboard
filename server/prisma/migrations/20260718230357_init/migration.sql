-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "dept" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "wants" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "avatarIdx" INTEGER NOT NULL DEFAULT 0,
    "availability" TEXT NOT NULL DEFAULT 'Online',
    "bio" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT 'student',
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "skillsTeaching" TEXT NOT NULL DEFAULT '[]',
    "skillsLearning" TEXT NOT NULL DEFAULT '[]'
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requesterId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "skill" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT "Session_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Session_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "isFile" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reviewerId" INTEGER NOT NULL,
    "revieweeId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Review_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
