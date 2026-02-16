import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getHistory, updateAnalysisById } from '../utils/analyzer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { CheckCircle, Clock, ListChecks, HelpCircle, ChevronLeft, Download, Copy, Check } from 'lucide-react';

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
            // Initialize skillConfidenceMap if missing
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

        // Recalculate Score
        // Start with the raw base score from the first analysis
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

CHECKLIST:
${data.checklist.map(c => `${c.round}:\n${c.items.map(i => `- ${i}`).join('\n')}`).join('\n')}

QUESTIONS:
${data.questions.map((q, i) => `Q${i + 1}: ${q}`).join('\n')}
    `;
        const element = document.createElement("a");
        const file = new Blob([content], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `preparation-plan-${data.company}.txt`;
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
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 transition-colors">
                        <ChevronLeft />
                    </button>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">{data.company}</h1>
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
                {/* Extracted Skills with Toggle */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Skills Extracted</CardTitle>
                            <CardDescription>Click to toggle confidence and update score</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(data.extractedSkills).map(([category, skills]) => (
                            <div key={category}>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{category}</h4>
                                <div className="flex flex-wrap gap-3">
                                    {skills.map(skill => {
                                        const isKnown = (data.skillConfidenceMap?.[skill] || 'practice') === 'know';
                                        return (
                                            <button
                                                key={skill}
                                                onClick={() => toggleSkill(skill)}
                                                className={`px-4 py-2 border text-sm font-semibold transition-all flex items-center gap-2 ${isKnown
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white text-gray-500 border-gray-200 hover:border-primary/30'
                                                    }`}
                                            >
                                                {isKnown && <Check size={14} />}
                                                {skill}
                                                <span className="text-[8px] opacity-60 ml-1">
                                                    {isKnown ? 'KNOW' : 'NEED PRACTICE'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 7-Day Plan */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="text-primary" size={20} /> 7-Day Plan
                        </CardTitle>
                        <button
                            onClick={() => handleCopy(data.plan.map(p => `${p.days}: ${p.task}`).join('\n'), 'plan')}
                            className="text-gray-400 hover:text-primary transition-colors"
                        >
                            {copiedSection === 'plan' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.plan.map((item, i) => (
                            <div key={i} className="flex gap-4 border-l-2 border-primary/20 pl-4 py-1">
                                <div className="flex-shrink-0 w-14 text-[10px] font-bold text-primary uppercase">{item.days}</div>
                                <p className="text-xs leading-relaxed text-gray-600">{item.task}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Round-wise Checklist */}
                <Card className="lg:col-span-1 border-t-4 border-t-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ListChecks className="text-primary" size={20} /> Rounds
                        </CardTitle>
                        <button
                            onClick={() => handleCopy(data.checklist.map(c => `${c.round}: ${c.items.join(', ')}`).join('\n'), 'checklist')}
                            className="text-gray-400 hover:text-primary transition-colors"
                        >
                            {copiedSection === 'checklist' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {data.checklist.map((round, i) => (
                            <div key={i}>
                                <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-tight">{round.round}</h4>
                                <div className="space-y-1">
                                    {round.items.map((item, j) => (
                                        <div key={j} className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-1 h-1 bg-primary rounded-full" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Interview Questions */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 text-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <HelpCircle className="text-primary" size={20} /> Potential Questions
                        </CardTitle>
                        <button
                            onClick={() => handleCopy(data.questions.map((q, i) => `Q${i + 1}: ${q}`).join('\n'), 'questions')}
                            className="text-gray-400 hover:text-primary transition-colors"
                        >
                            {copiedSection === 'questions' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {data.questions.map((q, i) => (
                                <div key={i} className="p-5 text-gray-600 text-sm flex gap-4 hover:bg-gray-50 transition-colors">
                                    <span className="font-serif font-bold text-primary opacity-50">{String(i + 1).padStart(2, '0')}</span>
                                    {q}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Next Box */}
            <div className="mt-12 p-8 bg-white border border-primary/20 border-l-8 border-l-primary flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">Recommended Next Action</h3>
                    {weakSkills.length > 0 ? (
                        <p className="text-gray-600">
                            Focus on mastering <span className="font-bold text-primary">{weakSkills.join(', ')}</span>.
                        </p>
                    ) : (
                        <p className="text-gray-600">You're feeling confident! Keep polishing your system design.</p>
                    )}
                </div>
                <div className="text-center md:text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 underline decoration-primary/30">Start Day 1 plan now.</p>
                    <div className="text-2xl font-serif font-bold text-primary">{data.readinessScore}% Readiness</div>
                </div>
            </div>
        </div>
    );
};

export default Results;
