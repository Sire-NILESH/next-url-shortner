# 🔗 URL Shortener App

▶️ Click the image below to watch it on **Youtube**.

<div  align="center">
	<br />
	<a  href="https://youtu.be/LtQfHsjAXwk?si=l644uCIe2quPuAkg"  target="_blank">
		<img  src="https://img.youtube.com/vi/LtQfHsjAXwk/maxresdefault.jpg"  alt="Project Banner">
	</a>
	<br />
</div>

A security-aware, and analytics-focused URL Shortener built with **Next.js 15**, **TypeScript**, **Drizzle ORM**, and **PostgreSQL**. It provides a modern, scalable system for shortening URLs, tracking clicks, and ensuring security through Google Safe Browsing and Gemini AI-based analysis.

---

### 🔐 Authentication

- **NextAuth v5** with support for OAuth and custom credentials.
- Middleware-based protection for routes with token verification.

### ✂️ URL Shortening

- Authenticated users can shorten any valid URL.
- Shortcodes are auto-generated or user-defined.

### 🧠 Smart Safety Checks

- URLs are scanned with **Google Safe Browsing API** and **Gemini AI** for:
  - Malware
  - Phishing
  - Adult content
  - Deceptive redirects
- Modular safety logic lives in server-only service files for strict separation of concerns.

### 🛡️ Access Guardrails

- **Flagged URLs** are blocked or rate-limited depending on severity.
- URLs can be suspended or set inactive by admins.
- Middleware ensures flagged/inactive URLs don’t redirect but can show a warning page.

### 📊 Admin Dashboard

- Historical analytics using **Drizzle ORM** + SQL `generate_series()` for:
  - Click counts by day/week/month/year
  - URL vs Flagged Ratio
  - URLs generated over time
  - User growth
- Data tables with admin controls

  - URLs table with advanced filtering on status, search, threat-type, safety, category and column sort. Admin controls include

    - Change the status of a URL to **Active** | **Inactive** | **Suspend**
    - Approve a URL
    - Delete a URL
    - Go to the User that created the URL

  - Users table with advanced filtering on status, search, role, provider type and and column sort.
    Admin controls include:
    - Change the status of a URL to **Active** | **Inactive** | **Suspend**
    - Deleting a User is not allowed, instead set the status to **Inactive**

- Dashboard built using:
  - **React + ShadCN UI**
  - **TanStack Table v8** for powerful table UX
  - **ShadCN charts / Recharts** for dynamic data visualization
  - **Parallel Routes (Next.js 15)** to eliminate data waterfall between charts

## ✂️ URL Shortening Behavior

- Enusre request is from a authenticated user and has a **Active** status.
- Validate the URL and custom code if any.
- Verify the URL safety against Google Safe Browsing API and Google Gemini AI.

## 🚦 URL Redirect Behavior

- Middleware intercepts `/r/[shortCode]` and rewrites the url to now point to `/api/v1/r/[shortCode]`.
- The `/api/v1/r/[shortCode]` route handler then processes and handles all redirections.
- If URL is flagged:
  - ✅ Minor → Allowed with limited clicks and caution page
  - 🚫 Major (e.g. malware) → Blocked with warning page
  - 🚫 Clicks limit exceeded → Blocked with url-blocked page
- If URL has a status:
  - ✅ Active → Allowed
  - 🚫 Suspend → Blocked with url-blocked page
  - 🚫 Inactive → Blocked with url-blocked page
- If URL creator has a status:
  - ✅ Active → Allowed
  - 🚫 Suspend → Blocked with url-blocked page
  - 🚫 Inactive → Blocked with url-blocked page

### ⚙️ Tech Stack

| Layer         | Tech                                     |
| ------------- | ---------------------------------------- |
| Frontend      | Next.js 15 (App Router), React, Tailwind |
| UI Components | ShadCN UI                                |
| Data Fetching | React Query (TanStack Query)             |
| Database      | PostgreSQL + Drizzle ORM                 |
| Auth          | NextAuth v5                              |
| Safe Browsing | Google Safe Browsing + Gemini AI         |
| Analytics     | SQL-level aggregation + Charts           |

## 🛠️ Getting Started

To get started with this project, run

```bash
git  clone  https://github.com/Sire-NILESH/next-url-shortner.git
```

and copy the **.env.example** variables into a separate **.env file**, fill them out and that's all you need to get started!
