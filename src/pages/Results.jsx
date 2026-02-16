import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getHistory, updateAnalysisById } from '../utils/analyzer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import {
    CheckCircle, Clock, ListChecks, HelpCircle,
    ChevronLeft, Download, Copy, Check,
    Building2, Map, Info, Factory
} from 'lucide-react';

const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [copiedSection, setCopiedSection] = useState(null);

    useEffect(() => {
        let currentData = null;
        if (id) {
            currentData = getAnalysisById(id);
        } else {
            const history = getHistory();
            if (history.length > 0) currentData = history[0];
        }

        if (currentData) {
            if (!currentData.skillConfidenceMap) {
                currentData.skillConfidenceMap = {};
            }
            setData(currentData);
        }
    }, [id]);

    const toggleSkill = (skill) => {
        if (!data) return;

        const currentConfidence = data.skillConfidenceMap?.[skill] || 'practice';
        const newConfidence = currentConfidence === 'know' ? 'practice' : 'know';

        const newMap = {
            ...(data.skillConfidenceMap || {}),
            [skill]: newConfidence
        };

        let score = data.baseReadinessScore || data.readinessScore;
        if (!data.baseReadinessScore) {
            data.baseReadinessScore = data.readinessScore;
        }

        const allSkills = Object.values(data.extractedSkills).flat();
        allSkills.forEach(s => {
            if (newMap[s] === 'know') score += 2;
            else score -= 2;
        });

        const finalScore = Math.min(Math.max(score, 0), 100);

        const updated = updateAnalysisById(data.id, {
            skillConfidenceMap: newMap,
            readinessScore: finalScore,
            baseReadinessScore: data.baseReadinessScore
        });

        setData(updated);
    };

    const weakSkills = useMemo(() => {
        if (!data) return [];
        const all = Object.values(data.extractedSkills).flat();
        return all.filter(s => (data.skillConfidenceMap?.[s] || 'practice') === 'practice').slice(0, 3);
    }, [data]);

    const handleCopy = (text, section) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const downloadTxt = () => {
        if (!data) return;
        const content = `
PREPARATION PLAN: ${data.company} - ${data.role}
Readiness Score: ${data.readinessScore}%

7-DAY PLAN:
${data.plan.map(p => `${p.days}: ${p.task}`).join('\n')}

ROUND MAPPING:
${data.roundMapping?.map(r => `${r.title} (${r.focus}): ${r.why}`).join('\n') || 'N/A'}

QUESTIONS:
${data.questions.map((q, i) => `Q${i + 1}: ${q}`).join('\n')}
    `;
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `preparation-plan-${data.company || 'results'}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center p-20">
                <p className="text-gray-500 mb-4">No analysis data found.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Start Analysis</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 transition-colors">
                        <ChevronLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">{data.company || 'Unknown Company'}</h1>
                        <p className="text-gray-500">{data.role} • Score: <span className="text-primary font-bold">{data.readinessScore}%</span></p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={downloadTxt} className="btn btn-secondary flex items-center gap-2 py-2 text-xs">
                        <Download size={14} /> Download TXT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Company Intel - New Section */}
                {data.companyIntel && (
                    <Card className="lg:col-span-1 border-l-4 border-l-primary/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building2 className="text-primary" size={20} /> Company Intel
                            </CardTitle>
                            <CardDescription>Generated based on industry profile</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Factory size={16} className="mt-1 text-gray-400" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Industry</p>
                                    <p className="text-sm font-medium">{data.companyIntel.industry}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Building2 size={16} className="mt-1 text-gray-400" />
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Scale</p>
                                    <p className="text-sm font-medium">{data.companyIntel.size}</p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-100">
                                <p className="text-[10px] uppercase font-bold text-primary mb-1">Typical Hiring Focus</p>
                                <p className="text-xs text-gray-600 italic">"{data.companyIntel.focus}"</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Round Mapping - New Section */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Map className="text-primary" size={20} /> Interview Round Mapping
                        </CardTitle>
                        <CardDescription>Visualizing the expected interview flow</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
                            {data.roundMapping?.map((round, idx) => (
                                <div key={idx} className="relative flex items-start gap-6 group">
                                    <div className="absolute left-0 w-10 h-10 flex items-center justify-center bg-white border-2 border-primary/20 rounded-full group-hover:border-primary transition-colors z-10">
                                        <span className="text-[10px] font-bold text-primary">{idx + 1}</span>
                                    </div>
                                    <div className="ml-12 pt-0.5">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-gray-900">{round.title}</h4>
                                            <span className="hidden sm:inline text-gray-300">•</span>
                                            <span className="text-[10px] uppercase font-bold text-primary bg-primary/5 px-2 py-0.5">Focus: {round.focus}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed max-w-md italic">
                                            {round.why}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Confidence Section (Refined Toggles) */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Skills Found & Analysis</CardTitle>
                        <CardDescription>Toggle confidence to update readiness score in real-time</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(data.extractedSkills).map(([category, skills]) => (
                            <div key={category}>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => {
                                        const isKnown = (data.skillConfidenceMap?.[skill] || 'practice') === 'know';
                                        return (
                                            <button
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                className={`group px-3 py-1.5 border transition-all flex items-center gap-2 ${isKnown
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white text-gray-500 border-gray-100 hover:border-primary/20'
                                                    }`}
                                            >
                                                {isKnown ? <Check size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-primary/40" />}
                                                <span className="text-xs font-semibold">{skill}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 7-Day Plan (Right Sidebar) */}
                <Card className="lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="text-primary" size={20} /> 7-Day Plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        {data.plan.map((item, i) => (
                            <div key={i} className="flex gap-4 border-l border-primary/20 pl-4 relative group">
                                <div className="absolute -left-1 top-2 w-2 h-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                                <div className="flex-shrink-0 w-12 text-[10px] font-bold text-primary uppercase pt-0.5">{item.days}</div>
                                <p className="text-[11px] leading-relaxed text-gray-600">{item.task}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Interview Questions */}
                <Card className="lg:col-span-3">
                    <CardHeader className="border-b border-gray-50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <HelpCircle className="text-primary" size={20} /> Potential Questions
                        </CardTitle>
                        <CardDescription>Likely questions based on the role and skills detected</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2">
                        {data.questions.map((q, i) => (
                            <div key={i} className="p-5 border-b border-r border-gray-50 text-gray-600 text-xs flex gap-4 hover:bg-gray-50/50 transition-colors">
                                <span className="font-serif font-bold text-primary opacity-30 text-base">{String(i + 1).padStart(2, '0')}</span>
                                <p className="pt-1">{q}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Action Next Box & Disclaimer */}
            <div className="space-y-4">
                <div className="p-8 bg-white border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">Recommended Next Action</h3>
                        {weakSkills.length > 0 ? (
                            <p className="text-gray-500 text-sm">
                                Prioritize mastering <span className="font-bold text-primary underline underline-offset-4 decoration-primary/20">{weakSkills.join(', ')}</span>.
                            </p>
                        ) : (
                            <p className="text-gray-500 text-sm">You've cleared the detected skill gaps. Focus on mock interviews!</p>
                        )}
                    </div>
                    <div className="flex flex-col items-center md:items-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Final Readiness</span>
                        <div className="text-4xl font-serif font-bold text-primary">{data.readinessScore}%</div>
                    </div>
                </div>
                <p className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1 uppercase tracking-widest">
                    <Info size={10} /> Demo Mode: Company intel generated heuristically.
                </p>
            </div>
        </div>
    );
};

export default Results;
