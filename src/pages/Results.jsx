import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getHistory, updateAnalysisById, CATEGORY_LABELS } from '../utils/analyzer';
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

        const updated = updateAnalysisById(data.id, {
            skillConfidenceMap: newMap
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
Readiness Score: ${data.finalScore}%

7-DAY PLAN:
${data.plan7Days?.map(p => `${p.day} (${p.focus}): ${p.tasks.join(', ')}`).join('\n')}

ROUND MAPPING:
${data.roundMapping?.map(r => `${r.roundTitle}: ${r.whyItMatters}`).join('\n') || 'N/A'}

QUESTIONS:
${data.questions.map((q, i) => `Q${i + 1}: ${q}`).join('\n')}
    `;
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `prep-plan-${data.company || 'results'}.txt`;
        document.body.appendChild(element);
        element.click();
    };

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center p-20">
                <p className="text-gray-500 mb-4 text-center">No analysis data found or data might be corrupted.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Start Analysis</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 transition-colors">
                        <ChevronLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">{data.company || 'Direct Opportunity'}</h1>
                        <p className="text-gray-500">{data.role || 'Unspecified Role'} • Readiness: <span className="text-primary font-bold">{data.finalScore}%</span></p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={downloadTxt} className="btn btn-secondary flex items-center gap-2 py-2 text-xs">
                        <Download size={14} /> Download TXT
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {data.companyIntel && (
                    <Card className="lg:col-span-1 border-l-4 border-l-primary/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building2 className="text-primary" size={20} /> Company Intel
                            </CardTitle>
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
                                <p className="text-[10px] uppercase font-bold text-primary mb-1">Hiring Focus</p>
                                <p className="text-xs text-gray-600 italic">"{data.companyIntel.focus}"</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Map className="text-primary" size={20} /> Expected Hiring Workflow
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:to-transparent">
                            {data.roundMapping?.map((round, idx) => (
                                <div key={idx} className="relative flex items-start gap-6 group">
                                    <div className="absolute left-0 w-10 h-10 flex items-center justify-center bg-white border-2 border-primary/20 rounded-full z-10">
                                        <span className="text-[10px] font-bold text-primary">{idx + 1}</span>
                                    </div>
                                    <div className="ml-12 pt-0.5">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                            <h4 className="text-sm font-bold text-gray-900">{round.roundTitle}</h4>
                                            <span className="text-[10px] uppercase font-bold text-primary bg-primary/5 px-2 py-0.5">Focus: {round.focusAreas?.join(', ')}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed italic">{round.whyItMatters}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Skills Found & Assessment</CardTitle>
                        <CardDescription>Update your confidence per skill to recalibrate readiness score</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(data.extractedSkills).map(([category, skills]) => skills.length > 0 && (
                            <div key={category}>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{CATEGORY_LABELS[category] || category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => {
                                        const isKnown = (data.skillConfidenceMap?.[skill] || 'practice') === 'know';
                                        return (
                                            <button
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                className={`px-3 py-1.5 border transition-all flex items-center gap-2 ${isKnown
                                                        ? 'bg-primary text-white border-primary shadow-sm'
                                                        : 'bg-white text-gray-500 border-gray-100 hover:border-primary/20'
                                                    }`}
                                            >
                                                {isKnown ? <Check size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />}
                                                <span className="text-xs font-semibold">{skill}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1 border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="text-primary" size={20} /> 7-Day Strategy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        {data.plan7Days?.map((item, i) => (
                            <div key={i} className="space-y-2 border-l border-primary/20 pl-4 relative">
                                <div className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-primary/30" />
                                <div className="text-[10px] font-bold text-primary uppercase">{item.day} • {item.focus}</div>
                                <ul className="space-y-1">
                                    {item.tasks.map((task, j) => (
                                        <li key={j} className="text-[11px] text-gray-500 leading-tight flex items-start gap-1">
                                            <span className="text-primary/50 mt-0.5">•</span> {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <HelpCircle className="text-primary" size={20} /> Interview Prep Bank
                        </CardTitle>
                        <button
                            onClick={() => handleCopy(data.questions.map((q, i) => `Q${i + 1}: ${q}`).join('\n'), 'questions')}
                            className="text-gray-400 hover:text-primary transition-colors"
                        >
                            {copiedSection === 'questions' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2">
                        {data.questions.map((q, i) => (
                            <div key={i} className="p-5 border-b border-r border-gray-50 text-gray-600 text-[13px] flex gap-4 hover:bg-gray-50/50 transition-colors">
                                <span className="font-serif font-bold text-primary opacity-30 text-lg leading-none">{i + 1}</span>
                                <p>{q}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="p-8 bg-white border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="max-w-xl">
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">Preparation Priority</h3>
                        {weakSkills.length > 0 ? (
                            <p className="text-gray-500 text-sm">
                                Mastering these areas is critical for your current profile: <span className="font-bold text-primary">{weakSkills.join(', ')}</span>. Recommended to start Day 1 review now.
                            </p>
                        ) : (
                            <p className="text-gray-500 text-sm">Full competence verified. Concentrate on scenario-based responses and behavioral questions.</p>
                        )}
                    </div>
                    <div className="flex flex-col items-center md:items-end">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Prep Score</span>
                        <div className="text-5xl font-serif font-bold text-primary">{data.finalScore}%</div>
                        <p className="text-[10px] text-gray-400 mt-2">Last updated: {new Date(data.updatedAt).toLocaleTimeString()}</p>
                    </div>
                </div>
                <p className="text-center text-[9px] text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Info size={12} /> Data model v1.2 hardened • Offline analysis active • Last sync: {new Date(data.updatedAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    );
};

export default Results;
