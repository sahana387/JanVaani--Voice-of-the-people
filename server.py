import os
import sys
import json
import sqlite3
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from backend.rag.vector_store import vector_store
from backend.agents.orchestrator import OrchestratorAgent
from backend.agents.geospatial_agent import GeospatialAgent
from backend.agents.comparison_agent import ComparisonAgent
from backend.agents.report_agent import ReportAgent
from backend.agents.response_agent import CitizenResponseAgent
from backend.agents.sentiment_agent import SentimentAgent
from backend.agents.translation_agent import TranslationAgent
from backend.agents.impact_agent import ImpactAnalysisAgent

DB_PATH = BASE_DIR / "backend" / "janvaani.db"
UPLOAD_DIR = BASE_DIR / "backend" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def init_sqlite_db():
    """Initializes SQLite database with all tables and pre-seeds realistic municipal policies."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS policies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE,
        title TEXT,
        department TEXT,
        jurisdiction TEXT,
        status TEXT,
        effective_date TEXT,
        consultation_deadline TEXT,
        category TEXT,
        summary_official TEXT,
        summary_simple TEXT,
        what_changed TEXT,
        who_affected TEXT,
        where_applies TEXT,
        when_takes_effect TEXT,
        key_requirements TEXT,
        positive_impacts TEXT,
        negative_impacts TEXT,
        key_statistics TEXT,
        definitions_json TEXT,
        previous_version_code TEXT,
        is_demo BOOLEAN DEFAULT 1
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS policy_clauses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        policy_id INTEGER,
        section_number TEXT,
        title TEXT,
        official_text TEXT,
        simple_text TEXT,
        page_number INTEGER,
        clause_type TEXT,
        old_value TEXT,
        new_value TEXT,
        practical_impact TEXT,
        source_citation TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        filename TEXT,
        file_path TEXT,
        file_size INTEGER,
        mime_type TEXT,
        department TEXT,
        date_published TEXT,
        status TEXT,
        chunk_count INTEGER,
        is_demo BOOLEAN DEFAULT 1,
        created_at TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS document_chunks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER,
        policy_id INTEGER,
        chunk_index INTEGER,
        page_number INTEGER,
        section_title TEXT,
        content TEXT,
        token_count INTEGER,
        metadata_json TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quadratic_topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        policy_id INTEGER,
        title TEXT,
        description TEXT,
        category TEXT,
        total_credits_spent INTEGER DEFAULT 0,
        total_votes_cast INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quadratic_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        topic_id INTEGER,
        session_token TEXT,
        credits_spent INTEGER,
        votes_awarded INTEGER,
        timestamp TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sentiment_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        policy_id INTEGER,
        session_token TEXT,
        stance TEXT,
        comment TEXT,
        ward_number INTEGER,
        timestamp TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        message TEXT,
        alert_type TEXT,
        policy_id INTEGER,
        category TEXT,
        event_date TEXT,
        created_at TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS citizen_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        policy_id INTEGER,
        session_token TEXT,
        response_type TEXT,
        citizen_position TEXT,
        concerns TEXT,
        user_ward TEXT,
        generated_draft TEXT,
        created_at TEXT
    );
    """)

    # Check if seeded
    cursor.execute("SELECT COUNT(*) FROM policies")
    if cursor.fetchone()[0] == 0:
        print("[JanVaani Server] Pre-seeding database with official municipal policies & evidence chunks...")
        
        # Policy 1
        cursor.execute("""
        INSERT INTO policies (
            code, title, department, jurisdiction, status, effective_date, consultation_deadline,
            category, summary_official, summary_simple, what_changed, who_affected, where_applies,
            when_takes_effect, key_requirements, positive_impacts, negative_impacts, key_statistics,
            definitions_json, previous_version_code, is_demo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            "BBMP-2026-ZON-04",
            "Transit-Oriented Development & Revised Height and FAR Regulations (2026)",
            "Urban Development & Town Planning Directorate, BBMP",
            "Bengaluru Bruhat Mahanagara Palike (BBMP)",
            "Public Consultation",
            "2026-04-01",
            "2026-09-30",
            "Zoning & Planning",
            "Gazette Notification under Section 13(E) of Karnataka Town and Country Planning Act, amending building height thresholds, permissible Floor Area Ratio (FAR), and front setback dimensions along notified mass rapid transit corridors.",
            "The city council is updating building rules. On roads wider than 12 meters, buildings can now be built up to 24 meters high (about 7-8 floors) instead of the previous 15 meters limit. Builders must set aside 20% of parking spaces for electric vehicle charging and install rainwater harvesting pits.",
            "Maximum permissible building height raised from 15 m to 24 m along roads >= 12 m width. Floor Area Ratio (FAR) increased from 2.0 to 3.25. Setbacks adjusted from 3.0 m to 2.2 m for residential plots. Mandatory EV charging infrastructure for all multi-unit buildings.",
            "Residential property owners, builders, small business owners, tenants in Indiranagar, Koramangala, Whitefield, and HSR Layout.",
            "All BBMP Zones within 500 meters of Metro lines and roads wider than 12 meters.",
            "Public consultations open until September 30, 2026. Final enforcement commences October 15, 2026.",
            "Plots must provide percolation pits, 2.2 m front setback, and 20% EV ready parking bays.",
            "More residential housing units close to transit lines, reduced suburban commute times, increased property valuation.",
            "Higher neighborhood population density, potential water pressure drops if borewells are overused, local traffic during construction.",
            "Max Height: 24m | Base FAR: 3.25 | Min Road Width: 12m | EV Slots: 20%",
            json.dumps({
                "Floor Area Ratio (FAR)": "The ratio of a building's total floor area to the size of the plot of land.",
                "Setback": "The minimum mandatory open distance between a building wall and the road or neighbor boundary.",
                "Transit-Oriented Zone": "Urban land within 500 meters of metro stations or transit corridors designed for high density."
            }),
            "BBMP-2020-ZON-01",
            1
        ))
        p1_id = cursor.lastrowid

        # Policy 1 Clauses
        clauses_p1 = [
            (p1_id, "4.1", "Maximum Permissible Building Height",
             "In all Residential R-2 and Commercial C-2 zones abutting roads with a minimum carriage width of 12.0 meters, the maximum vertical height of building structures shall not exceed 24.0 meters from average surrounding ground level.",
             "Buildings on roads at least 12 meters wide can now go up to 24 meters high (about 7 to 8 floors).",
             3, "modified", "15.0 meters", "24.0 meters", "Enables taller multi-family residential apartments and mixed-use commercial stores.",
             "BBMP Master Plan Gazette 2026, Section 4.1, Page 3"),
            (p1_id, "4.3", "Standard Floor Area Ratio (FAR)",
             "The base Floor Area Ratio for properties situated within 500 meters of operational Namma Metro stations is hereby enhanced to 3.25, subject to statutory fire safety clearance.",
             "You can construct 3.25 times the land area in total floor space near metro stations.",
             4, "modified", "2.00 FAR", "3.25 FAR", "Allows more usable built-up area on smaller urban plots.",
             "BBMP Master Plan Gazette 2026, Section 4.3, Page 4"),
            (p1_id, "7.2", "Mandatory Electric Vehicle Charging Provision",
             "Every newly sanctioned multi-family residential complex exceeding 8 dwelling units shall reserve not less than twenty percent (20%) of designated off-street parking slots with dedicated 3.3 kW / 7.4 kW EV charging infrastructure.",
             "New apartment buildings with 8 or more homes must have electric vehicle chargers in 20% of parking slots.",
             7, "added", "None", "20% of parking slots", "Supports EV transition for residents and reduces tailpipe emissions.",
             "BBMP Master Plan Gazette 2026, Section 7.2, Page 7")
        ]
        cursor.executemany("""
        INSERT INTO policy_clauses (policy_id, section_number, title, official_text, simple_text, page_number, clause_type, old_value, new_value, practical_impact, source_citation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, clauses_p1)

        # Policy 2: SWM
        cursor.execute("""
        INSERT INTO policies (
            code, title, department, jurisdiction, status, effective_date, consultation_deadline,
            category, summary_official, summary_simple, what_changed, who_affected, where_applies,
            when_takes_effect, key_requirements, positive_impacts, negative_impacts, key_statistics,
            definitions_json, previous_version_code, is_demo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            "BBMP-2026-SWM-11",
            "Solid Waste Management & 3-Way Source Segregation Mandate (2026)",
            "Solid Waste Management Special Taskforce, BBMP",
            "Bengaluru Bruhat Mahanagara Palike (BBMP)",
            "Active",
            "2026-02-15",
            "2026-08-31",
            "Environment & Waste",
            "Statutory by-laws mandating three-stream waste segregation at generator level across all domestic, institutional, and commercial premises with escalated penalties for mixed waste handover.",
            "All residents and businesses in Bengaluru must separate their trash into three bins: Wet waste (green bin), Dry waste (blue bin), and Sanitary/Hazardous waste (red pouch/bin). Garbage collectors will reject unsegregated waste, and repeat violations will attract fines up to ₹1,000 for homes.",
            "Mandatory 3-way segregation. Spot fines for non-segregated waste increased from ₹200 to ₹1,000 for residential units, and ₹25,000 for bulk generators (>100 kg/day). Mandatory GPS-tagged daily collection.",
            "All households, apartment resident associations, commercial markets, restaurants, tech parks.",
            "All 198 BBMP wards across Bengaluru.",
            "Enacted and strictly active across all wards.",
            "Daily handover of green wet waste, bi-weekly dry waste, immediate red sanitary pouch handover.",
            "Reduces open landfill dumping by 65%, eliminates street garbage blackspots, improves neighborhood hygiene.",
            "Requires strict household discipline and purchase of separate bins; fine enforcement on non-compliant households.",
            "Fines: ₹1,000 (Residential) / ₹25,000 (Bulk) | Target Landfill Diversion: 80%",
            json.dumps({
                "Bulk Waste Generator": "Premises generating more than 100 kg of waste per day (e.g. tech parks, large apartments, hotels).",
                "Source Segregation": "Separating trash into distinct categories at the point of origin before collection."
            }),
            None,
            1
        ))
        p2_id = cursor.lastrowid

        # Policy 3: Mobility
        cursor.execute("""
        INSERT INTO policies (
            code, title, department, jurisdiction, status, effective_date, consultation_deadline,
            category, summary_official, summary_simple, what_changed, who_affected, where_applies,
            when_takes_effect, key_requirements, positive_impacts, negative_impacts, key_statistics,
            definitions_json, previous_version_code, is_demo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            "BBMP-2026-MOB-07",
            "Outer Ring Road Bus Priority Corridor & Feeder Mobility Plan",
            "Directorate of Urban Land Transport (DULT) & Traffic Police",
            "Bengaluru",
            "Public Consultation",
            "2026-05-01",
            "2026-10-15",
            "Transport & Mobility",
            "Public consultation notification for establishing 22 km of dedicated red-top Bus Priority Lanes (BPL) along Outer Ring Road (Silk Board to KR Puram) with integrated feeder micro-mobility bays.",
            "A dedicated bus-only lane is being created on the Outer Ring Road between Silk Board and KR Puram to allow BMTC buses to move without getting stuck in traffic. Private cars driving in the bus lane will be fined. Free last-mile electric feeder shuttles will connect metro stations to nearby tech parks.",
            "Dedicated bus lane operational 7 AM to 10 PM. Non-bus vehicles entering lane face ₹1,000 fine via automated ANPR cameras. 14 new e-auto stands at metro stations.",
            "Commuters on Outer Ring Road, IT professionals, bus passengers, taxi/auto drivers.",
            "Outer Ring Road (Silk Board - Bellandur - Marathahalli - KR Puram corridor).",
            "Consultations open until October 15, 2026.",
            "No private vehicle entry in extreme left bus corridor during peak hours.",
            "Bus commute time reduced by 40%, reliable feeder shuttles to metro stations.",
            "Remaining 2 general traffic lanes may experience initial peak-hour slow downs for private vehicles.",
            "Corridor Length: 22 km | Travel Time Savings: ~25 mins | Fine: ₹1,000",
            json.dumps({
                "Bus Priority Lane (BPL)": "A road lane reserved exclusively for public transport buses during specified hours.",
                "ANPR Camera": "Automatic Number Plate Recognition camera for automated traffic violation detection."
            }),
            None,
            1
        ))
        p3_id = cursor.lastrowid

        # Policy 4: Solar
        cursor.execute("""
        INSERT INTO policies (
            code, title, department, jurisdiction, status, effective_date, consultation_deadline,
            category, summary_official, summary_simple, what_changed, who_affected, where_applies,
            when_takes_effect, key_requirements, positive_impacts, negative_impacts, key_statistics,
            definitions_json, previous_version_code, is_demo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (
            "BBMP-2026-SOLAR-02",
            "Mandatory Rooftop Solar PV & Clean Energy Property Tax Rebate Scheme",
            "Renewable Energy Directorate & BESCOM",
            "Bengaluru",
            "Active",
            "2026-01-01",
            "2026-11-30",
            "Environment & Energy",
            "Municipal mandate for rooftop solar photovoltaic installation on properties exceeding 2,000 sq.ft built-up area, with a 5% annual property tax rebate incentive for early adopters.",
            "If your building is larger than 2,000 square feet, you must install at least 1.5 kW of rooftop solar panels. If you install before December 2026, the city will give you a 5% discount on your property tax for the next 3 years.",
            "Mandatory 1.5 kWp solar for >2,000 sq.ft buildings. 5% property tax rebate for 3 years. Net-metering application fast-tracked to 7 days.",
            "Individual house owners, RWAs, villa communities, commercial rooftops.",
            "All BBMP municipal zones.",
            "Active now; tax rebate valid for installations completed before Dec 2026.",
            "Grid-tied solar inverter with BESCOM bi-directional meter.",
            "Lower household electricity bills, cleaner neighborhood power, property tax savings.",
            "Initial upfront investment of ₹70,000 - ₹1,20,000 before government subsidy credit.",
            "Min Capacity: 1.5 kWp | Tax Rebate: 5% for 3 Years | Net Metering: 7-Day Approval",
            json.dumps({
                "Net Metering": "A billing mechanism that credits solar energy system owners for the electricity they add to the grid.",
                "kWp (Kilowatt Peak)": "The maximum electrical power output of a solar panel system under standard test conditions."
            }),
            None,
            1
        ))
        p4_id = cursor.lastrowid

        # Seed Quadratic Topics
        topics = [
            (p1_id, "Permit 24m Building Height on Indiranagar & Koramangala 12m Roads", "Allocate your voting credits on whether BBMP should allow 24-meter tall multi-family residential apartments on 12-meter wide neighborhood roads.", "Zoning & Density", 850, 220),
            (p3_id, "Dedicated Bus Priority Lane on Outer Ring Road (Silk Board to KR Puram)", "Vote on reserving the left lane exclusively for BMTC electric buses and fining private cars during peak hours.", "Mobility & Public Transit", 1420, 340),
            (p2_id, "₹1,000 Spot Fine for Unsegregated Household Garbage", "Vote on enforcing mandatory 3-way segregation with ₹1,000 spot penalties on non-compliant households.", "Civic Sanitation", 620, 180),
            (p4_id, "5% Property Tax Rebate for Mandatory Rooftop Solar PV", "Vote on offering tax rebates funded through municipal green bonds for households adopting solar before Dec 2026.", "Green Energy", 1150, 290)
        ]
        cursor.executemany("""
        INSERT INTO quadratic_topics (policy_id, title, description, category, total_credits_spent, total_votes_cast)
        VALUES (?, ?, ?, ?, ?, ?)
        """, topics)

        # Seed Sentiment
        sentiments = [
            (p1_id, "seed_user_1", "support", "We need more housing near metro stations so young workers can live without extreme commutes.", 80, "2026-09-10 10:30"),
            (p1_id, "seed_user_2", "oppose", "Our neighborhood water pipelines and borewells cannot handle 8-floor apartments without better sewage upgrades.", 80, "2026-09-11 14:15"),
            (p1_id, "seed_user_3", "neutral", "Good initiative, but traffic on 12m roads will become severe unless parking is strictly enforced inside buildings.", 151, "2026-09-12 09:20"),
            (p3_id, "seed_user_4", "support", "The bus lane is crucial. Commute times along ORR will drop drastically for thousands of bus passengers.", 174, "2026-09-12 16:45"),
            (p2_id, "seed_user_5", "support", "Cleanliness is mandatory. 3-way segregation is the only way to close open dump yards.", 80, "2026-09-13 08:00")
        ]
        cursor.executemany("""
        INSERT INTO sentiment_votes (policy_id, session_token, stance, comment, ward_number, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
        """, sentiments)

        # Seed Alerts
        alerts = [
            ("Public Consultation Deadline Approaching", "Final 15 days to submit objections for Revised Zoning Master Plan (BBMP-2026-ZON-04).", "deadline", p1_id, "Zoning & Planning", "2026-09-30", "2026-09-13"),
            ("Ward Committee Deliberation: Bus Priority Corridor", "Indiranagar & HSR Ward Committees will convene on Saturday 10 AM to discuss ORR Bus Priority impact.", "council_meeting", p3_id, "Transport & Mobility", "2026-09-20", "2026-09-13"),
            ("New Active Policy: 3-Way Waste Segregation", "Ward marshals will start issuing notices for unsegregated wet/dry waste starting next Monday.", "new_policy", p2_id, "Environment & Waste", "2026-09-15", "2026-09-13")
        ]
        cursor.executemany("""
        INSERT INTO alerts (title, message, alert_type, policy_id, category, event_date, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, alerts)

        # Seed Documents & Chunks for RAG Vector Store
        cursor.execute("""
        INSERT INTO documents (title, filename, file_path, file_size, mime_type, department, date_published, status, chunk_count, is_demo, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, ("BBMP Revised Master Plan 2031 Gazette", "BBMP_Zoning_2026.pdf", "uploads/BBMP_Zoning_2026.pdf", 245000, "application/pdf", "Urban Development & Town Planning Directorate, BBMP", "2026-03-10", "indexed", 3, 1, "2026-09-13"))
        doc1_id = cursor.lastrowid

        chunks = [
            (doc1_id, p1_id, 1, 3, "Section 4.1 - Maximum Height and Densities",
             "Section 4.1: Maximum Permissible Building Height. In all Residential R-2 and Commercial C-2 zones abutting roads with a minimum carriage width of 12.0 meters, the maximum vertical height of building structures shall not exceed 24.0 meters from average surrounding ground level. Previous limit of 15.0 meters is superseded. Fire safety NOC required for structures over 15 meters.",
             55, json.dumps({"document_title": "BBMP Revised Master Plan 2031 Gazette", "department": "Urban Development Directorate"})),
            (doc1_id, p1_id, 2, 4, "Section 4.3 - Transit-Oriented FAR Allowance",
             "Section 4.3: Base Floor Area Ratio (FAR). Properties situated within 500 meters of operational Namma Metro transit stations receive an enhanced base FAR of 3.25. Premium FAR up to 4.0 may be purchased subject to municipal betterment levy remittance to BBMP Infrastructure Fund.",
             48, json.dumps({"document_title": "BBMP Revised Master Plan 2031 Gazette", "department": "Urban Development Directorate"})),
            (doc1_id, p1_id, 3, 7, "Section 7.2 - EV Charging & Green Infrastructure",
             "Section 7.2: EV Charging & Renewable Amenities. Multi-family residential complexes exceeding 8 units must equip 20% of parking slots with EV charging points. All residential plots exceeding 200 sq.meters must construct percolation pits for rainwater harvesting with 2,000 litre capacity.",
             46, json.dumps({"document_title": "BBMP Revised Master Plan 2031 Gazette", "department": "Urban Development Directorate"}))
        ]
        cursor.executemany("""
        INSERT INTO document_chunks (document_id, policy_id, chunk_index, page_number, section_title, content, token_count, metadata_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, chunks)

        conn.commit()

    # Index chunks in memory vector store
    cursor.execute("SELECT chunk_index, page_number, section_title, content, policy_id, metadata_json FROM document_chunks")
    db_chunks = cursor.fetchall()
    formatted_chunks = []
    for row in db_chunks:
        meta = json.loads(row[5]) if row[5] else {}
        formatted_chunks.append({
            "chunk_index": row[0],
            "page_number": row[1],
            "section_title": row[2],
            "content": row[3],
            "policy_id": row[4],
            "metadata": meta,
            "source_citation": f"{meta.get('document_title', 'Gazette')}, Page {row[1]} ({row[2]})"
        })
    vector_store.clear()
    vector_store.add_chunks(formatted_chunks)
    print(f"[JanVaani Server] Vector store loaded with {len(formatted_chunks)} grounded evidence chunks.")

    conn.close()


class JanVaaniHTTPHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status_code=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        try:
            if path == "/" or path == "/health":
                self._send_json({"status": "healthy", "service": "JanVaani Core Server", "version": "1.0.0"})
                return

            if path == "/api/policies":
                category = query.get("category", [None])[0]
                status = query.get("status", [None])[0]
                search = query.get("search", [None])[0]
                ward_no = query.get("ward_number", [None])[0]
                lang = query.get("lang", ["en"])[0]

                sql = "SELECT * FROM policies WHERE 1=1"
                params = []
                if category and category != "All":
                    sql += " AND category LIKE ?"
                    params.append(f"%{category}%")
                if status and status != "All":
                    sql += " AND status = ?"
                    params.append(status)
                if search:
                    sql += " AND (title LIKE ? OR code LIKE ? OR summary_simple LIKE ? OR department LIKE ?)"
                    params.extend([f"%{search}%"] * 4)

                sql += " ORDER BY id DESC"
                cursor.execute(sql, params)
                rows = cursor.fetchall()
                policies = []
                for r in rows:
                    p_dict = dict(r)
                    if p_dict.get("definitions_json"):
                        try:
                            p_dict["definitions"] = json.loads(p_dict["definitions_json"])
                        except Exception:
                            p_dict["definitions"] = {}
                    if lang in ["hi", "kn"]:
                        p_dict = TranslationAgent.translate_policy_summary(p_dict, lang)
                    policies.append(p_dict)
                self._send_json({"count": len(policies), "policies": policies})
                return

            if path.startswith("/api/policies/"):
                parts = path.split("/")
                pol_id = int(parts[3])
                sub_action = parts[4] if len(parts) > 4 else None
                lang = query.get("lang", ["en"])[0]

                cursor.execute("SELECT * FROM policies WHERE id = ?", (pol_id,))
                pol_row = cursor.fetchone()
                if not pol_row:
                    self._send_json({"error": "Policy not found"}, 404)
                    return

                p_dict = dict(pol_row)
                if p_dict.get("definitions_json"):
                    try:
                        p_dict["definitions"] = json.loads(p_dict["definitions_json"])
                    except Exception:
                        p_dict["definitions"] = {}

                if sub_action == "report":
                    cursor.execute("SELECT * FROM policy_clauses WHERE policy_id = ?", (pol_id,))
                    clauses = [dict(c) for c in cursor.fetchall()]
                    report = ReportAgent.generate_impact_report(p_dict, clauses)
                    self._send_json(report)
                    return

                elif sub_action == "compare":
                    cursor.execute("SELECT * FROM policy_clauses WHERE policy_id = ?", (pol_id,))
                    clauses = [dict(c) for c in cursor.fetchall()]
                    old_policy_dict = {"title": f"Previous Master Plan ({p_dict.get('previous_version_code') or 'Pre-2026'})", "code": p_dict.get("previous_version_code") or "BBMP-2020-OLD"}
                    new_policy_dict = {"title": p_dict.get("title"), "code": p_dict.get("code")}
                    diff = ComparisonAgent.compare_policies(old_policy_dict, new_policy_dict, clauses)
                    self._send_json(diff)
                    return

                elif sub_action == "local-impact":
                    ward_name = query.get("ward_name", ["Indiranagar"])[0]
                    impact = ImpactAnalysisAgent.analyze_local_impact(p_dict, ward_name)
                    self._send_json(impact)
                    return

                else:
                    cursor.execute("SELECT * FROM policy_clauses WHERE policy_id = ?", (pol_id,))
                    clauses = []
                    for c in cursor.fetchall():
                        c_dict = dict(c)
                        if lang in ["hi", "kn"]:
                            c_dict["simple_text"] = TranslationAgent.translate_text(c_dict["simple_text"], lang)["translated_text"]
                        clauses.append(c_dict)
                    p_dict["clauses"] = clauses
                    if lang in ["hi", "kn"]:
                        p_dict = TranslationAgent.translate_policy_summary(p_dict, lang)
                    self._send_json(p_dict)
                    return

            if path == "/api/gis/geojson":
                geojson = GeospatialAgent.get_geojson_feature_collection()
                self._send_json(geojson)
                return

            if path == "/api/gis/wards":
                wards_list = []
                for w in GeospatialAgent.BENGALURU_WARDS:
                    wards_list.append({
                        "ward_number": w["ward_number"],
                        "name": w["name"],
                        "zone": w["zone"],
                        "city": w["city"],
                        "pin_codes": w["pin_codes"],
                        "population": w["population"],
                        "area_sq_km": w["area_sq_km"],
                        "center": w["center"]
                    })
                self._send_json({"wards": wards_list})
                return

            if path.startswith("/api/gis/wards/") and path.endswith("/policies"):
                ward_num = int(path.split("/")[4])
                cursor.execute("SELECT * FROM policies")
                policies = [dict(r) for r in cursor.fetchall()]
                ward_info = next((w for w in GeospatialAgent.BENGALURU_WARDS if w["ward_number"] == ward_num), None)
                self._send_json({
                    "ward": ward_info,
                    "affected_policies_count": len(policies),
                    "policies": policies
                })
                return

            if path.startswith("/api/sentiment/"):
                pol_id = int(path.split("/")[3])
                cursor.execute("SELECT * FROM policies WHERE id = ?", (pol_id,))
                pol = cursor.fetchone()
                cursor.execute("SELECT * FROM sentiment_votes WHERE policy_id = ?", (pol_id,))
                votes = [dict(v) for v in cursor.fetchall()]
                agg = SentimentAgent.aggregate_sentiment(votes, pol["title"] if pol else "Policy")
                self._send_json(agg)
                return

            if path == "/api/quadratic-voting/topics":
                session_token = query.get("session_token", ["guest"])[0]
                cursor.execute("SELECT * FROM quadratic_topics WHERE is_active = 1")
                topics = [dict(t) for t in cursor.fetchall()]

                cursor.execute("SELECT * FROM quadratic_votes WHERE session_token = ?", (session_token,))
                user_votes = {v["topic_id"]: v for v in [dict(r) for r in cursor.fetchall()]}

                total_spent = sum(v["credits_spent"] for v in user_votes.values())
                for t in topics:
                    uv = user_votes.get(t["id"], {"credits_spent": 0, "votes_awarded": 0})
                    t["user_credits_spent"] = uv["credits_spent"]
                    t["user_votes_awarded"] = uv["votes_awarded"]

                self._send_json({
                    "max_credits": 100,
                    "credits_used": total_spent,
                    "credits_remaining": max(0, 100 - total_spent),
                    "formula": "votes = floor(sqrt(credits_spent)) | cost = votes^2",
                    "topics": topics
                })
                return

            if path == "/api/alerts":
                cursor.execute("SELECT * FROM alerts ORDER BY id DESC")
                alerts = [dict(a) for a in cursor.fetchall()]
                self._send_json({"count": len(alerts), "alerts": alerts})
                return

            if path == "/api/admin/stats":
                cursor.execute("SELECT COUNT(*) FROM documents")
                doc_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM policies")
                pol_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM document_chunks")
                chunk_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM quadratic_votes")
                qv_count = cursor.fetchone()[0]
                cursor.execute("SELECT COUNT(*) FROM sentiment_votes")
                sent_count = cursor.fetchone()[0]

                self._send_json({
                    "total_documents": doc_count,
                    "total_policies": pol_count,
                    "total_chunks": chunk_count,
                    "total_quadratic_votes": qv_count,
                    "total_sentiment_votes": sent_count,
                    "vector_store_indexed_chunks": len(vector_store.chunks),
                    "system_status": "Operational - High Grounding Integrity"
                })
                return

            if path == "/api/admin/documents":
                cursor.execute("SELECT * FROM documents ORDER BY id DESC")
                docs = [dict(d) for d in cursor.fetchall()]
                self._send_json({"documents": docs})
                return

            if path.startswith("/api/admin/documents/") and path.endswith("/chunks"):
                doc_id = int(path.split("/")[4])
                cursor.execute("SELECT * FROM document_chunks WHERE document_id = ?", (doc_id,))
                chunks = [dict(c) for c in cursor.fetchall()]
                self._send_json({"document_id": doc_id, "count": len(chunks), "chunks": chunks})
                return

            self._send_json({"error": "Not Found"}, 404)

        finally:
            conn.close()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        content_length = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_length)

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        try:
            if path == "/api/chat":
                payload = json.loads(body_bytes.decode("utf-8"))
                question = payload.get("question", "")
                policy_id = payload.get("policy_id")
                language = payload.get("language", "en")
                res = OrchestratorAgent.answer_question(question=question, policy_id=policy_id, language=language)
                self._send_json(res)
                return

            if path == "/api/sentiment":
                payload = json.loads(body_bytes.decode("utf-8"))
                pol_id = payload.get("policy_id")
                stance = payload.get("stance", "neutral").lower()
                comment = payload.get("comment", "")
                ward_num = payload.get("ward_number")
                session_token = payload.get("session_token", "default")

                cursor.execute("DELETE FROM sentiment_votes WHERE policy_id = ? AND session_token = ?", (pol_id, session_token))
                cursor.execute("""
                INSERT INTO sentiment_votes (policy_id, session_token, stance, comment, ward_number, timestamp)
                VALUES (?, ?, ?, ?, ?, datetime('now'))
                """, (pol_id, session_token, stance, comment, ward_num))
                conn.commit()
                self._send_json({"status": "success", "message": "Your anonymous civic stance was securely recorded."})
                return

            if path == "/api/quadratic-voting/cast":
                payload = json.loads(body_bytes.decode("utf-8"))
                session_token = payload.get("session_token", "default")
                allocations = payload.get("allocations", [])

                total_credits = sum(a.get("credits_allocated", 0) for a in allocations if a.get("credits_allocated", 0) > 0)
                if total_credits > 100:
                    self._send_json({"error": "Total allocated credits exceed 100"}, 400)
                    return

                cursor.execute("DELETE FROM quadratic_votes WHERE session_token = ?", (session_token,))
                for alloc in allocations:
                    credits = alloc.get("credits_allocated", 0)
                    if credits > 0:
                        votes = int(math.floor(math.sqrt(credits)))
                        cursor.execute("""
                        INSERT INTO quadratic_votes (topic_id, session_token, credits_spent, votes_awarded, timestamp)
                        VALUES (?, ?, ?, ?, datetime('now'))
                        """, (alloc["topic_id"], session_token, credits, votes))
                        cursor.execute("""
                        UPDATE quadratic_topics SET total_credits_spent = total_credits_spent + ?, total_votes_cast = total_votes_cast + ? WHERE id = ?
                        """, (credits, votes, alloc["topic_id"]))

                conn.commit()
                self._send_json({"status": "success", "message": "Quadratic votes successfully cast."})
                return

            if path == "/api/citizen-response/generate":
                payload = json.loads(body_bytes.decode("utf-8"))
                pol_id = payload.get("policy_id")
                cursor.execute("SELECT * FROM policies WHERE id = ?", (pol_id,))
                pol = cursor.fetchone()
                if not pol:
                    self._send_json({"error": "Policy not found"}, 404)
                    return

                draft = CitizenResponseAgent.generate_draft(
                    policy_title=pol["title"],
                    policy_code=pol["code"],
                    department=pol["department"],
                    response_type=payload.get("response_type", "feedback"),
                    citizen_position=payload.get("citizen_position", "Support"),
                    concerns=payload.get("concerns", ""),
                    user_ward=payload.get("user_ward", "Bengaluru Resident"),
                    specific_points=payload.get("specific_points", "")
                )
                self._send_json(draft)
                return

            if path == "/api/admin/upload":
                # Basic mock file upload receiver for testing
                self._send_json({"status": "success", "message": "Document uploaded and indexed into vector store.", "chunks_indexed": 4})
                return

            self._send_json({"error": "Not Found"}, 404)

        finally:
            conn.close()

def run_server(port=8000):
    init_sqlite_db()
    server_address = ("", port)
    httpd = HTTPServer(server_address, JanVaaniHTTPHandler)
    print(f"\n=======================================================")
    print(f"  JANVAANI — Voice of the People Backend API Server")
    print(f"  Running on: http://localhost:{port}")
    print(f"  API Docs & Endpoints: http://localhost:{port}/api/policies")
    print(f"=======================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down JanVaani Server...")
        httpd.server_close()

if __name__ == "__main__":
    import math
    run_server(8000)
