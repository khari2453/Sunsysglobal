import React, { useState, useRef } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Upload, 
  Sparkles, 
  Briefcase, 
  AlertCircle, 
  CheckCircle, 
  PlusCircle, 
  HelpCircle as PrepIcon, 
  BookOpen, 
  Check, 
  Copy, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('tailoring'); // 'tailoring' | 'interview'
  
  // Shared inputs
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');
  
  // Tailoring Results State
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [tailorResult, setTailorResult] = useState(null);
  const [tailorError, setTailorError] = useState('');
  const [copied, setCopied] = useState(false);

  // Interview Prep Results State
  const [loadingPrep, setLoadingPrep] = useState(false);
  const [prepResult, setPrepResult] = useState(null);
  const [prepError, setPrepError] = useState('');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const fileInputRef = useRef(null);

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      // Optional: read local text file if it's .txt
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (event) => setResumeText(event.target.result);
        reader.readAsText(file);
      } else {
        // PDF parser is on the backend, so we let the backend handle the parsing
        setResumeText(`[PDF File Uploaded: ${file.name}]`);
      }
    }
  };

  // Submit for Resume Tailoring
  const handleTailorSubmit = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() && !resumeFile) {
      setTailorError('Please upload a resume file or paste your resume text.');
      return;
    }
    if (!jdText.trim()) {
      setTailorError('Please enter a Job Description.');
      return;
    }

    setLoadingTailor(true);
    setTailorError('');
    setTailorResult(null);

    const formData = new FormData();
    if (resumeFile) {
      formData.append('resume_file', resumeFile);
    } else {
      formData.append('resume_text', resumeText);
    }
    formData.append('jd_text', jdText);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/tailor', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to analyze resume.');
      }

      const data = await response.json();
      setTailorResult(data);
    } catch (err) {
      setTailorError(err.message || 'Connecting to backend NLP server failed. Is the server running?');
    } finally {
      setLoadingTailor(false);
    }
  };

  // Submit for Interview Prep
  const handlePrepSubmit = async (e) => {
    e.preventDefault();
    if (!resumeText.trim() && !resumeFile) {
      setPrepError('Please upload a resume file or paste your resume text.');
      return;
    }
    if (!jdText.trim()) {
      setPrepError('Please enter a Job Description.');
      return;
    }

    setLoadingPrep(true);
    setPrepError('');
    setPrepResult(null);
    setExpandedQuestion(null);

    const formData = new FormData();
    if (resumeFile) {
      formData.append('resume_file', resumeFile);
    } else {
      formData.append('resume_text', resumeText);
    }
    formData.append('jd_text', jdText);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/interview-prep', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to generate prep questions.');
      }

      const data = await response.json();
      setPrepResult(data.questions);
    } catch (err) {
      setPrepError(err.message || 'Connecting to backend NLP server failed. Is the server running?');
    } finally {
      setLoadingPrep(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar / Header */}
      <header className="border-b border-[rgba(255,255,255,0.08)] bg-opacity-70 bg-[#0b0f19] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="text-white h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ResuTailor <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">NLP BETA</span>
              </h1>
              <p className="text-xs text-gray-400">AI-Powered Resume Matcher & Interview Coach</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-[rgba(255,255,255,0.05)] p-1 rounded-xl border border-[rgba(255,255,255,0.08)]">
            <button
              onClick={() => setActiveTab('tailoring')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'tailoring'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Resume Tailoring
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'interview'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Interview Prep
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {activeTab === 'tailoring' ? (
          /* ==================== RESUME TAILORING TAB ==================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Inputs Panel (Left) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="glass-card p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[rgba(255,255,255,0.06)]">
                  <Briefcase className="text-cyan-400 h-5 w-5" />
                  <h2 className="text-lg font-bold text-white">Upload Your Profile</h2>
                </div>

                <form onSubmit={handleTailorSubmit} className="flex flex-col gap-4">
                  {/* Master Resume Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Master Resume</label>
                    <div 
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-all flex flex-col items-center justify-center gap-2 ${
                        resumeFile ? 'border-cyan-500/50 bg-cyan-950/5' : 'border-gray-700'
                      }`}
                      onClick={triggerFileSelect}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf,.txt"
                      />
                      <Upload className="h-8 w-8 text-gray-400" />
                      {resumeFile ? (
                        <div>
                          <p className="text-sm font-semibold text-white truncate max-w-xs">{resumeFile.name}</p>
                          <p className="text-xs text-cyan-400">File uploaded successfully</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-semibold text-white">Click or drag resume file</p>
                          <p className="text-xs text-gray-500">Supports PDF, TXT (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Or Paste Resume Text */}
                  {!resumeFile && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Or Paste Resume Text</label>
                      <textarea
                        rows="5"
                        placeholder="Paste your existing resume content here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="text-sm bg-gray-950/40"
                      />
                    </div>
                  )}

                  {/* Job Description Text */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Job Description</label>
                    <textarea
                      rows="6"
                      placeholder="Paste the target job description to match against..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      className="text-sm bg-gray-950/40"
                      required
                    />
                  </div>

                  {/* Error Notification */}
                  {tailorError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <span>{tailorError}</span>
                    </div>
                  )}

                  {/* Tailor Button */}
                  <button
                    type="submit"
                    className="btn-primary w-full mt-2"
                    disabled={loadingTailor}
                  >
                    {loadingTailor ? (
                      <>
                        <Cpu className="animate-spin h-5 w-5" />
                        Analyzing via NLP Engine...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Match & Tailor Resume
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Results Panel (Right) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {tailorResult ? (
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Score & Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Match Score Card */}
                    <div className="md:col-span-5 glass-card p-6 flex flex-col items-center justify-center text-center bg-gradient-card-glow relative">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">ATS Match Score</h3>
                      
                      {/* Circular Gauge */}
                      <div className="relative flex items-center justify-center h-32 w-32">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="rgba(255, 255, 255, 0.05)"
                            strokeWidth="8"
                            fill="transparent"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="url(#cyanPurple)"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={263.89}
                            strokeDashoffset={263.89 - (263.89 * tailorResult.matchScore) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                          <defs>
                            <linearGradient id="cyanPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#06b6d4" />
                              <stop offset="100%" stopColor="#818cf8" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-white">{tailorResult.matchScore}%</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Ready</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/30">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {tailorResult.matchScore >= 80 ? 'Excellent Match!' : tailorResult.matchScore >= 50 ? 'Moderate Match' : 'High Gaps Found'}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="md:col-span-7 glass-card p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">NLP Keyword Summary</h3>
                        <p className="text-xs text-gray-400 mb-4">
                          Based on spaCy analysis of nouns, proper nouns, and specialized tech-methodology dictionary:
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center bg-green-950/20 px-4 py-2 rounded-xl border border-green-900/20">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-xs font-bold text-gray-300">Fully Matched Keywords</span>
                          </div>
                          <span className="text-sm font-extrabold text-green-400">{tailorResult.matchedKeywords.length}</span>
                        </div>
                        <div className="flex justify-between items-center bg-yellow-950/20 px-4 py-2 rounded-xl border border-yellow-900/20">
                          <div className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4 text-yellow-400" />
                            <span className="text-xs font-bold text-gray-300">Partially Matched Keywords</span>
                          </div>
                          <span className="text-sm font-extrabold text-yellow-400">{tailorResult.partialKeywords.length}</span>
                        </div>
                        <div className="flex justify-between items-center bg-red-950/20 px-4 py-2 rounded-xl border border-red-900/20">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-400" />
                            <span className="text-xs font-bold text-gray-300">Missing Core Keywords</span>
                          </div>
                          <span className="text-sm font-extrabold text-red-400">{tailorResult.missingKeywords.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keyword Breakdowns */}
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 pb-3 border-b border-[rgba(255,255,255,0.06)] mb-4">
                      JD Keyword Tag Breakdown
                    </h3>
                    <div className="flex flex-col gap-4">
                      {/* Technical Skills */}
                      <div>
                        <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider mb-2">Technical Skills & Tools</h4>
                        <div className="flex flex-wrap gap-2">
                          {tailorResult.keywords.technical.map((kw, i) => {
                            const isMatched = tailorResult.matchedKeywords.includes(kw);
                            const isPartial = tailorResult.partialKeywords.includes(kw);
                            let tagClass = "bg-red-500/10 text-red-300 border-red-500/20";
                            if (isMatched) tagClass = "bg-green-500/10 text-green-300 border-green-500/20";
                            if (isPartial) tagClass = "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
                            return (
                              <span key={i} className={`text-xs px-2.5 py-1 rounded-md border font-medium ${tagClass}`}>
                                {kw}
                              </span>
                            );
                          })}
                          {tailorResult.keywords.technical.length === 0 && (
                            <span className="text-xs text-gray-500 italic">No specific technical keywords detected.</span>
                          )}
                        </div>
                      </div>

                      {/* Methodologies */}
                      <div>
                        <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider mb-2">Methodologies & Soft Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {tailorResult.keywords.methodologies.map((kw, i) => {
                            const isMatched = tailorResult.matchedKeywords.includes(kw);
                            const isPartial = tailorResult.partialKeywords.includes(kw);
                            let tagClass = "bg-red-500/10 text-red-300 border-red-500/20";
                            if (isMatched) tagClass = "bg-green-500/10 text-green-300 border-green-500/20";
                            if (isPartial) tagClass = "bg-yellow-500/10 text-yellow-300 border-yellow-500/20";
                            return (
                              <span key={i} className={`text-xs px-2.5 py-1 rounded-md border font-medium ${tagClass}`}>
                                {kw}
                              </span>
                            );
                          })}
                          {tailorResult.keywords.methodologies.length === 0 && (
                            <span className="text-xs text-gray-500 italic">No methodologies or soft skills detected.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tailoring Recommendations */}
                  <div className="glass-card p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 pb-3 border-b border-[rgba(255,255,255,0.06)] mb-4">
                      NLP-Driven Tailoring Recommendations
                    </h3>
                    <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-2">
                      {tailorResult.suggestions.map((sug, i) => (
                        <div key={i} className="flex gap-3 bg-[rgba(255,255,255,0.02)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
                          <div className="mt-0.5">
                            {sug.type === 'Technical' ? (
                              <span className="bg-red-500/20 text-red-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-red-500/30">Gap</span>
                            ) : sug.type === 'Refinement' ? (
                              <span className="bg-yellow-500/20 text-yellow-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-yellow-500/30">Refine</span>
                            ) : (
                              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-cyan-500/30">Context</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-200 leading-relaxed">{sug.message}</p>
                          </div>
                        </div>
                      ))}
                      {tailorResult.suggestions.length === 0 && (
                        <p className="text-sm text-green-400 italic">Perfect match! No resume modifications needed to match keywords.</p>
                      )}
                    </div>
                  </div>

                  {/* Tailored Resume Mockup */}
                  <div className="glass-card p-6">
                    <div className="flex justify-between items-center pb-3 border-b border-[rgba(255,255,255,0.06)] mb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                        Tailored Resume Preview
                      </h3>
                      <button
                        onClick={() => copyToClipboard(tailorResult.tailoredResume)}
                        className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-white bg-cyan-950/30 px-3 py-1.5 rounded-lg border border-cyan-900/30 font-medium transition"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy Resume Addendum
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-[#070a12] p-4 rounded-xl border border-[rgba(255,255,255,0.05)]">
                      <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                        {tailorResult.tailoredResume}
                      </pre>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4 h-full min-h-[300px]">
                  <div className="h-16 w-16 rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">No Analysis Done Yet</h3>
                    <p className="text-sm text-gray-400 max-w-md">
                      Upload your master resume and paste the job description, then click "Match & Tailor" to extract keywords and optimize your profile.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ==================== INTERVIEW PREP TAB ==================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Inputs Panel (Left) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="glass-card p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[rgba(255,255,255,0.06)]">
                  <PrepIcon className="text-purple-400 h-5 w-5" />
                  <h2 className="text-lg font-bold text-white">Interview Prep Config</h2>
                </div>

                <form onSubmit={handlePrepSubmit} className="flex flex-col gap-4">
                  {/* Master Resume Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Master Resume</label>
                    <div 
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-all flex flex-col items-center justify-center gap-2 ${
                        resumeFile ? 'border-purple-500/50 bg-purple-950/5' : 'border-gray-700'
                      }`}
                      onClick={triggerFileSelect}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf,.txt"
                      />
                      <Upload className="h-8 w-8 text-gray-400" />
                      {resumeFile ? (
                        <div>
                          <p className="text-sm font-semibold text-white truncate max-w-xs">{resumeFile.name}</p>
                          <p className="text-xs text-purple-400">File uploaded successfully</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-semibold text-white">Click or drag resume file</p>
                          <p className="text-xs text-gray-500">Supports PDF, TXT (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Or Paste Resume Text */}
                  {!resumeFile && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Or Paste Resume Text</label>
                      <textarea
                        rows="5"
                        placeholder="Paste your existing resume content here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className="text-sm bg-gray-950/40"
                      />
                    </div>
                  )}

                  {/* Job Description Text */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">Job Description</label>
                    <textarea
                      rows="6"
                      placeholder="Paste the target job description to build interview prep..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      className="text-sm bg-gray-950/40"
                      required
                    />
                  </div>

                  {/* Error Notification */}
                  {prepError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <span>{prepError}</span>
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    type="submit"
                    className="btn-primary w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-purple-500/20"
                    disabled={loadingPrep}
                  >
                    {loadingPrep ? (
                      <>
                        <Cpu className="animate-spin h-5 w-5" />
                        Structuring Prep Guide...
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-5 w-5" />
                        Generate Custom Prep Questions
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Questions list (Right) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {prepResult ? (
                <div className="flex flex-col gap-4 animate-fade-in">
                  <div className="glass-card p-6 pb-2 mb-2">
                    <h3 className="text-lg font-bold text-white mb-1">Tailored Interview Simulator</h3>
                    <p className="text-sm text-gray-400">
                      We matched the JD skills with your resume and compiled these questions. Expand each to see detailed answering guides and custom experience hooks.
                    </p>
                  </div>

                  {prepResult.map((q, index) => {
                    const isExpanded = expandedQuestion === index;
                    return (
                      <div 
                        key={index} 
                        className={`glass-card glass-card-hover transition-all duration-300 ${
                          isExpanded ? 'border-indigo-500/40 shadow-lg shadow-indigo-950/20' : ''
                        }`}
                      >
                        {/* Question Header Card */}
                        <div 
                          className="p-5 cursor-pointer flex justify-between items-start gap-4 hover:bg-[rgba(255,255,255,0.01)]"
                          onClick={() => setExpandedQuestion(isExpanded ? null : index)}
                        >
                          <div className="flex flex-col gap-2">
                            {/* Categories tags */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                {q.category}
                              </span>
                              {q.resume_gap ? (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                                  Gap Identified
                                </span>
                              ) : (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-green-500/10 text-green-300 border border-green-500/20">
                                  Resume Match
                                </span>
                              )}
                            </div>
                            <h4 className="text-md font-bold text-white leading-snug">{q.question}</h4>
                          </div>
                          <span className={`text-gray-400 font-bold transition-transform duration-200 mt-1 transform ${isExpanded ? 'rotate-90' : ''}`}>
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>

                        {/* Collapsible Content */}
                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.05)] pt-4 flex flex-col gap-4 animate-fade-in bg-[#0c101d]/30">
                            {/* Why Asked */}
                            <div>
                              <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Why they ask this</h5>
                              <p className="text-sm text-gray-300 leading-relaxed">{q.why_asked}</p>
                            </div>

                            {/* Answering Strategy */}
                            <div>
                              <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">Suggested Answering Strategy</h5>
                              <p className="text-sm text-gray-300 leading-relaxed">{q.general_tip}</p>
                            </div>

                            {/* Tailored Tip */}
                            <div className={`p-4 rounded-xl border ${
                              q.resume_gap 
                                ? 'bg-red-950/15 border-red-900/20' 
                                : 'bg-green-950/15 border-green-900/20'
                            }`}>
                              <h5 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                                q.resume_gap ? 'text-red-400' : 'text-green-400'
                              }`}>
                                {q.resume_gap ? 'Bridging Strategy' : 'Tailored Experience Highlight'}
                              </h5>
                              <p 
                                className="text-sm text-gray-200 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: q.custom_tip }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state */
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center gap-4 h-full min-h-[300px]">
                  <div className="h-16 w-16 rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                    <PrepIcon className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">No Prep Questions Generated</h3>
                    <p className="text-sm text-gray-400 max-w-md">
                      Upload your resume and copy the job description, then click "Generate Questions" to create your customized interview study plan.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.08)] py-6 mt-12 bg-gray-950/60 text-center">
        <p className="text-xs text-gray-500">
          ResuTailor AI Matching Engine &bull; Built with FastAPI & spaCy NLP Pipeline &bull; React Frontend
        </p>
      </footer>
    </div>
  );
}
