# JANVAANI — Voice of the People 🇮🇳
> **“Understand policies. Know your impact. Make your voice count.”**

JanVaani is an AI-powered civic policy and municipal transparency platform that transforms complex, dense government gazettes, zoning bylaws, and city council notifications into plain language for ordinary citizens. It empowers residents to understand neighborhood-level impacts, chat with a grounded zero-hallucination RAG assistant, participate in democratic quadratic voting, analyze public sentiment, and generate formal civic feedback drafts for public consultations.

---

## 🏛️ Key Features

1. **Grounded RAG Assistant ("Ask JanVaani")**
   - Hybrid semantic (TF-IDF + Cosine similarity) and BM25 keyword retrieval.
   - Every answer is grounded in official municipal gazettes with exact page numbers, section headers, and confidence scores.
   - Enforces strict zero-hallucination safety guardrails: *"I couldn't find enough evidence in the available official documents to answer this confidently."*

2. **Dual-View Policy Explainer**
   - **Explain Like I'm a Citizen Mode**: Converts legal terminology into accessible language while strictly preserving statutory meaning.
   - **Original Government Text**: Inspect the authoritative gazette text side-by-side.

3. **Old vs New Policy Comparison (Statutory Diff)**
   - Visualizes added, removed, and modified clauses.
   - Highlights numerical threshold deltas (e.g., Maximum Building Height: $15\text{m} \rightarrow 24\text{m}$, Floor Area Ratio: $2.0 \rightarrow 3.25$, EV Charging: $None \rightarrow 20\%$).

4. **Interactive GIS Civic Map**
   - Leaflet interactive map featuring BBMP municipal ward boundaries (Indiranagar, Koramangala, HSR Layout, Whitefield, Malleshwaram, Jayanagar).
   - Click any ward to view localized policy impacts and zoning allowances.

5. **Personalized "For You" Civic Feed**
   - Dynamically calculates *"3 new policies may affect your area"* based on your selected ward and citizen interest areas (Housing, Transport, Waste, Clean Energy, Taxation).

6. **Quadratic Civic Voting Arena**
   - Non-linear civic credit allocation engine ($Votes = \lfloor\sqrt{credits}\rfloor$ or $Cost = Votes^2$).
   - 100 civic voting credits with real-time budget calculation and aggregated community priority charts.

7. **Aggregated Public Sentiment & Citizen Privacy**
   - Express anonymous stances (👍 Support, 👎 Oppose, 😐 Neutral) with optional community observations.
   - Strict privacy safeguards: Individual votes are never publicly exposed.

8. **Citizen Response Assistant**
   - Converts citizen concerns and lived experiences into formal, structured submissions (Public Consultation Feedback, Objections under Municipal Act, Support Statements, or RTI Inquiries).

9. **Multilingual Architecture**
   - Real-time language switching: **English**, **Hindi (हिंदी)**, and **Kannada (ಕನ್ನಡ)**.
   - Prominent AI translation disclaimers indicating that original government records remain authoritative.

10. **Printable Citizen Impact Reports**
    - One-click printable structured reports covering plain language summaries, what changed, affected stakeholders, deadlines, and glossary of key terms.

11. **Admin Knowledge & Ingestion Hub**
    - Document upload, text extraction, page-preserving semantic chunker, and vector store diagnostics.

---

## 🤖 Multi-Agent AI Architecture

JanVaani uses a coordinated multi-agent workflow:

- **Orchestrator Agent**: Coordinates workflow execution, aggregates evidence chains, and enforces safety guardrails.
- **Document Ingestion Agent**: Parses PDFs and text files, extracts metadata, and segments into page-preserved semantic chunks.
- **Retrieval Agent**: Executes hybrid retrieval, computes confidence scores, and constructs grounded citations.
- **Policy Analysis Agent**: Extracts numerical thresholds, obligations, affected stakeholder groups, and definitions.
- **Geospatial Agent**: Maps policies to GeoJSON ward polygons and transit corridors.
- **Impact Analysis Agent**: Evaluates residential, mobility, environmental, and financial implications.
- **Comparison Agent**: Analyzes differences between policy versions clause by clause.
- **Citizen Explanation Agent**: Translates dense legal phrasing into grade-school accessible prose.
- **Translation Agent**: Delivers multilingual translations (English, Hindi, Kannada) with legal fidelity.
- **Sentiment Agent**: Aggregates anonymous citizen stances safely without deanonymization.
- **Citizen Response Agent**: Formats respectful, factual civic feedback and objection drafts.
- **Report Agent**: Compiles structured citizen impact reports.

---

## 🚀 Quick Start & Setup Instructions

### Prerequisites
- Python 3.10+ (Tested on Python 3.10, 3.11, 3.12, 3.14)
- Node.js 18+ & npm

### 1. Backend Setup & Run

```bash
# From the root directory:
python server.py
```
*The backend server starts on `http://localhost:8000` and automatically pre-seeds the SQLite database and in-memory vector store with official municipal policies.*

### 2. Frontend Setup & Run

```bash
# Navigate to the frontend directory:
cd frontend

# Install dependencies:
npm install

# Run the development server:
npm run dev
```
*The frontend application opens on `http://localhost:5173`.*

---

## 🧪 Running Automated Tests

```bash
# Run unit tests from project root:
python -m unittest backend/tests/test_janvaani.py
```

---

## 📁 Repository Structure

```
JanVaani/
├── backend/
│   ├── agents/               # 12 Multi-Agent AI Modules
│   │   ├── orchestrator.py
│   │   ├── retrieval_agent.py
│   │   ├── policy_agent.py
│   │   ├── geospatial_agent.py
│   │   ├── impact_agent.py
│   │   ├── comparison_agent.py
│   │   ├── explanation_agent.py
│   │   ├── translation_agent.py
│   │   ├── sentiment_agent.py
│   │   ├── response_agent.py
│   │   ├── report_agent.py
│   │   └── ingestion_agent.py
│   ├── database/             # SQLite DB, Models & Seed Data
│   │   ├── db.py
│   │   ├── models.py
│   │   └── seed_data.py
│   ├── document_processing/  # PDF text extraction & semantic chunker
│   │   ├── pdf_processor.py
│   │   └── chunker.py
│   ├── rag/                  # Hybrid Cosine + BM25 Vector Store
│   │   └── vector_store.py
│   ├── routes/               # FastAPI REST Routers
│   ├── tests/                # Automated Unit Tests
│   ├── config.py
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, PolicyCard, CitationPill, Toggle
│   │   ├── context/          # React Global App Context
│   │   ├── i18n/             # Multilingual Translations (EN, HI, KN)
│   │   ├── pages/            # 11 Interactive Civic Pages
│   │   │   ├── HomePage.tsx
│   │   │   ├── PoliciesPage.tsx
│   │   │   ├── PolicyDetailPage.tsx
│   │   │   ├── AskJanVaaniPage.tsx
│   │   │   ├── PolicyComparePage.tsx
│   │   │   ├── CivicMapPage.tsx
│   │   │   ├── PersonalizedForYouPage.tsx
│   │   │   ├── PublicSentimentPage.tsx
│   │   │   ├── QuadraticVotingPage.tsx
│   │   │   ├── CitizenResponsePage.tsx
│   │   │   ├── ImpactReportPage.tsx
│   │   │   ├── AlertsPage.tsx
│   │   │   └── AdminDashboardPage.tsx
│   │   ├── services/         # REST API Client
│   │   └── types/            # TypeScript Interfaces
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server.py                 # Zero-dependency HTTP Server & API Runner
├── .env.example
├── .gitignore
└── README.md
```

---

## 🎯 Hackathon Demonstration Flow (Judge Walkthrough)

1. **Homepage & Personalized Feed**:
   - Open `http://localhost:5173`.
   - Switch location to **Bengaluru → Ward 80 (Indiranagar)**.
   - Notice the dynamic impact alert: *"3 new policies may affect your area"*.
2. **Policy Understanding (Dual View)**:
   - Open **Transit-Oriented Development & Height Regulations (BBMP-2026-ZON-04)**.
   - Toggle between **"Explain Like I'm a Citizen"** and **"Original Government Text"**.
   - Review the what changed summary, benefits, concerns, and glossary of terms (FAR, Setbacks).
3. **Statutory Diff (Old vs New Comparison)**:
   - Click **"Compare Diffs"** to see side-by-side numerical limits: Building height increased from $15\text{m} \rightarrow 24\text{m}$ on $\ge 12\text{m}$ roads with page 3 citations.
4. **Grounded Q&A ("Ask JanVaani")**:
   - Navigate to **Ask JanVaani**.
   - Ask: *"What is the maximum building height permitted along 12 meter roads?"*
   - Observe the grounded answer, $70.3\%$ confidence score, and clickable citation pill opening the exact gazette excerpt.
5. **Interactive GIS Map**:
   - Click **"Map"** to view Bengaluru wards, click on Indiranagar or Koramangala polygon to inspect local impacts.
6. **Quadratic Voting**:
   - Navigate to **"Quadratic Voting"** and spend your 100 civic credits ($Cost = Votes^2$). Allocate credits on bus lanes or zoning rules and observe live mathematical cost calculation.
7. **Citizen Response Assistant**:
   - Generate a formal **Statement of Objection** or **RTI Inquiry** customized to your neighborhood water/traffic concerns.
8. **Multilingual Toggle**:
   - Switch language to **ಕನ್ನಡ (Kannada)** or **हिंदी (Hindi)** in the navbar to experience accessible localized civic summaries.

---

## 📜 Authoritative Source Disclaimer
Official municipal gazettes and city council records remain the legal authority. JanVaani AI provides plain-language translations and grounded citations to facilitate transparent democratic engagement.
