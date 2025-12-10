# 🚀 LeetCode Company Explorer - Project Roadmap

> **Vision**: Transform a static collection of 667 company folders into a dynamic, personalized interview preparation platform.

---

## 📊 Project Overview

### The Problem
- Data is siloed in `Company → Time Period → CSV` folder structure
- No way to answer: "Which companies asked Two Sum?"
- Manual navigation through hundreds of folders is tedious
- No personal progress tracking

### The Solution
A full-stack web application with:
- **Question-Centric Database**: One question → All companies that asked it
- **User Accounts**: Track personal progress
- **Smart Filtering**: Find high-yield questions instantly
- **Analytics**: Measure interview readiness

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js + React |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB |
| Auth | NextAuth.js |

---

## 📁 Database Schema

### `questions` Collection
```json
{
  "_id": 49,
  "title": "Group Anagrams",
  "url": "https://leetcode.com/problems/group-anagrams",
  "difficulty": "Medium",
  "acceptance_rate": 71.7,
  "companies": [
    {
      "name": "google",
      "period": "0-6-months",
      "frequency": 82.0
    }
  ],
  "company_names": ["google", "amazon"]
}
```

### `users` Collection
```json
{
  "_id": "user_123",
  "email": "user@example.com",
  "name": "Mohit",
  "created_at": "2024-12-07"
}
```

### `progress` Collection
```json
{
  "user_id": "user_123",
  "question_id": 49,
  "status": "SOLVED",
  "notes": "Used hash map approach",
  "is_bookmarked": true,
  "date_solved": "2024-12-07"
}
```

---

# 🎯 Development Phases

---

## Phase 1: Foundation & Data Migration
> **Goal**: Set up the project and get all CSV data into MongoDB.

### Module 1.1: Project Initialization
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS for styling
- [ ] Configure project structure (components, pages, lib, api)
- [ ] Set up ESLint and Prettier

### Module 1.2: Database Setup
- [ ] Set up MongoDB (local or Atlas)
- [ ] Create database connection utility
- [ ] Define Mongoose schemas for `questions`, `users`, `progress`

### Module 1.3: Data Migration Script
- [ ] Write script to walk through all 667 company folders
- [ ] Parse CSV files and extract question data
- [ ] Handle "upsert" logic (update if exists, insert if new)
- [ ] Add company info to each question document
- [ ] Run migration and verify data integrity

**✅ Phase 1 Deliverable**: MongoDB populated with all questions from all companies.

---

## Phase 2: Core Explorer UI
> **Goal**: Build the main interface to browse and search questions.

### Module 2.1: Layout & Navigation
- [ ] Create app shell with header and sidebar
- [ ] Design responsive layout (mobile-friendly)
- [ ] Implement dark/light mode toggle

### Module 2.2: Questions Table/List
- [ ] Build main questions table component
- [ ] Display: Title, Difficulty, Acceptance %, Companies
- [ ] Add pagination or infinite scroll
- [ ] Implement sorting (by difficulty, acceptance, frequency)

### Module 2.3: Search & Basic Filters
- [ ] Global search bar (search by title or ID)
- [ ] Filter by difficulty (Easy, Medium, Hard)
- [ ] Filter by company (multi-select dropdown)
- [ ] Filter by time period (0-6 months, 6+ months)

### Module 2.4: Question Detail View
- [ ] Create modal or page for question details
- [ ] Show all companies that asked this question
- [ ] Display frequency % per company
- [ ] "Solve on LeetCode" button (opens URL)

**✅ Phase 2 Deliverable**: A beautiful, searchable question explorer.

---

## Phase 3: User Authentication
> **Goal**: Allow users to log in and save their data.

### Module 3.1: NextAuth Setup
- [ ] Install and configure NextAuth.js
- [ ] Set up authentication providers (Google, GitHub, or Email)
- [ ] Create login/signup pages
- [ ] Protect API routes that require auth

### Module 3.2: User Profile
- [ ] Create user profile page
- [ ] Display user info (name, email, avatar)
- [ ] Show account creation date

**✅ Phase 3 Deliverable**: Working authentication system.

---

## Phase 4: Progress Tracking
> **Goal**: Let users mark questions as Solved/Attempted and add notes.

### Module 4.1: Status Tracking
- [ ] Add status buttons to each question (Todo, Attempted, Solved)
- [ ] Create API endpoints to save/update status
- [ ] Store status in `progress` collection
- [ ] Show status visually in the questions list (color/icon)

### Module 4.2: Personal Notes
- [ ] Add notes textarea in question detail view
- [ ] Save notes to database
- [ ] Display notes in question card/modal

### Module 4.3: "Must Revise" Bookmarks
- [ ] Add bookmark/star button to questions
- [ ] Create "Must Revise" page showing all bookmarked questions
- [ ] Allow filtering within bookmarks

**✅ Phase 4 Deliverable**: Full progress tracking with notes and bookmarks.

---

## Phase 5: Advanced Filtering
> **Goal**: Power-user filters for interview preparation optimization.

### Module 5.1: Company Intersection Filter
- [ ] "Show questions asked by Company A AND Company B"
- [ ] Multi-company select with AND/OR toggle
- [ ] Highlight questions asked by multiple selected companies

### Module 5.2: High-Yield Filter
- [ ] Filter by frequency % threshold (e.g., >50%)
- [ ] Combine with difficulty filter
- [ ] "Hot Questions" preset (High frequency + Medium difficulty)

### Module 5.3: Acceptance Rate Filter
- [ ] Filter by acceptance rate range
- [ ] "Tricky Questions" preset (<30% acceptance)

### Module 5.4: Progress-Based Filters
- [ ] "Show only unsolved questions"
- [ ] "Show only solved questions"
- [ ] "Show bookmarked questions"

**✅ Phase 5 Deliverable**: Advanced filtering for targeted preparation.

---

## Phase 6: Analytics & Gamification
> **Goal**: Visualize progress and motivate users.

### Module 6.1: Company Readiness Score 🚀
- [ ] Calculate: (Solved Questions / Total Questions) per company
- [ ] Display as progress bar with percentage
- [ ] Show on company filter dropdown
- [ ] Create dedicated "Readiness Dashboard" page

### Module 6.2: Activity Heatmap
- [ ] Track solving dates in `progress` collection
- [ ] Build heatmap component (GitHub-style calendar)
- [ ] Display on user profile/dashboard
- [ ] Show current streak

### Module 6.3: Statistics Dashboard
- [ ] Total questions solved (Easy/Medium/Hard breakdown)
- [ ] Questions solved per company
- [ ] Solving trend over time (line chart)

**✅ Phase 6 Deliverable**: Motivating analytics dashboard.

---

## Phase 7: Polish & Enhancements
> **Goal**: Refine UX and add quality-of-life features.

### Module 7.1: UI/UX Improvements
- [ ] Add loading skeletons
- [ ] Implement toast notifications
- [ ] Add keyboard shortcuts (search, navigation)
- [ ] Optimize for mobile

### Module 7.2: Data Insights
- [ ] "Company Difficulty Trend" (are they asking harder questions now?)
- [ ] "Most Common Questions" (asked by most companies)
- [ ] "Hidden Gems" (high acceptance, low attempts)

### Module 7.3: Export & Sharing
- [ ] Export solved questions list as CSV/PDF
- [ ] Share readiness score (image for LinkedIn?)

**✅ Phase 7 Deliverable**: A polished, production-ready application.

---

# 📅 Summary Timeline

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Foundation & Data Migration | ⬜ Not Started |
| Phase 2 | Core Explorer UI | ⬜ Not Started |
| Phase 3 | User Authentication | ⬜ Not Started |
| Phase 4 | Progress Tracking | ⬜ Not Started |
| Phase 5 | Advanced Filtering | ⬜ Not Started |
| Phase 6 | Analytics & Gamification | ⬜ Not Started |
| Phase 7 | Polish & Enhancements | ⬜ Not Started |

---

# 🏁 Let's Build!

> **Next Step**: Start Phase 1 - Initialize the project and migrate data.
