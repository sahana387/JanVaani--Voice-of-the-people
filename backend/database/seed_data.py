import json
from datetime import datetime
from backend.database.db import SessionLocal, engine, Base
from backend.database.models import (
    Document, DocumentChunk, Policy, PolicyClause, Ward,
    PolicyWardMapping, QuadraticTopic, QuadraticVote, SentimentVote,
    AlertNotification
)
from backend.agents.geospatial_agent import GeospatialAgent
from backend.rag.vector_store import vector_store

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(Policy).count() > 0:
        print("[JanVaani DB] Database already contains policies. Skipping initial seed.")
        _load_vector_store_from_db(db)
        db.close()
        return

    print("[JanVaani DB] Seeding initial municipal policies, documents, and GIS wards...")

    # 1. Seed Wards
    wards_map = {}
    for ward_data in GeospatialAgent.BENGALURU_WARDS:
        ward = Ward(
            ward_number=ward_data["ward_number"],
            name=ward_data["name"],
            zone=ward_data["zone"],
            city=ward_data["city"],
            pin_codes=ward_data["pin_codes"],
            population=ward_data["population"],
            area_sq_km=ward_data["area_sq_km"],
            center_lat=ward_data["center"][0],
            center_lng=ward_data["center"][1],
            geojson_polygon=json.dumps(ward_data["polygon"])
        )
        db.add(ward)
        db.flush()
        wards_map[ward.ward_number] = ward.id

    # 2. Seed Policy 1: Zoning & Transit-Oriented Density
    doc1 = Document(
        title="BBMP Revised Master Plan 2031 - Zoning Regulations & FAR Revision Gazette",
        filename="BBMP_Zoning_MasterPlan_2031_Gazette.pdf",
        file_path="uploads/BBMP_Zoning_MasterPlan_2031_Gazette.pdf",
        file_size=245000,
        department="Urban Development & Town Planning Directorate, BBMP",
        date_published="2026-03-10",
        source_url="https://bbmp.karnataka.gov.in/gazette/zoning-2026",
        status="indexed",
        chunk_count=6,
        is_demo=True
    )
    db.add(doc1)
    db.flush()

    pol1 = Policy(
        code="BBMP-2026-ZON-04",
        title="Transit-Oriented Development & Revised Height and FAR Regulations (2026)",
        department="Urban Development & Town Planning Directorate, BBMP",
        jurisdiction="Bengaluru Bruhat Mahanagara Palike (BBMP)",
        status="Public Consultation",
        effective_date="2026-04-01",
        consultation_deadline="2026-09-30",
        category="Zoning & Planning",
        summary_official="Gazette Notification under Section 13(E) of Karnataka Town and Country Planning Act, amending building height thresholds, permissible Floor Area Ratio (FAR), and front setback dimensions along notified mass rapid transit corridors.",
        summary_simple="The city council is updating building rules. On roads wider than 12 meters, buildings can now be built up to 24 meters high (about 7-8 floors) instead of the previous 15 meters limit. Builders must set aside 20% of parking spaces for electric vehicle charging and install rainwater harvesting pits.",
        what_changed="Maximum permissible building height raised from 15 m to 24 m along roads $\\ge 12$ m width. Floor Area Ratio (FAR) increased from 2.0 to 3.25. Setbacks adjusted from 3.0 m to 2.2 m for residential plots. Mandatory EV charging infrastructure for all multi-unit buildings.",
        who_affected="Residential property owners, builders, small business owners, tenants in Indiranagar, Koramangala, Whitefield, and HSR Layout.",
        where_applies="All BBMP Zones within 500 meters of Metro lines and roads wider than 12 meters.",
        when_takes_effect="Public consultations open until September 30, 2026. Final enforcement commences October 15, 2026.",
        key_requirements="Plots must provide percolation pits, 2.2 m front setback, and 20% EV ready parking bays.",
        positive_impacts="More residential housing units close to transit lines, reduced suburban commute times, increased property valuation.",
        negative_impacts="Higher neighborhood population density, potential water pressure drops if borewells are overused, local traffic during construction.",
        key_statistics="Max Height: 24m | Base FAR: 3.25 | Min Road Width: 12m | EV Slots: 20%",
        definitions_json=json.dumps({
            "Floor Area Ratio (FAR)": "The ratio of a building's total floor area to the size of the plot of land.",
            "Setback": "The minimum mandatory open distance between a building wall and the road or neighbor boundary.",
            "Transit-Oriented Zone": "Urban land within 500 meters of metro stations or transit corridors designed for high density."
        }),
        previous_version_code="BBMP-2020-ZON-01",
        source_document_id=doc1.id,
        is_demo=True
    )
    db.add(pol1)
    db.flush()

    # Add Clauses for Policy 1
    clauses1 = [
        PolicyClause(
            policy_id=pol1.id,
            section_number="4.1",
            title="Maximum Permissible Building Height",
            official_text="In all Residential R-2 and Commercial C-2 zones abutting roads with a minimum carriage width of 12.0 meters, the maximum vertical height of building structures shall not exceed 24.0 meters from average surrounding ground level.",
            simple_text="Buildings on roads at least 12 meters wide can now go up to 24 meters high (about 7 to 8 floors).",
            page_number=3,
            clause_type="modified",
            old_value="15.0 meters",
            new_value="24.0 meters",
            practical_impact="Enables taller multi-family residential apartments and mixed-use commercial stores.",
            source_citation="BBMP Master Plan Gazette 2026, Section 4.1, Page 3"
        ),
        PolicyClause(
            policy_id=pol1.id,
            section_number="4.3",
            title="Standard Floor Area Ratio (FAR)",
            official_text="The base Floor Area Ratio for properties situated within 500 meters of operational Namma Metro stations is hereby enhanced to 3.25, subject to statutory fire safety clearance.",
            simple_text="You can construct 3.25 times the land area in total floor space near metro stations.",
            page_number=4,
            clause_type="modified",
            old_value="2.00 FAR",
            new_value="3.25 FAR",
            practical_impact="Allows more usable built-up area on smaller urban plots.",
            source_citation="BBMP Master Plan Gazette 2026, Section 4.3, Page 4"
        ),
        PolicyClause(
            policy_id=pol1.id,
            section_number="7.2",
            title="Mandatory Electric Vehicle Charging Provision",
            official_text="Every newly sanctioned multi-family residential complex exceeding 8 dwelling units shall reserve not less than twenty percent (20%) of designated off-street parking slots with dedicated 3.3 kW / 7.4 kW EV charging infrastructure.",
            simple_text="New apartment buildings with 8 or more homes must have electric vehicle chargers in 20% of parking slots.",
            page_number=7,
            clause_type="added",
            old_value="None",
            new_value="20% of parking slots",
            practical_impact="Supports EV transition for residents and reduces tailpipe emissions.",
            source_citation="BBMP Master Plan Gazette 2026, Section 7.2, Page 7"
        )
    ]
    for c in clauses1:
        db.add(c)

    # Policy 1 Chunks for RAG
    chunks_data = [
        {
            "doc_id": doc1.id,
            "policy_id": pol1.id,
            "page_number": 3,
            "section_title": "Section 4.1 - Maximum Height and Densities",
            "content": "Section 4.1: Maximum Permissible Building Height. In all Residential R-2 and Commercial C-2 zones abutting roads with a minimum carriage width of 12.0 meters, the maximum vertical height of building structures shall not exceed 24.0 meters from average surrounding ground level. Previous limit of 15.0 meters is superseded. Fire safety NOC required for structures over 15 meters."
        },
        {
            "doc_id": doc1.id,
            "policy_id": pol1.id,
            "page_number": 4,
            "section_title": "Section 4.3 - Transit-Oriented FAR Allowance",
            "content": "Section 4.3: Base Floor Area Ratio (FAR). Properties situated within 500 meters of operational Namma Metro transit stations receive an enhanced base FAR of 3.25. Premium FAR up to 4.0 may be purchased subject to municipal betterment levy remittance to BBMP Infrastructure Fund."
        },
        {
            "doc_id": doc1.id,
            "policy_id": pol1.id,
            "page_number": 7,
            "section_title": "Section 7.2 - EV Charging & Green Infrastructure",
            "content": "Section 7.2: EV Charging & Renewable Amenities. Multi-family residential complexes exceeding 8 units must equip 20% of parking slots with EV charging points. All residential plots exceeding 200 sq.meters must construct percolation pits for rainwater harvesting with 2,000 litre capacity."
        }
    ]

    for idx, cd in enumerate(chunks_data):
        chunk = DocumentChunk(
            document_id=cd["doc_id"],
            policy_id=cd["policy_id"],
            chunk_index=idx + 1,
            page_number=cd["page_number"],
            section_title=cd["section_title"],
            content=cd["content"],
            token_count=len(cd["content"].split()),
            metadata_json=json.dumps({"source": doc1.title, "dept": doc1.department})
        )
        db.add(chunk)

    # 3. Seed Policy 2: Solid Waste Management
    doc2 = Document(
        title="BBMP Solid Waste Management By-laws & 3-Way Source Segregation Mandate",
        filename="BBMP_SWM_Bylaws_2026.pdf",
        file_path="uploads/BBMP_SWM_Bylaws_2026.pdf",
        file_size=185000,
        department="Solid Waste Management Special Taskforce, BBMP",
        date_published="2026-01-20",
        source_url="https://bbmp.karnataka.gov.in/swm-bylaws-2026",
        status="indexed",
        chunk_count=3,
        is_demo=True
    )
    db.add(doc2)
    db.flush()

    pol2 = Policy(
        code="BBMP-2026-SWM-11",
        title="Solid Waste Management & 3-Way Source Segregation Mandate (2026)",
        department="Solid Waste Management Special Taskforce, BBMP",
        jurisdiction="Bengaluru Bruhat Mahanagara Palike (BBMP)",
        status="Active",
        effective_date="2026-02-15",
        consultation_deadline="2026-08-31",
        category="Environment & Waste",
        summary_official="Statutory by-laws mandating three-stream waste segregation at generator level across all domestic, institutional, and commercial premises with escalated penalties for mixed waste handover.",
        summary_simple="All residents and businesses in Bengaluru must separate their trash into three bins: Wet waste (green bin), Dry waste (blue bin), and Sanitary/Hazardous waste (red pouch/bin). Garbage collectors will reject unsegregated waste, and repeat violations will attract fines up to ₹1,000 for homes.",
        what_changed="Mandatory 3-way segregation. Spot fines for non-segregated waste increased from ₹200 to ₹1,000 for residential units, and ₹25,000 for bulk generators (>100 kg/day). Mandatory GPS-tagged daily collection.",
        who_affected="All households, apartment resident associations, commercial markets, restaurants, tech parks.",
        where_applies="All 198 BBMP wards across Bengaluru.",
        when_takes_effect="Enacted and strictly active across all wards.",
        key_requirements="Daily handover of green wet waste, bi-weekly dry waste, immediate red sanitary pouch handover.",
        positive_impacts="Reduces open landfill dumping by 65%, eliminates street garbage blackspots, improves neighborhood hygiene.",
        negative_impacts="Requires strict household discipline and purchase of separate bins; fine enforcement on non-compliant households.",
        key_statistics="Fines: ₹1,000 (Residential) / ₹25,000 (Bulk) | Target Landfill Diversion: 80%",
        definitions_json=json.dumps({
            "Bulk Waste Generator": "Premises generating more than 100 kg of waste per day (e.g. tech parks, large apartments, hotels).",
            "Source Segregation": "Separating trash into distinct categories at the point of origin before collection."
        }),
        source_document_id=doc2.id,
        is_demo=True
    )
    db.add(pol2)
    db.flush()

    chunks_data_swm = [
        {
            "doc_id": doc2.id,
            "policy_id": pol2.id,
            "page_number": 2,
            "section_title": "Section 3 - Three-Stream Segregation Protocols",
            "content": "Section 3: Mandatory Three-Stream Segregation. Every household and commercial premises must segregate solid waste into: (a) Wet biodegradable waste in green receptacles, (b) Dry recyclable waste in blue receptacles, (c) Sanitary and domestic hazardous waste in sealed marked red wraps. Handing over mixed unsegregated waste to civic marshals is prohibited."
        },
        {
            "doc_id": doc2.id,
            "policy_id": pol2.id,
            "page_number": 5,
            "section_title": "Section 9 - Penalty Schedule & Bulk Generator Compliance",
            "content": "Section 9: Penalties and Enforcement. First-time violation by residential household carries a spot fine of ₹500; second and subsequent violations carry ₹1,000. Bulk waste generators generating over 100 kg/day must process organic waste on-site or face ₹25,000 monthly penalty."
        }
    ]
    for idx, cd in enumerate(chunks_data_swm):
        chunk = DocumentChunk(
            document_id=cd["doc_id"],
            policy_id=cd["policy_id"],
            chunk_index=idx + 1,
            page_number=cd["page_number"],
            section_title=cd["section_title"],
            content=cd["content"],
            token_count=len(cd["content"].split()),
            metadata_json=json.dumps({"source": doc2.title, "dept": doc2.department})
        )
        db.add(chunk)

    # 4. Seed Policy 3: Transit Corridor & Bus Priority Lane
    pol3 = Policy(
        code="BBMP-2026-MOB-07",
        title="Outer Ring Road Bus Priority Corridor & Feeder Mobility Plan",
        department="Directorate of Urban Land Transport (DULT) & Traffic Police",
        jurisdiction="Bengaluru",
        status="Public Consultation",
        effective_date="2026-05-01",
        consultation_deadline="2026-10-15",
        category="Transport & Mobility",
        summary_official="Public consultation notification for establishing 22 km of dedicated red-top Bus Priority Lanes (BPL) along Outer Ring Road (Silk Board to KR Puram) with integrated feeder micro-mobility bays.",
        summary_simple="A dedicated bus-only lane is being created on the Outer Ring Road between Silk Board and KR Puram to allow BMTC buses to move without getting stuck in traffic. Private cars driving in the bus lane will be fined. Free last-mile electric feeder shuttles will connect metro stations to nearby tech parks.",
        what_changed="Dedicated bus lane operational 7 AM to 10 PM. Non-bus vehicles entering lane face ₹1,000 fine via automated ANPR cameras. 14 new e-auto stands at metro stations.",
        who_affected="Commuters on Outer Ring Road, IT professionals, bus passengers, taxi/auto drivers.",
        where_applies="Outer Ring Road (Silk Board - Bellandur - Marathahalli - KR Puram corridor).",
        when_takes_effect="Consultations until October 15, 2026.",
        key_requirements="No private vehicle entry in extreme left bus corridor during peak hours.",
        positive_impacts="Bus commute time reduced by 40%, reliable feeder shuttles to metro stations.",
        negative_impacts="Remaining 2 general traffic lanes may experience initial peak-hour slow downs for private vehicles.",
        key_statistics="Corridor Length: 22 km | Travel Time Savings: ~25 mins | Fine: ₹1,000",
        definitions_json=json.dumps({
            "Bus Priority Lane (BPL)": "A road lane reserved exclusively for public transport buses during specified hours.",
            "ANPR Camera": "Automatic Number Plate Recognition camera for automated traffic violation detection."
        }),
        is_demo=True
    )
    db.add(pol3)
    db.flush()

    # 5. Seed Policy 4: Rooftop Solar PV Incentive
    pol4 = Policy(
        code="BBMP-2026-SOLAR-02",
        title="Mandatory Rooftop Solar PV & Clean Energy Property Tax Rebate Scheme",
        department="Renewable Energy Directorate & BESCOM",
        jurisdiction="Bengaluru",
        status="Active",
        effective_date="2026-01-01",
        consultation_deadline="2026-11-30",
        category="Environment & Energy",
        summary_official="Municipal mandate for rooftop solar photovoltaic installation on properties exceeding 2,000 sq.ft built-up area, with a 5% annual property tax rebate incentive for early adopters.",
        summary_simple="If your building is larger than 2,000 square feet, you must install at least 1.5 kW of rooftop solar panels. If you install before December 2026, the city will give you a 5% discount on your property tax for the next 3 years.",
        what_changed="Mandatory 1.5 kWp solar for $>2,000$ sq.ft buildings. 5% property tax rebate for 3 years. Net-metering application fast-tracked to 7 days.",
        who_affected="Individual house owners, RWAs, villa communities, commercial rooftops.",
        where_applies="All BBMP municipal zones.",
        when_takes_effect="Active now; tax rebate valid for installations completed before Dec 2026.",
        key_requirements="Grid-tied solar inverter with BESCOM bi-directional meter.",
        positive_impacts="Lower household electricity bills, cleaner neighborhood power, property tax savings.",
        negative_impacts="Initial upfront investment of ₹70,000 - ₹1,20,000 before government subsidy credit.",
        key_statistics="Min Capacity: 1.5 kWp | Tax Rebate: 5% for 3 Years | Net Metering: 7-Day Approval",
        definitions_json=json.dumps({
            "Net Metering": "A billing mechanism that credits solar energy system owners for the electricity they add to the grid.",
            "kWp (Kilowatt Peak)": "The maximum electrical power output of a solar panel system under standard test conditions."
        }),
        is_demo=True
    )
    db.add(pol4)
    db.flush()

    # 6. Seed Policy-Ward Mappings
    mappings = [
        (pol1.id, 80, "High", "Significant building height and FAR enhancement along 100ft and 80ft roads in Indiranagar."),
        (pol1.id, 151, "High", "Commercial corridor density upgrades in Koramangala 5th, 6th, and 7th blocks."),
        (pol1.id, 174, "High", "HSR Layout Sector 1 to 7 FAR upgrades near upcoming metro line."),
        (pol1.id, 84, "Medium", "Whitefield ITPL access corridor residential height allowances."),
        (pol2.id, 80, "High", "100% door-to-door 3-way segregation monitoring by Indiranagar ward marshals."),
        (pol2.id, 151, "High", "Strict bulk waste compliance for Koramangala restaurant hubs."),
        (pol3.id, 174, "High", "Direct impact on HSR Layout / Silk Board junction commuters."),
        (pol3.id, 84, "High", "Direct impact on Whitefield IT corridor transit speeds.")
    ]
    for pol_id, ward_num, imp_lvl, imp_sum in mappings:
        if ward_num in wards_map:
            pwm = PolicyWardMapping(
                policy_id=pol_id,
                ward_id=wards_map[ward_num],
                impact_level=imp_lvl,
                impact_summary=imp_sum
            )
            db.add(pwm)

    # 7. Seed Quadratic Voting Topics
    qv_topics = [
        QuadraticTopic(
            policy_id=pol1.id,
            title="Permit 24m Building Height on Indiranagar & Koramangala 12m Roads",
            description="Allocate your voting credits on whether BBMP should allow 24-meter tall multi-family residential apartments on 12-meter wide neighborhood roads.",
            category="Zoning & Density",
            total_credits_spent=850,
            total_votes_cast=220
        ),
        QuadraticTopic(
            policy_id=pol3.id,
            title="Dedicated Bus Priority Lane on Outer Ring Road (Silk Board to KR Puram)",
            description="Vote on reserving the left lane exclusively for BMTC electric buses and fining private cars during peak hours.",
            category="Mobility & Public Transit",
            total_credits_spent=1420,
            total_votes_cast=340
        ),
        QuadraticTopic(
            policy_id=pol2.id,
            title="₹1,000 Spot Fine for Unsegregated Household Garbage",
            description="Vote on enforcing mandatory 3-way segregation with ₹1,000 spot penalties on non-compliant households.",
            category="Civic Sanitation",
            total_credits_spent=620,
            total_votes_cast=180
        ),
        QuadraticTopic(
            policy_id=pol4.id,
            title="5% Property Tax Rebate for Mandatory Rooftop Solar PV",
            description="Vote on offering tax rebates funded through municipal green bonds for households adopting solar before Dec 2026.",
            category="Green Energy",
            total_credits_spent=1150,
            total_votes_cast=290
        )
    ]
    for qvt in qv_topics:
        db.add(qvt)

    # 8. Seed Sentiment Stances
    sample_sentiments = [
        (pol1.id, "support", "We need more housing near metro stations so young workers can live without extreme commutes.", 80),
        (pol1.id, "oppose", "Our neighborhood water pipelines and borewells cannot handle 8-floor apartments without better sewage upgrades.", 80),
        (pol1.id, "neutral", "Good initiative, but traffic on 12m roads will become severe unless parking is strictly enforced inside buildings.", 151),
        (pol3.id, "support", "The bus lane is crucial. Commute times along ORR will drop drastically for thousands of bus passengers.", 174),
        (pol3.id, "support", "Public transport must get priority over single-occupancy cars on tech corridors.", 84),
        (pol2.id, "support", "Cleanliness is mandatory. 3-way segregation is the only way to close open dump yards.", 80),
        (pol4.id, "support", "5% tax rebate makes solar installation worthwhile for middle-class homes.", 168)
    ]
    for pol_id, stance, comment, ward_num in sample_sentiments:
        sv = SentimentVote(
            policy_id=pol_id,
            session_token=f"seed_session_{stance}_{ward_num}",
            stance=stance,
            comment=comment,
            ward_id=wards_map.get(ward_num)
        )
        db.add(sv)

    # 9. Seed Alerts
    alerts = [
        AlertNotification(
            title="Public Consultation Deadline Approaching",
            message="Final 15 days to submit objections for Revised Zoning Master Plan (BBMP-2026-ZON-04).",
            alert_type="deadline",
            policy_id=pol1.id,
            category="Zoning & Planning",
            event_date="2026-09-30"
        ),
        AlertNotification(
            title="Ward Committee Deliberation: Bus Priority Corridor",
            message="Indiranagar & HSR Ward Committees will convene on Saturday 10 AM to discuss ORR Bus Priority impact.",
            alert_type="council_meeting",
            policy_id=pol3.id,
            category="Transport & Mobility",
            event_date="2026-09-20"
        ),
        AlertNotification(
            title="New Active Policy: 3-Way Waste Segregation",
            message="Ward marshals will start issuing notices for unsegregated wet/dry waste starting next Monday.",
            alert_type="new_policy",
            policy_id=pol2.id,
            category="Environment & Waste",
            event_date="2026-09-15"
        )
    ]
    for a in alerts:
        db.add(a)

    db.commit()
    print("[JanVaani DB] Seed data committed successfully.")
    _load_vector_store_from_db(db)
    db.close()


def _load_vector_store_from_db(db):
    """Loads all existing chunks into the vector store index."""
    chunks = db.query(DocumentChunk).all()
    if not chunks:
        return
    
    formatted_chunks = []
    for c in chunks:
        doc = c.document
        formatted_chunks.append({
            "chunk_index": c.chunk_index,
            "page_number": c.page_number,
            "section_title": c.section_title,
            "content": c.content,
            "policy_id": c.policy_id,
            "metadata": {
                "document_title": doc.title if doc else "Municipal Policy",
                "department": doc.department if doc else "BBMP",
                "policy_id": c.policy_id
            },
            "source_citation": f"{doc.title if doc else 'Document'}, Page {c.page_number} ({c.section_title})"
        })
    vector_store.add_chunks(formatted_chunks)
    print(f"[JanVaani RAG] Vector store initialized with {len(formatted_chunks)} grounded evidence chunks.")
