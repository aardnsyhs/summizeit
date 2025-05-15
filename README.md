# 📄 SummizeIt

**SummizeIt** is a modern SaaS application built with Next.js 15 that allows users to upload PDF files and instantly generate summaries using AI technology. Designed for efficiency and scalability, the app integrates top-tier services such as Clerk, UploadThing, Stripe, and AI processing via Gemini and Groq.

---

## 🚀 Key Features

- **Secure Authentication**: Modern login system powered by Clerk.
- **PDF Upload & Summarization**: Seamless file upload with instant AI-powered summaries.
- **AI Integration**: Analyze documents using Gemini and Groq APIs.
- **Subscription-based Payments**: Fully integrated with Stripe for billing.
- **Dashboard & Document History**: Manage and revisit previous summaries.
- **Public Tunneling Support**: Access local development via LocalTunnel.

---

## 🧱 Tech Stack

| Technology            | Description                      |
| --------------------- | -------------------------------- |
| **Next.js 15**        | Modern fullstack React framework |
| **Tailwind CSS**      | Utility-first styling            |
| **PostgreSQL (Neon)** | Serverless database              |
| **Clerk**             | User authentication              |
| **Stripe**            | Payment gateway                  |
| **AI APIs**           | Gemini & Groq                    |
| **TypeScript**        | Primary development language     |
| **UploadThing**       | Upload File                      |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aardnsyhs/summizeit.git
cd summizeit
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Duplicate `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the credentials from services like Clerk, UploadThing, Stripe, etc.:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
UPLOADTHING_TOKEN=
GROQ_API_KEY=
GEMINI_API_KEY=
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 4. Start the Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🌍 Public Tunneling (Optional for Webhooks)

To test webhooks locally (e.g., Stripe):

```bash
lt --port 3000 --subdomain summizeit-dev
```

Use the generated localtunnel URL as your public domain.
