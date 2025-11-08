# Social Media Analytics Platform - Frontend

This is the **frontend service** for the Social Media Analytics Platform.  
It is built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**, providing the user interface for authentication, post management, analytics, and scheduling.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Deployment Notes](#deployment-notes)
- [License](#license)

---

## Features

- User authentication with JWT (access token in store, refresh token in cookies)
- Protected routes with role-based access
- Post management (view, schedule, analytics)
- Analytics dashboards and insights
- Lazy loading for improved performance
- Input validation
- Error boundaries and fallback UIs for better UX
- Responsive design using Tailwind CSS

---

## Tech Stack

- **React.js** - Frontend library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **React Router DOM** - Routing
- **Axios** - API calls
- **Tailwind CSS** - Styling
- **Zustand** - State management for auth
- **React.lazy + Suspense** - Code splitting & lazy loading
- **ErrorBoundary** - Error handling for components

---

## Prerequisites

- Node.js >= 20
- npm >= 9
- Backend API running (local or deployed)

---

## Getting Started

Follow these steps to run the frontend locally:

### 1. Clone the repository

```bash
git clone <https://github.com/saqlain-abbas01/Social-Media-Analytics-Platform-Frontend.git>
cd frontend
npm i
npm run dev
