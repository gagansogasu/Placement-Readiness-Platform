import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { CheckCircle2, Globe, Github, Link as LinkIcon, Copy, Check, Info, ShieldCheck } from 'lucide-react';

const STEPS = [
    "Foundation & Design System",
    "React & Tailwind Architecture",
    "Premium Landing Page",
    "Interactive Dashboard",
    "JD Analysis Engine (Heuristic)",
    "Real-time Score Recalibration",
    "Company Intel & Round Mapping",
    "Testing Protocols & Ship Lock"
];

const Proof = () => {
    const [links, setLinks] = useState({ lovable: '', github: '', deploy: '' });
    const [stepStates, setStepStates] = useState(new Array(8).fill(false));
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const savedSubmission = JSON.parse(localStorage.getItem('prp_final_submission') || '{}');
        if (savedSubmission.links) setLinks(savedSubmission.links);
        if (savedSubmission.stepStates) setStepStates(savedSubmission.stepStates);
    }, []);

    const saveState = (newLinks, newSteps) => {
        localStorage.setItem('prp_final_submission', JSON.stringify({
            links: newLinks,
            stepStates: newSteps,
            updatedAt: new Date().toISOString()
        }));
    };

    const updateLink = (key, value) => {
        const newLinks = { ...links, [key]: value };
        setLinks(newLinks);
        saveState(newLinks, stepStates);
    };

    const toggleStep = (index) => {
        const newSteps = [...stepStates];
        newSteps[index] = !newSteps[index];
        setStepStates(newSteps);
        saveState(links, newSteps);
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return url.length > 5;
        } catch {
            return false;
        }
    };

    const allLinksProvided = isValidUrl(links.lovable) && isValidUrl(links.github) && isValidUrl(links.deploy);
    const allStepsDone = stepStates.every(s => s);

    const testChecks = JSON.parse(localStorage.getItem('prp_test_checks') || '{}');
    const allTestsPassed = Object.values(testChecks).filter(Boolean).length === 10;

    const isShipped = allLinksProvided && allStepsDone && allTestsPassed;

    const handleCopyExport = () => {
        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
    `.trim();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Proof of Work</h1>
                    <p className="text-gray-500">Document your build path and verify final artifacts.</p>
                </div>
                <div className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border-2 ${isShipped ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                    {isShipped ? 'Status: Shipped' : 'Status: In Progress'}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Step Completion Overview */}
                <Card className="bg-white lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Build Milestone Overview</CardTitle>
                        <CardDescription>Verify each phase of development</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {STEPS.map((step, i) => (
                            <button
                                key={i}
                                onClick={() => toggleStep(i)}
                                className={`w-full flex items-center justify-between p-3 border transition-all ${stepStates[i] ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-gray-50 border-gray-100 text-gray-400'
                                    }`}
                            >
                                <span className="text-xs font-bold uppercase tracking-tighter">{step}</span>
                                {stepStates[i] ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border border-gray-200" />}
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Artifact Inputs */}
                <div className="space-y-6">
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Deployment Artifacts</CardTitle>
                            <CardDescription>Required for final submission protocol</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                    <LinkIcon size={12} /> Lovable Project URL
                                </label>
                                <input
                                    type="url"
                                    className={`w-full p-2 text-sm border bg-gray-50 outline-none ${isValidUrl(links.lovable) ? 'border-green-200' : 'border-gray-100 focus:border-primary'}`}
                                    placeholder="https://lovable.dev/projects/..."
                                    value={links.lovable}
                                    onChange={(e) => updateLink('lovable', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                    <Github size={12} /> GitHub Repository
                                </label>
                                <input
                                    type="url"
                                    className={`w-full p-2 text-sm border bg-gray-50 outline-none ${isValidUrl(links.github) ? 'border-green-200' : 'border-gray-100 focus:border-primary'}`}
                                    placeholder="https://github.com/..."
                                    value={links.github}
                                    onChange={(e) => updateLink('github', e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                                    <Globe size={12} /> Live Deployment
                                </label>
                                <input
                                    type="url"
                                    className={`w-full p-2 text-sm border bg-gray-50 outline-none ${isValidUrl(links.deploy) ? 'border-green-200' : 'border-gray-100 focus:border-primary'}`}
                                    placeholder="https://project.vercel.app"
                                    value={links.deploy}
                                    onChange={(e) => updateLink('deploy', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <button
                        onClick={allLinksProvided ? handleCopyExport : null}
                        disabled={!allLinksProvided}
                        className={`w-full py-4 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${allLinksProvided ? 'bg-primary text-white hover:bg-opacity-90' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        Copy Final Submission
                    </button>
                </div>
            </div>

            {/* Final Shipped Section */}
            {isShipped ? (
                <div className="bg-green-600 p-12 text-white border-8 border-green-700/50 text-center animate-in slide-in-from-bottom-5 duration-1000">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <ShieldCheck size={64} className="mx-auto mb-4" />
                        <h2 className="text-4xl font-serif font-bold">You built a real product.</h2>
                        <p className="text-xl font-medium opacity-90 italic">
                            "Not a tutorial. Not a clone. A structured tool that solves a real problem."
                        </p>
                        <div className="h-px bg-white/20 w-32 mx-auto" />
                        <p className="text-sm font-bold tracking-[.3em] uppercase">This is your proof of work.</p>
                    </div>
                </div>
            ) : (
                <div className="p-8 bg-white border border-dashed border-gray-300 text-center space-y-4">
                    <p className="text-sm text-gray-400 font-medium">To trigger SHIPPED status, ensure:</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <StatusIcon active={allStepsDone} label="8 Steps Complete" />
                        <StatusIcon active={allTestsPassed} label="10/10 Tests Passed" />
                        <StatusIcon active={allLinksProvided} label="3 Artifact Links" />
                    </div>
                </div>
            )}

            <p className="text-center text-[9px] text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Info size={10} /> Submission protocol v1.0 • verified build state • persistent proof
            </p>
        </div>
    );
};

const StatusIcon = ({ active, label }) => (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${active ? 'text-green-600' : 'text-gray-300'}`}>
        {active ? <CheckCircle2 size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-200" />}
        {label}
    </div>
);

export default Proof;
