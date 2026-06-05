# The Ledger — Blog Platform

A full-stack blog platform with separate public-facing and author interfaces. Readers can browse posts and leave comments. Authors and admins can write, edit, and publish posts via a rich text editor. Built as a portfolio project exploring monorepo structure, JWT authentication, and separate React frontends consuming a shared REST API.

## Live Deployments:

[Public Frontend](https://blog-api-public-two.vercel.app/)
[Admin Dashboard](https://blog-api-admin-sigma.vercel.app/)

## Architecture

Three packages in one repository:

- **server** — Express REST API with PostgreSQL via Prisma ORM
- **client-public** — React (Vite) reader-facing blog with post listing, post detail, and comments
- **client-admin** — React (Vite) author dashboard with post management, TinyMCE editor, and comment moderation

The two frontends are deployed independently on Vercel. The API and database are hosted on Koyeb.

## Features

### Public
- Browse all published posts
- Read full post with comment thread
- Register and login
- Leave comments on posts
- Admin users are redirected to the author dashboard on login

### Author Dashboard
- View all posts split by published and draft status
- One-click publish and unpublish
- Create and edit posts with TinyMCE rich text editor
- Save as draft or publish directly
- View, edit, and delete comments per post

### API
- JWT authentication — token issued on login, verified on protected routes
- Role-based access — guests can comment, members can post, admins have full access
- Passwords hashed with PBKDF2 via Node's built-in crypto module

## Tech Stack

- **Backend** — Node.js, Express, Prisma ORM, PostgreSQL
- **Frontend** — React, Vite, React Router
- **Auth** — JWT, passport-local
- **Editor** — TinyMCE 6 via `@tinymce/tinymce-react`
- **Hosting** — Vercel (frontends), Koyeb (API + database)

## Prerequisites

- Node.js v18+
- PostgreSQL v14+
- TinyMCE API key from [tiny.cloud](https://www.tiny.cloud)

## File Structure

├── client-admin
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src
│   │   ├── api
│   │   │   └── index.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── main.jsx
│   │   └── pages
│   │       ├── Login.jsx
│   │       ├── PostEditor.jsx
│   │       └── Posts.jsx
│   └── vite.config.js
├── client-public
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src
│   │   ├── api
│   │   │   └── index.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── components
│   │   │   └── Navbar.jsx
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── main.jsx
│   │   └── pages
│   │       ├── Home.jsx
│   │       ├── Login.jsx
│   │       ├── Post.jsx
│   │       └── Register.jsx
│   └── vite.config.js
├── package.json
├── package-lock.json
├── postman
│   ├── collections
│   ├── environments
│   ├── flows
│   ├── globals
│   │   └── workspace.globals.yaml
│   ├── mocks
│   └── specs
├── prisma
│   └── schema.prisma
├── prisma.config.ts
└── server
    ├── app.js
    ├── controllers
    │   ├── authController.js
    │   ├── commentController.js
    │   └── postController.js
    ├── db
    │   ├── commentDb.js
    │   ├── index.js
    │   ├── postDb.js
    │   ├── prismaClient.js
    │   └── userDb.js
    ├── lib
    │   ├── passwordUtils.js
    │   └── prisma.ts
    ├── middleware
    │   └── auth.js
    └── routes
        ├── adminRouter.js
        ├── authRouter.js
        ├── commentRouter.js
        └── postRouter.js

## API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | Token | Get current user |
| GET | /api/posts | — | All published posts |
| GET | /api/posts/:id | — | Single post with comments |
| POST | /api/posts | Member+ | Create post |
| PUT | /api/posts/:id | Member+ | Update post |
| DELETE | /api/posts/:id | Member+ | Delete post |
| GET | /api/posts/:id/comments | — | Comments for a post |
| POST | /api/posts/:id/comments | Token | Create comment |
| PUT | /api/posts/:id/comments/:id | Token | Edit own comment |
| DELETE | /api/posts/:id/comments/:id | Token | Delete own comment |

## License

MIT