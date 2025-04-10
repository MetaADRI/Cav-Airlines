# 📁 Project Structure: CAV-Zambia-Airlines

This document outlines the purpose of each folder and file in the **CAV-Zambia-Airlines** system. It is designed to help all team members understand where each component belongs and how it contributes to the overall system. So please, make sure you communicate before committing anything. Twapapata 🙏🏾.

---

## File Stucture Schema
```
/CAV-Zambia-Airlines
│
├── docs/                        # Documentation (project notes, ERD, design drafts, etc.)                  
│   ├── database/
│   │   ├── database_schema.sql  # SQL schema file
│   │   └── ERD.png              # Entity Relationship Diagram
│   │              
│   ├── ui-ux_design/
│   │   ├── Wireframes 
│   │   └── Design sketches
│   │   
│   ├── documentation            # official documentation (docx or pdf)
│   ├── requirements.txt         # Original requirements or feature list                
│   └── user reference manual    # user manual (docx or pdf)
│
├── frontend/
│   ├── assets/
│   │   ├── images/              # All static images (jpg, png, gif)
│   │   ├── videos/              # All video files
│   │   └── uploads/             # Uploaded ID/passport files (pdf/jpg)
│   │
│   ├── css/
│   │   ├── home.css
│   │   ├── booking.css
│   │   ├── services.css 
│   │   ├── about_us.css
│   │   ├── contact.css
│   │   └── user_dashboard.css  
│   │
│   ├── js/
│   │   ├── home.js
│   │   ├── booking.js
│   │   ├── services.js 
│   │   ├── about_us.js
│   │   ├── contact.js
│   │   └── user_dashboard.js  
│   │
│   ├── home.html
│   ├── booking.html
│   ├── services.html
│   ├── about_us.html
│   ├── contact.html
│   └── user_dashboard.html   
│
├── backend/
│   ├── home.php
│   ├── services.php
│   ├── booking.php
│   ├── contact.php
│   ├── login.php
│   ├── register.php
│   ├── upload.php
│   ├── track_booking.php
│   ├── user_dashboard.php     
│   └── utils/                 # Reusable backend utilities
│       ├── db_connect.php
│       └── auth.php
│
├── admin/
│   ├── dashboard.php
│   ├── manage_users.php
│   ├── manage_bookings.php
│   └── manage_flights.php
│
└── index.php                  # redirector

```
---

## 📁 Root Folder: `CAV-Zambia-Airlines/`

Main directory containing the full system — frontend, backend, admin panel, and documentation.

---

## 📂 `/docs/` — 📚 Project Documentation

Stores all design drafts, schema files, project guides, and technical references. 

### Contents

- `database/`
  - `database_schema.sql` — Defines the full database structure (tables, fields, relationships).
  - `ERD.png` — Visual representation of database table relationships (Entity Relationship Diagram).

- `ui-ux_design/`
  - `Wireframes/` — Page layout wireframes.
  - `Design sketches/` — Visual style drafts.

- `documentation/` — System architecture notes, setup instructions, changelogs.
- `requirements.txt` — Initial feature list and business rules.
- `user reference manual/` — Instructions and guides for non-technical end-users.

---

## 📂 `/frontend/` — 🎨 User-Facing Interface

Files that define what users see and interact with (HTML/CSS/JavaScript).

### Structure

- `assets/`
  - `images/` — Logos, background images, and other visual content.
  - `videos/` — Video assets (welcome messages, ads, etc.).
  - `uploads/` — Folder for uploaded user ID/passport files.

- `css/`
  - `home.css`, `booking.css`, `services.css`, etc. — Page-specific styles.

- `js/`
  - `home.js`, `booking.js`, etc. — Page-specific interactivity and client-side validation.

- HTML Pages:
  - `home.html`, `booking.html`, `services.html`, `about us.html`, `contact.html` — Main web pages.

- `user_dashboard.html` — User account dashboard for tracking bookings and flight statuses.

---

## 📂 `/backend/` — 🧠 Server-Side Logic (PHP)

Handles form submissions, session management, file uploads, and database interactions.

### Key Files

- `home.php`, `services.php`, `booking.php` — Backend handlers for each page.
- `login.php` / `register.php` — User authentication (login/signup).
- `upload.php` — Processes and saves uploaded files securely.
- `track_booking.php` — Fetches real-time booking and flight status.
- `user_dashboard.php` — Backend logic for the user dashboard.

- `utils/`
  - `db_connect.php` — Reusable database connection script.
  - `auth.php` — Session/authentication functions for secured access.

---

## 📂 `/admin/` — 🔐 Admin Portal

Backend control panel for system administrators.

### Admin Pages

- `user_dashboard.php` — Admin dashboard (renamed from `dashboard.php`).
- `manage_users.php` — View and manage all registered users.
- `manage_bookings.php` — Admin view of all bookings.
- `manage_flights.php` — Manage flight routes and their schedules.

---

## 📄 `index.php` — 🚀 Entry Point

Main redirector. Determines whether to send users to login, home page, or dashboard based on session status.

---

## ✅ Special Feature: User Dashboard

- `user_dashboard.html` (Frontend)  
- `user_dashboard.php` (Backend)

Allows logged-in users to:

- View booking status (`Pending`, `Confirmed`, `Cancelled`)
- Track flight progress and upcoming schedules

---

## 📋 Summary Table

| **Folder**        | **Purpose**                                           | **Managed By**            |
|-------------------|--------------------------------------------------------|---------------------------|
| `/docs/`          | Project documentation, database schema, guides         | PM, Designers, Tech Leads |
| `/frontend/`      | User interface, styling, client-side logic             | Frontend Developers       |
| `/backend/`       | Business logic, database access, file uploads          | Backend Developers        |
| `/admin/`         | Admin-only interface for managing users/flights/bookings | Admin Panel Devs, QA      |
| `/uploads/`       | Stores uploaded documents securely                     | DevOps, Backend           |

---
