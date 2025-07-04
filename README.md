<p align="center">
    <img src="/public/logo.svg" align="center" width="30%">
</p>
<p align="center"><h1 align="center">NextRole: AI-Powered Interview Platform</h1></p>
<p align="center">
	<em><code><a href="https://next-role-prep.vercel.app/" target="_blank" >❯ Live</a></code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/iamvishalrathi/NextRole?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/iamvishalrathi/NextRole?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/iamvishalrathi/NextRole?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/iamvishalrathi/NextRole?style=default&color=0080ff" alt="repo-language-count">
</p>
<p align="center">
		<em>Built with the tools and technologies:</em>
</p>
<p align="center">
    <img src="https://img.shields.io/badge/Next.js-000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="nextjs" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="firebase" />
    <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="openai" />
    <img src="https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="gemini" />
    <img src="https://img.shields.io/badge/Vapi_AI-000000?style=for-the-badge&logo=voice&logoColor=white" alt="vapi" />
</p>

<br>

## 🔗 Table of Contents

- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [⚙️ Tech Stack](#-tech-stack)
- [🔍 Website Preview](#-website-preview)
- [📂 Repository Structure](#-repository-structure)
- [🚀 Getting Started](#-getting-started)
    - [📦 Installation](#-installation)
    - [🤖 Usage](#-usage)
- [📞 Contact](#-contact)

---

## 📍 Overview
PrepWise is an AI-powered interview preparation platform designed to help job seekers practice and improve their interview skills. The application uses advanced AI technology to generate customized interview questions, conduct realistic interview simulations, and provide detailed feedback and scoring to help users identify their strengths and areas for improvement.

---

## 👾 Features

### 1. Customized Interview Generation
- Create personalized interview experiences based on:
  - Job role (e.g., Frontend Developer, Data Scientist)
  - Experience level (Entry, Mid, Senior)
  - Interview type (Behavioral, Technical, Mixed)
  - Tech stack (e.g., React, Node.js, MongoDB)
  - Number of questions (1-20)
  - Visibility settings (Public or Private)

### 2. AI-Powered Interview Simulation
- Voice-based interview conducted by an AI interviewer
- Natural conversation flow with realistic questions
- Real-time transcription of responses

### 3. Comprehensive Feedback
- Detailed performance analysis across multiple categories:
  - Communication Skills
  - Technical Knowledge
  - Problem-Solving
  - Cultural & Role Fit
  - Confidence & Clarity
- Overall score out of 100
- Identified strengths and areas for improvement
- Final assessment with actionable recommendations

### 4. User Profiles & Interview Library
- Personal user profiles with interview history
- Access to public interviews created by other users
- Rating system for interview quality
- Analytics for interview creators

### 5. Community Features
- Discover and practice with interviews created by other users
- Share your custom interviews with the community
- View profiles of other users and their public interviews

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- **Next.js**: React framework for server-rendered applications
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hook Form**: Form validation and handling
- **Zod**: TypeScript-first schema validation
- **Sonner**: Toast notifications

### 🛠️ Backend
- **Next.js API Routes**: Server-side API endpoints
- **Firebase**: Authentication and backend services
- **Google Gemini AI**: AI model for interview question generation and feedback
- **Vapi AI**: Voice interface for natural conversation

### 🗄️ Database
- **Firebase Firestore**: NoSQL cloud database for storing user data, interviews, and analytics

### 🔐 Authentication
- **Firebase Authentication**: Secure user management

---

## 🔍 Website Preview
![image](https://github.com/iamvishalrathi/PodTales/blob/main/public/sns.png)

---

## 📂 Repository Structure

```sh
└── NextRole/
    ├── README.md
    ├── app
    │   ├── (auth)
    │   ├── (root)
    │   ├── api
    │   ├── favicon.ico
    │   ├── globals.css
    │   └── layout.tsx
    ├── components
    │   ├── Agent.tsx
    │   ├── AuthForm.tsx
    │   ├── DisplayTechIcons.tsx
    │   ├── EditInterview.tsx
    │   ├── FeedbackWithRating.tsx
    │   ├── FormField.tsx
    │   ├── InterviewCard.tsx
    │   ├── InterviewForm.tsx
    │   ├── RatingModal.tsx
    │   ├── SignOut.tsx
    │   └── ui
    ├── components.json
    ├── constants
    │   └── index.ts
    ├── eslint.config.mjs
    ├── firebase
    │   ├── admin.ts
    │   └── client.ts
    ├── lib
    │   ├── actions
    │   ├── utils.ts
    │   └── vapi.sdk.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── public
    │   ├── ai-avatar.png
    │   ├── calendar.svg
    │   ├── covers
    │   ├── edit.webp
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── logo.svg
    │   ├── marks.png
    │   ├── marks2.png
    │   ├── pattern.png
    │   ├── profile.svg
    │   ├── react.svg
    │   ├── robot.png
    │   ├── star.svg
    │   ├── tailwind.svg
    │   ├── tech.svg
    │   ├── upload.svg
    │   ├── user-avatar.png
    │   └── window.svg
    ├── tsconfig.json
    └── types
        ├── index.d.ts
        └── vapi.d.ts
```
---

## 🚀 Getting Started

### 📦 Installation

Install NextRole using one of the following methods:

**Build from source:**

1. Clone the NextRole repository:
```sh
❯ git clone https://github.com/iamvishalrathi/NextRole
```

2. Navigate to the project directory:
```sh
❯ cd NextRole
```

3. Install the project dependencies:


**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm install
```

### 🤖 Usage
Run NextRole using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm run dev
```

---

## **📞 Contact**
For any questions, suggestions, or feedback, feel free to reach out:
- **Email:** [rajatrathi029@gmail.com](mailto:rajatrathi029@gmail.com)
