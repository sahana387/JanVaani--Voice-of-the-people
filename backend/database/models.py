import json
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.db import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, default=0)
    mime_type = Column(String(100), default="application/pdf")
    department = Column(String(150), default="General Municipal Administration")
    date_published = Column(String(50), nullable=True)
    source_url = Column(String(512), nullable=True)
    status = Column(String(50), default="indexed")  # pending, processing, indexed, error
    chunk_count = Column(Integer, default=0)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    policies = relationship("Policy", back_populates="source_document")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    policy_id = Column(Integer, ForeignKey("policies.id", ondelete="SET NULL"), nullable=True)
    chunk_index = Column(Integer, nullable=False)
    page_number = Column(Integer, default=1)
    section_title = Column(String(255), default="General")
    content = Column(Text, nullable=False)
    embedding_json = Column(Text, nullable=True)  # JSON serialized list of floats
    token_count = Column(Integer, default=0)
    metadata_json = Column(Text, nullable=True)  # dict metadata

    document = relationship("Document", back_populates="chunks")
    policy = relationship("Policy", back_populates="chunks")


class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    department = Column(String(150), nullable=False)
    jurisdiction = Column(String(100), default="Bengaluru Bruhat Mahanagara Palike (BBMP)")
    status = Column(String(50), default="Active")  # Active, Public Consultation, Draft, Enacted
    effective_date = Column(String(50), nullable=False)
    consultation_deadline = Column(String(50), nullable=True)
    category = Column(String(100), default="Zoning & Planning")  # Housing, Transport, Environment, Waste, Infrastructure
    
    summary_official = Column(Text, nullable=False)
    summary_simple = Column(Text, nullable=False)
    what_changed = Column(Text, nullable=False)
    who_affected = Column(Text, nullable=False)
    where_applies = Column(Text, nullable=False)
    when_takes_effect = Column(Text, nullable=False)
    key_requirements = Column(Text, nullable=True)
    positive_impacts = Column(Text, nullable=True)
    negative_impacts = Column(Text, nullable=True)
    key_statistics = Column(Text, nullable=True)
    definitions_json = Column(Text, nullable=True)  # JSON glossary
    
    previous_version_code = Column(String(50), nullable=True)
    source_document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    source_document = relationship("Document", back_populates="policies")
    chunks = relationship("DocumentChunk", back_populates="policy")
    clauses = relationship("PolicyClause", back_populates="policy", cascade="all, delete-orphan")
    ward_mappings = relationship("PolicyWardMapping", back_populates="policy", cascade="all, delete-orphan")
    sentiments = relationship("SentimentVote", back_populates="policy", cascade="all, delete-orphan")
    quadratic_topics = relationship("QuadraticTopic", back_populates="policy", cascade="all, delete-orphan")


class PolicyClause(Base):
    __tablename__ = "policy_clauses"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id", ondelete="CASCADE"), nullable=False)
    section_number = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    official_text = Column(Text, nullable=False)
    simple_text = Column(Text, nullable=False)
    page_number = Column(Integer, default=1)
    clause_type = Column(String(50), default="standard")  # added, removed, modified, standard
    old_value = Column(String(255), nullable=True)
    new_value = Column(String(255), nullable=True)
    practical_impact = Column(Text, nullable=True)
    source_citation = Column(String(255), nullable=True)

    policy = relationship("Policy", back_populates="clauses")


class Ward(Base):
    __tablename__ = "wards"

    id = Column(Integer, primary_key=True, index=True)
    ward_number = Column(Integer, unique=True, index=True)
    name = Column(String(100), nullable=False)
    zone = Column(String(100), nullable=False)  # East, West, South, Mahadevapura, etc.
    city = Column(String(100), default="Bengaluru")
    pin_codes = Column(String(255), default="")
    population = Column(Integer, default=50000)
    area_sq_km = Column(Float, default=4.5)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    geojson_polygon = Column(Text, nullable=False)  # GeoJSON polygon coordinates

    policy_mappings = relationship("PolicyWardMapping", back_populates="ward", cascade="all, delete-orphan")


class PolicyWardMapping(Base):
    __tablename__ = "policy_ward_mappings"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id", ondelete="CASCADE"), nullable=False)
    ward_id = Column(Integer, ForeignKey("wards.id", ondelete="CASCADE"), nullable=False)
    impact_level = Column(String(50), default="Medium")  # High, Medium, Low
    impact_summary = Column(Text, nullable=False)
    spatial_notes = Column(Text, nullable=True)

    policy = relationship("Policy", back_populates="ward_mappings")
    ward = relationship("Ward", back_populates="policy_mappings")


class QuadraticTopic(Base):
    __tablename__ = "quadratic_topics"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), default="Infrastructure")
    total_credits_spent = Column(Integer, default=0)
    total_votes_cast = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    policy = relationship("Policy", back_populates="quadratic_topics")
    votes = relationship("QuadraticVote", back_populates="topic", cascade="all, delete-orphan")


class QuadraticVote(Base):
    __tablename__ = "quadratic_votes"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("quadratic_topics.id", ondelete="CASCADE"), nullable=False)
    session_token = Column(String(100), nullable=False)
    credits_spent = Column(Integer, nullable=False)  # e.g., 16 credits
    votes_awarded = Column(Integer, nullable=False)  # e.g., 4 votes
    timestamp = Column(DateTime, default=datetime.utcnow)

    topic = relationship("QuadraticTopic", back_populates="votes")


class SentimentVote(Base):
    __tablename__ = "sentiment_votes"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id", ondelete="CASCADE"), nullable=False)
    session_token = Column(String(100), nullable=False)
    stance = Column(String(20), nullable=False)  # support, oppose, neutral
    comment = Column(Text, nullable=True)
    ward_id = Column(Integer, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    policy = relationship("Policy", back_populates="sentiments")


class AlertNotification(Base):
    __tablename__ = "alert_notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    alert_type = Column(String(50), default="new_policy")  # new_policy, deadline, council_meeting, modification
    policy_id = Column(Integer, ForeignKey("policies.id", ondelete="SET NULL"), nullable=True)
    ward_id = Column(Integer, ForeignKey("wards.id", ondelete="SET NULL"), nullable=True)
    category = Column(String(100), default="General")
    event_date = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class CitizenResponseDraft(Base):
    __tablename__ = "citizen_response_drafts"

    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id", ondelete="CASCADE"), nullable=False)
    session_token = Column(String(100), nullable=False)
    response_type = Column(String(50), nullable=False)  # feedback, objection, support, rti, email
    citizen_position = Column(String(50), nullable=False)
    concerns = Column(Text, nullable=False)
    user_ward = Column(String(100), nullable=True)
    generated_draft = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
