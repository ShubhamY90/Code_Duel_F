import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
  Sword, Timer, CheckCircle, XCircle, Play, RotateCcw,
  ChevronDown, ChevronUp, Maximize2, Minimize2, AlertTriangle,
  Code2, Loader2, WifiOff, Terminal
} from 'lucide-react';
import { useProblem } from '../hooks/useProblem';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../constants/languages';
import { getStarterCode } from '../constants/starterTemplates';

// eslint-disable-next-line no-unused-vars
const JUDGE0_BASE_URL = import.meta.env.VITE_JUDGE0_URL || '';

function ProblemSkeleton() {
  return (
    <div className="p-5 flex flex-col gap-4 animate-pulse">
      <div className="h-5 w-20 rounded bg-white/5" />
      <div className="h-7 w-3/5 rounded bg-white/5" />
      <div className="h-3.5 w-full rounded bg-white/5" />
      <div className="h-3.5 w-4/5 rounded bg-white/5" />
      <div className="h-24 rounded-xl bg-white/5 mt-2" />
      <div className="h-3.5 w-3/4 rounded bg-white/5" />
    </div>
  );
}

export default function DuelPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    username = 'Anonymous',
    problemId = null,
    opponent = { name: 'Waiting…' },
    durationSec = 30 * 60,
  } = location.state || {};

  const { problem, loading: problemLoading, error: problemError } = useProblem(problemId);

  // Editor states
  const [lang, setLang] = useState(DEFAULT_LANGUAGE);
  const [code, setCode] = useState(getStarterCode(DEFAULT_LANGUAGE, null));
  const editorRef = useRef(null);

  useEffect(() => {
    setCode(getStarterCode(lang, problem));
  }, [problem, lang]);

  // Timer
  const [timeLeft, setTimeLeft] = useState(durationSec);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          navigate('/results', { state: { timeout: true, username } });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [navigate, username]);

  // Opponent progress simulation
  const [opponentProgress, setOpponentProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setOpponentProgress(p => Math.min(p + Math.random() * 3, 95));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // UI States
  const [editorFull, setEditorFull] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [submitted, setSubmitted] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  // Console panel states
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [consoleTab, setConsoleTab] = useState('tests'); // tests | output

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const urgency = timeLeft < 300 ? 'urgent' : timeLeft < 600 ? 'warning' : 'normal';

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setCode(getStarterCode(newLang, problem));
    setTestResults(null);
  };

  const handleReset = () => {
    setCode(getStarterCode(lang, problem));
    setTestResults(null);
    setSubmitError(null);
  };

  const handleRun = useCallback(() => {
    if (!problem) return;
    setIsRunning(true);
    setConsoleOpen(true);
    setConsoleTab('tests');
    setSubmitError(null);

    // Simulate compilation and test cases running
    setTimeout(() => {
      const visibleCases = problem.visibleTestCases ?? [];
      const mockGotOutputs = ['[0,1]', '[]', '[1,2]', '[-1,-1]']; // standard fallback
      const results = visibleCases.map((tc, idx) => {
        const passed = idx % 2 === 0; // Simulate some passes
        return {
          label: tc.label ?? `Case ${idx + 1}`,
          input: tc.input,
          expected: tc.output,
          got: passed ? tc.output : (mockGotOutputs[idx] ?? 'undefined'),
          passed: passed,
          time: '12ms',
        };
      });
      setTestResults(results.length ? results : null);
      setIsRunning(false);
    }, 1200);
  }, [problem]);

  const handleSubmit = useCallback(async () => {
    if (!problem) return;
    setIsRunning(true);
    setConsoleOpen(true);
    setConsoleTab('tests');
    setSubmitError(null);

    // Simulate submittal to Judge0 and results transition
    setTimeout(() => {
      setIsRunning(false);
      // Generate some mock results
      const results = (problem.visibleTestCases ?? []).map((tc) => ({
        input: tc.input,
        expected: tc.output,
        got: tc.output,
        passed: true,
        time: '8ms'
      }));
      navigate('/results', { 
        state: { 
          results, 
          timeLeft, 
          problem: problem.title, 
          timeout: false, 
          username 
        } 
      });
    }, 1500);
  }, [problem, timeLeft, navigate, username]);

  const DIFF_COLOR = { 
    Easy: 'text-brand-green bg-brand-green/10 border-brand-green/20', 
    Medium: 'text-brand-amber bg-brand-amber/10 border-brand-amber/20', 
    Hard: 'text-brand-red bg-brand-red/10 border-brand-red/20' 
  };

  return (
    <div className={`flex flex-col bg-bg-space text-white ${editorFull ? 'h-screen' : 'min-h-screen'}`}>
      
      {/* ── IDE Header ── */}
      <header className="glass-nav flex items-center justify-between px-5 py-2.5 flex-shrink-0 z-20">
        
        {/* Logo and problem status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/lobby')}
            className="flex items-center gap-2 text-sm font-black bg-transparent border-0 cursor-pointer text-white"
          >
            <Sword size={16} className="text-brand-purple" />
            <span className="hidden sm:inline">CodeDuel</span>
          </button>
          
          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Problem Badge */}
          <div className="flex items-center gap-2 bg-bg-panel border border-white/[0.05] rounded-xl px-3 py-1">
            {problemLoading ? (
              <span className="flex items-center gap-1.5 text-xs text-white/30 font-semibold">
                <Loader2 size={12} className="animate-spin text-brand-purple" /> Loading...
              </span>
            ) : problem ? (
              <>
                <span className={`text-[0.6rem] font-bold px-2 py-0.5 border rounded-full ${DIFF_COLOR[problem.difficulty] || ''}`}>
                  {problem.difficulty}
                </span>
                <span className="text-xs font-bold text-white/80">{problem.title}</span>
              </>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-brand-red font-semibold">
                <WifiOff size={12} /> No Assigned Problem
              </span>
            )}
          </div>
        </div>

        {/* Players Progress Area */}
        <div className="flex items-center gap-4 flex-1 max-w-sm mx-6">
          <div className="flex-1">
            <div className="flex justify-between text-[0.55rem] font-bold text-white/30 mb-1">
              <span>{username}</span>
              <span className="text-brand-violet">Coding...</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-brand rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((code.length / 500) * 100, 95)}%` }} 
              />
            </div>
          </div>
          <span className="text-xs flex-shrink-0 opacity-40">⚔️</span>
          <div className="flex-1">
            <div className="flex justify-between text-[0.55rem] font-bold text-white/30 mb-1">
              <span>{opponent.name}</span>
              <span className="text-brand-pink">{Math.round(opponentProgress)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-pink rounded-full transition-all duration-500" 
                style={{ width: `${opponentProgress}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Action Buttons and Timer */}
        <div className="flex items-center gap-3">
          {/* Circular/Pill timer */}
          <div className={`flex items-center gap-1.5 font-mono-code text-xs font-bold px-3 py-1.5 rounded-xl border ${
            urgency === 'urgent' ? 'border-brand-red/40 text-brand-red bg-brand-red/5 animate-pulse' :
            urgency === 'warning' ? 'border-brand-amber/40 text-brand-amber bg-brand-amber/5' :
            'border-white/[0.05] text-white/80 bg-bg-panel'
          }`}>
            <Timer size={13} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <div className="h-4 w-px bg-white/10 hidden md:block" />

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button 
              id="reset-btn" 
              onClick={handleReset} 
              title="Reset starter code"
              className="p-2 rounded-xl border border-white/[0.05] bg-bg-panel text-white/40 hover:text-white hover:border-white/15 transition-colors"
            >
              <RotateCcw size={13} />
            </button>
            <button 
              id="fullscreen-btn" 
              onClick={() => setEditorFull(!editorFull)} 
              title="Toggle Fullscreen"
              className="p-2 rounded-xl border border-white/[0.05] bg-bg-panel text-white/40 hover:text-white hover:border-white/15 transition-colors"
            >
              {editorFull ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            <button 
              id="run-btn" 
              onClick={handleRun} 
              disabled={isRunning || !problem}
              className="btn-secondary py-1.5 px-3.5 text-xs"
            >
              <Play size={12} /> Run
            </button>
            <button 
              id="submit-btn" 
              onClick={handleSubmit} 
              disabled={isRunning || !problem}
              className="btn-primary py-1.5 px-3.5 text-xs shadow-none"
            >
              Submit ⚡
            </button>
          </div>
        </div>
      </header>

      {/* ── IDE Workspace ── */}
      <div className={`flex flex-1 overflow-hidden relative ${editorFull ? '' : 'grid grid-cols-[380px_1fr]'}`}>
        
        {/* Left Side Panel: Problem Statement (Always visible, decluttered) */}
        {!editorFull && (
          <aside className="border-r border-white/[0.04] bg-[#06060c] flex flex-col overflow-y-auto">
            {problemLoading && <ProblemSkeleton />}

            {problemError && !problemLoading && (
              <div className="flex flex-col items-center justify-center gap-3 p-12 text-center text-white/35">
                <WifiOff size={24} className="opacity-50" />
                <p className="text-xs font-semibold text-white/50">Error fetching problem</p>
                <code className="font-mono-code text-[0.65rem] text-brand-red bg-brand-red/5 px-2 py-1 rounded border border-brand-red/15 break-all">{problemError}</code>
              </div>
            )}

            {!problemLoading && !problemError && !problem && (
              <div className="flex flex-col items-center justify-center gap-3 p-12 text-center text-white/30">
                <Loader2 size={24} className="animate-spin text-brand-purple" />
                <p className="text-xs font-semibold">Waiting for problem loading...</p>
              </div>
            )}

            {problem && (
              <div className="p-5 flex flex-col gap-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`text-[0.55rem] font-bold px-2 py-0.5 border rounded-full ${DIFF_COLOR[problem.difficulty] || ''}`}>{problem.difficulty}</span>
                    <span className="text-[0.55rem] font-bold px-2 py-0.5 bg-brand-purple/10 border border-brand-purple/20 text-brand-violet rounded-full">{problem.topic}</span>
                  </div>
                  <h2 className="text-lg font-black tracking-tight text-white/90">{problem.title}</h2>
                </div>

                <div className="text-xs text-white/50 leading-relaxed font-normal whitespace-pre-wrap">
                  {problem.description}
                </div>

                {/* Examples */}
                <div>
                  <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-white/30 mb-2.5">Sample Examples</p>
                  <div className="flex flex-col gap-2">
                    {(problem.examples ?? []).map((ex, i) => (
                      <div key={i} className="bg-bg-panel border border-white/[0.04] rounded-xl p-3.5 text-[0.7rem] leading-relaxed">
                        <div className="font-bold text-white/40 mb-1.5">Example {i + 1}</div>
                        <div><span className="text-white/20 font-mono-code">Input: </span><code className="font-mono-code text-brand-cyan">{ex.input}</code></div>
                        <div><span className="text-white/20 font-mono-code">Output: </span><code className="font-mono-code text-brand-green">{ex.output}</code></div>
                        {ex.explain && <div className="text-white/30 mt-1.5 italic font-sans text-[0.65rem]">Explanation: {ex.explain}</div>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Constraints */}
                {problem.constraints && (
                  <div>
                    <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-white/30 mb-2">Constraints</p>
                    <ul className="list-disc list-inside space-y-1 text-white/40 text-[0.65rem]">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="font-mono-code bg-white/[0.01] px-1 py-0.5 rounded border border-white/[0.02] inline-block">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </aside>
        )}

        {/* Right Workspace Panel (Editor + Bottom console drawer) */}
        <main className="flex flex-col flex-1 overflow-hidden bg-bg-panel relative">
          
          {/* Language Selector Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-bg-panel border-b border-white/[0.04] flex-shrink-0">
            <div className="flex items-center gap-2">
              <Code2 size={13} className="text-brand-purple" />
              <span className="text-[0.65rem] font-mono-code text-white/40">solution.code</span>
            </div>
            
            <div className="relative flex items-center">
              <select
                id="language-select"
                value={lang}
                onChange={e => handleLangChange(e.target.value)}
                className="appearance-none bg-bg-panel border border-white/[0.05] rounded-lg text-white/70 font-mono-code text-[0.65rem] py-1 pl-3 pr-8 cursor-pointer outline-none hover:border-white/15 focus:border-brand-purple/40"
              >
                <optgroup label="Scripting">
                  {LANGUAGES.filter(l => ['javascript','typescript','python','ruby','php','bash'].includes(l.id)).map(l => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Systems">
                  {LANGUAGES.filter(l => ['c','cpp','java','csharp','go','rust','swift','kotlin','scala'].includes(l.id)).map(l => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown size={10} className="absolute right-2.5 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              language={LANGUAGES.find(l => l.id === lang)?.monacoLang ?? 'javascript'}
              value={code}
              onChange={(val) => setCode(val ?? '')}
              onMount={(editor) => { editorRef.current = editor; }}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 12, bottom: 12 },
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true },
                readOnly: submitted,
                backgroundColor: '#08080f',
              }}
            />
          </div>

          {/* ── COLLAPSIBLE BOTTOM CONSOLE DRAWER ── */}
          <div className={`flex flex-col border-t border-white/[0.05] bg-bg-panel transition-all duration-300 z-10 ${
            consoleOpen ? 'h-[250px]' : 'h-8'
          }`}>
            {/* Console header / Toggle trigger */}
            <div 
              onClick={() => setConsoleOpen(!consoleOpen)}
              className="flex items-center justify-between px-4 py-1 bg-bg-panel border-b border-white/[0.03] cursor-pointer select-none hover:bg-white/[0.01]"
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-[0.6rem] font-bold text-white/40 uppercase tracking-widest">
                  <Terminal size={11} /> Console Drawer
                </span>
                
                {consoleOpen && (
                  <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => setConsoleTab('tests')}
                      className={`text-[0.6rem] font-extrabold uppercase px-2 py-0.5 rounded transition-all ${
                        consoleTab === 'tests' ? 'text-brand-violet bg-brand-purple/10' : 'text-white/35 hover:text-white/60'
                      }`}
                    >
                      Run Results
                    </button>
                    <button 
                      onClick={() => setConsoleTab('output')}
                      className={`text-[0.6rem] font-extrabold uppercase px-2 py-0.5 rounded transition-all ${
                        consoleTab === 'output' ? 'text-brand-violet bg-brand-purple/10' : 'text-white/35 hover:text-white/60'
                      }`}
                    >
                      Logs / Stdout
                    </button>
                  </div>
                )}
              </div>

              <div>
                {consoleOpen ? <ChevronDown size={13} className="text-white/40" /> : <ChevronUp size={13} className="text-white/40 animate-bounce" />}
              </div>
            </div>

            {/* Console body content */}
            {consoleOpen && (
              <div className="flex-1 overflow-y-auto p-4 text-xs font-mono-code">
                {submitError && (
                  <div className="flex items-start gap-2 bg-brand-red/5 border border-brand-red/25 rounded-xl p-3 text-brand-red">
                    <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {!submitError && isRunning && (
                  <div className="flex flex-col items-center justify-center gap-2 h-full py-8 text-white/30">
                    <Loader2 size={20} className="animate-spin text-brand-purple" />
                    <span className="text-[0.65rem] uppercase tracking-wider font-bold">Compiling &amp; Judging Code...</span>
                  </div>
                )}

                {!submitError && !isRunning && consoleTab === 'tests' && (
                  <div>
                    {!testResults ? (
                      <div className="text-center py-8 text-white/20">
                        <span>Execute code run to check sample test assertions.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {testResults.map((r, i) => (
                          <div key={i} className={`rounded-lg border bg-[#05050a]/60 ${
                            r.passed ? 'border-brand-green/20' : 'border-brand-red/20'
                          }`}>
                            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.02] text-[0.65rem] font-bold">
                              <span className="flex items-center gap-1.5">
                                {r.passed ? <CheckCircle size={12} className="text-brand-green" /> : <XCircle size={12} className="text-brand-red" />}
                                <span>{r.label}</span>
                              </span>
                              <span className="text-white/20">{r.time}</span>
                            </div>
                            <div className="p-3 text-[0.65rem] space-y-1">
                              <div><span className="text-white/20">Input: </span><code className="text-white/60">{r.input}</code></div>
                              <div><span className="text-white/20">Expected: </span><code className="text-white/60">{r.expected}</code></div>
                              <div><span className="text-white/20">Returned: </span><code className={r.passed ? 'text-brand-green' : 'text-brand-red'}>{r.got}</code></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!submitError && !isRunning && consoleTab === 'output' && (
                  <div className="text-white/40 p-2 text-[0.65rem] bg-[#05050a]/40 border border-white/[0.03] rounded-lg min-h-24">
                    <code>
                      Stdout logs empty.<br />
                      --- Compilation Succeeded ---<br />
                      All symbols compiled successfully under standard settings.
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

    </div>
  );
}
