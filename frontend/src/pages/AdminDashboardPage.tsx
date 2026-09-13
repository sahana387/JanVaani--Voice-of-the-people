import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Shield, UploadCloud, FileText, Database, 
  Layers, CheckCircle2, AlertCircle, RefreshCw, Eye
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  const [loadingChunks, setLoadingChunks] = useState(false);

  // Upload Form
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDept, setUploadDept] = useState('Urban Development & Town Planning Directorate');
  const [uploadCategory, setUploadCategory] = useState('Zoning & Planning');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const [st, docs] = await Promise.all([
        api.getAdminStats(),
        api.getAdminDocuments()
      ]);
      setStats(st);
      setDocuments(docs.documents || []);
    } catch (err) {
      console.error("Failed to load admin data", err);
    }
  };

  const handleInspectChunks = async (docId: number) => {
    setSelectedDocId(docId);
    setLoadingChunks(true);
    try {
      const data = await api.getDocumentChunks(docId);
      setChunks(data.chunks || []);
    } catch (err) {
      console.error(err);
      setChunks([]);
    } finally {
      setLoadingChunks(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      alert("Please provide a title for the document.");
      return;
    }

    setUploading(true);
    setUploadMsg('');
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        // Create a synthetic municipal text blob if file was not attached
        const syntheticBlob = new Blob([
          `MUNICIPAL GAZETTE: ${uploadTitle}\nDEPARTMENT: ${uploadDept}\nSection 1: General Provisions\nThis document outlines updated municipal compliance requirements.`
        ], { type: 'text/plain' });
        formData.append('file', syntheticBlob, `${uploadTitle.replace(/\s+/g, '_')}.txt`);
      }
      formData.append('title', uploadTitle);
      formData.append('department', uploadDept);
      formData.append('category', uploadCategory);

      const res = await api.uploadDocument(formData);
      setUploadMsg(res.message || "Document successfully ingested and indexed!");
      setUploadTitle('');
      setSelectedFile(null);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold border border-amber-400/30">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Municipal Administration & Ingestion Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Admin Knowledge & Ingestion Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Ingest new government PDF notifications, view extraction status, monitor vector index chunks, and verify grounding integrity.
        </p>
      </div>

      {/* System Metrics Strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Indexed Documents</span>
            <span className="text-2xl font-black text-slate-900">{stats.total_documents}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Vector Chunks</span>
            <span className="text-2xl font-black text-blue-600">{stats.vector_store_indexed_chunks}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Quadratic Votes Cast</span>
            <span className="text-2xl font-black text-purple-600">{stats.total_quadratic_votes}</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Sentiment Submissions</span>
            <span className="text-2xl font-black text-emerald-600">{stats.total_sentiment_votes}</span>
          </div>
        </div>
      )}

      {/* Ingestion & Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Ingest Municipal Document
            </h2>
            <p className="text-xs text-slate-500">
              Upload PDF or text files. The system will extract text, detect sections, generate semantic chunks, and update vector retrieval.
            </p>
          </div>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Document Title
              </label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g., BBMP Stormwater Drain Master Plan 2026"
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Issuing Department
              </label>
              <input
                type="text"
                value={uploadDept}
                onChange={(e) => setUploadDept(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Policy Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Zoning & Planning">Zoning & Planning</option>
                <option value="Transport & Mobility">Transport & Mobility</option>
                <option value="Environment & Waste">Environment & Waste</option>
                <option value="Environment & Energy">Environment & Energy</option>
                <option value="Taxation & Finance">Taxation & Finance</option>
              </select>
            </div>

            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 bg-slate-50 hover:bg-slate-100 transition-colors">
              <UploadCloud className="w-8 h-8 mx-auto text-slate-400" />
              <div className="text-xs text-slate-600">
                <label className="font-bold text-blue-600 hover:underline cursor-pointer">
                  <span>Choose PDF / TXT file</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">
                  {selectedFile ? `Selected: ${selectedFile.name}` : "Or click upload to generate structured municipal policy"}
                </p>
              </div>
            </div>

            {uploadMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{uploading ? 'Processing & Indexing...' : 'Upload & Index in Vector DB'}</span>
            </button>
          </form>
        </div>

        {/* Indexed Documents Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Indexed Municipal Documents
              </h2>
              <p className="text-xs text-slate-500">
                All records currently serving the RAG retrieval engine
              </p>
            </div>
            <button
              onClick={loadAdminData}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Refresh document status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-2xl border transition-all ${
                  selectedDocId === doc.id
                    ? 'bg-blue-50/50 border-blue-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-sm">
                    {doc.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                  <span>{doc.department}</span>
                  <button
                    onClick={() => handleInspectChunks(doc.id)}
                    className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect {doc.chunk_count} Chunks
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Chunk Visualizer Drawer */}
      {selectedDocId && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Vector Store Chunks for Document #{selectedDocId}
              </h3>
              <p className="text-xs text-slate-500">
                Exact text segments indexed with page numbers and section boundaries
              </p>
            </div>
            <button
              onClick={() => setSelectedDocId(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Close Inspector
            </button>
          </div>

          {loadingChunks ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading chunk excerpts...</div>
          ) : chunks.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No chunk details found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-1">
              {chunks.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Chunk #{c.chunk_index} (Page {c.page_number})</span>
                    <span className="text-[10px] text-slate-400">{c.token_count} words</span>
                  </div>
                  <div className="text-blue-900 font-semibold text-[11px]">
                    {c.section_title}
                  </div>
                  <p className="text-slate-600 font-mono text-[11px] leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
                    "{c.content}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
