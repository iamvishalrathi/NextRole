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
    <img src="https://img.shields.io/badge/-Typescript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_._JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-OpenAI-black?style=for-the-badge&logoColor=white&logo=openai&color=412991" alt="openai" />
</p>

<br>

##  Table of Contents

- [ Overview](#-overview)
- [ Features](#-features)
- [Tech Stack](#-tech-stack)
- [ Project Structure](#-project-structure)
  - [ Project Index](#-project-index)
- [ Getting Started](#-getting-started)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Testing](#-testing)
- [Contact](#-contact)

---

##  Overview

PrepWise is an AI-powered interview preparation platform designed to help job seekers practice and improve their interview skills. The application uses advanced AI technology to generate customized interview questions, conduct realistic interview simulations, and provide detailed feedback and scoring to help users identify their strengths and areas for improvement.

![image](https://github.com/user-attachments/assets/24f52e77-48b6-4e24-90ef-3e6b2846db6a)

---
##  Features

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
### Tech Stack

### Frontend
- **Next.js**: React framework for server-rendered applications
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Hook Form**: Form validation and handling
- **Zod**: TypeScript-first schema validation
- **Sonner**: Toast notifications

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **Firebase**: Authentication and database
- **Google Gemini AI**: AI model for interview question generation and feedback
- **Vapi AI**: Voice interface for natural conversation

### Authentication
- Firebase Authentication for secure user management
---

---

##  Project Structure

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


###  Project Index
<details open>
	<summary><b><code>NextRole/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/package-lock.json'>package-lock.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/next.config.ts'>next.config.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/tsconfig.json'>tsconfig.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/eslint.config.mjs'>eslint.config.mjs</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/postcss.config.mjs'>postcss.config.mjs</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/package.json'>package.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components.json'>components.json</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- types Submodule -->
		<summary><b>types</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/types/vapi.d.ts'>vapi.d.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/types/index.d.ts'>index.d.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- lib Submodule -->
		<summary><b>lib</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/lib/vapi.sdk.ts'>vapi.sdk.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/lib/utils.ts'>utils.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
			<details>
				<summary><b>actions</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/lib/actions/auth.action.ts'>auth.action.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/lib/actions/general.actions.ts'>general.actions.ts</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<details> <!-- components Submodule -->
		<summary><b>components</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/Agent.tsx'>Agent.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/EditInterview.tsx'>EditInterview.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/InterviewForm.tsx'>InterviewForm.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/SignOut.tsx'>SignOut.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/FormField.tsx'>FormField.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/FeedbackWithRating.tsx'>FeedbackWithRating.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/AuthForm.tsx'>AuthForm.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/InterviewCard.tsx'>InterviewCard.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/RatingModal.tsx'>RatingModal.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/DisplayTechIcons.tsx'>DisplayTechIcons.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
			<details>
				<summary><b>ui</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/ui/label.tsx'>label.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/ui/input.tsx'>input.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/ui/form.tsx'>form.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/ui/button.tsx'>button.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/ui/switch.tsx'>switch.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/components/ui/sonner.tsx'>sonner.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<details> <!-- constants Submodule -->
		<summary><b>constants</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/constants/index.ts'>index.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
		</blockquote>
	</details>
	<details> <!-- app Submodule -->
		<summary><b>app</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/layout.tsx'>layout.tsx</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/globals.css'>globals.css</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
			<details>
				<summary><b>(auth)</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(auth)/layout.tsx'>layout.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
					<details>
						<summary><b>sign-in</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(auth)/sign-in/page.tsx'>page.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
					<details>
						<summary><b>sign-up</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(auth)/sign-up/page.tsx'>page.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>(root)</b></summary>
				<blockquote>
					<table>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(root)/layout.tsx'>layout.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					<tr>
						<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(root)/page.tsx'>page.tsx</a></b></td>
						<td><code>❯ REPLACE-ME</code></td>
					</tr>
					</table>
					<details>
						<summary><b>interview</b></summary>
						<blockquote>
							<table>
							<tr>
								<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(root)/interview/page.tsx'>page.tsx</a></b></td>
								<td><code>❯ REPLACE-ME</code></td>
							</tr>
							</table>
							<details>
								<summary><b>[id]</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(root)/interview/[id]/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
									<details>
										<summary><b>analytics</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(root)/interview/[id]/analytics/page.tsx'>page.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											</table>
										</blockquote>
									</details>
									<details>
										<summary><b>edit</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(root)/interview/[id]/edit/page.tsx'>page.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											</table>
										</blockquote>
									</details>
									<details>
										<summary><b>feedback</b></summary>
										<blockquote>
											<table>
											<tr>
												<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(root)/interview/[id]/feedback/page.tsx'>page.tsx</a></b></td>
												<td><code>❯ REPLACE-ME</code></td>
											</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<details>
						<summary><b>user</b></summary>
						<blockquote>
							<details>
								<summary><b>[id]</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/(root)/user/[id]/page.tsx'>page.tsx</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<details>
				<summary><b>api</b></summary>
				<blockquote>
					<details>
						<summary><b>vapi</b></summary>
						<blockquote>
							<details>
								<summary><b>generate</b></summary>
								<blockquote>
									<table>
									<tr>
										<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/app/api/vapi/generate/route.ts'>route.ts</a></b></td>
										<td><code>❯ REPLACE-ME</code></td>
									</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<details> <!-- firebase Submodule -->
		<summary><b>firebase</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/firebase/client.ts'>client.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/iamvishalrathi/NextRole/blob/master/firebase/admin.ts'>admin.ts</a></b></td>
				<td><code>❯ REPLACE-ME</code></td>
			</tr>
			</table>
		</blockquote>
	</details>
</details>

---
##  Getting Started

###  Prerequisites

Before getting started with NextRole, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** Npm


###  Installation

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




###  Usage
Run NextRole using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm start
```


###  Testing
Run the test suite using the following command:
**Using `npm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/npm-CB3837.svg?style={badge_style}&logo=npm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ npm test
```

---

## **📞 Contact**
For any questions, suggestions, or feedback, feel free to reach out:
- **Email:** [rajatrathi029@gmail.com](mailto:rajatrathi029@gmail.com)
