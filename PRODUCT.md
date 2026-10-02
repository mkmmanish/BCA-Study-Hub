# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

BCA students at colleges who need to find study materials relevant to their year, semester, and subjects. College administrators curate materials and notices for those students.

## Product Purpose

BCA Study Hub organizes course materials, learning resources, and student study activity in one year- and semester-aware platform.

## Positioning

The hub connects student course context to administrator-managed study materials, making relevant notes, papers, videos, assignments, practicals, and reference resources discoverable together.

## Operating Context

Students use the hub to search and study across six semesters in three years. Administrators use a protected dashboard to manage students, subjects, semesters, materials, and notices.

## Capabilities and Constraints

The requested product includes student and admin authentication, student registration and profiles, searchable and filterable study materials, bookmarks, recent activity, progress tracking, notices, quizzes, exam schedules, and assignment deadlines. A runnable local implementation will use an API and SQLite persistence with seeded demo accounts and content. Passwords must be hashed and authenticated sessions use JWT. YouTube lessons must use the official embedded player; videos are not downloaded, rehosted, or stripped of ads. Reference PDFs must be legal/open-access or link to an external resource. Admin-only actions must be protected by role-based authorization.

## Evidence on Hand

The product name, audience, feature requirements, and local API/SQLite implementation choice are provided in the request. No college branding, official course catalog, real student records, or approved institutional materials were provided; seeded accounts and sample content must be identified as illustrative.

## Product Principles

- Make study resources specific to the student's year and semester.
- Keep materials organized by subject and academic structure.
- Give students clear, direct access to official and legally shared resources.
- Restrict content management to authorized administrators.
- Support both focused study and course administration across desktop and mobile.

## Accessibility & Inclusion

The web experience should remain usable on mobile and support semantic, keyboard-accessible controls.
