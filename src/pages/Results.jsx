import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysisById, getHistory } from '../utils/analyzer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { CheckCircle, Clock, ListChecks, HelpCircle, ChevronLeft } from 'lucide-react';

const Results = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        if (id) {
            setData(getAnalysisById(id));
        } else {
            const history = getHistory();
            if (history.length > 0) setData(history[0]);
        }
    }, [id]);

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center p-20">
                <p className="text-gray-500 mb-4">No analysis data found.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Start Analysis</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 transition-colors">
                    <ChevronLeft />
                </button>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">{data.company}</h1>
                    <p className="text-gray-500">{data.role} • Readiness Score: <span className="text-primary font-bold">{data.readinessScore}%</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Extracted Skills */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Extracted Skills</CardTitle>
                        <CardDescription>Target technologies and core competencies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Object.entries(data.extractedSkills).map(([category, skills]) => (
                            <div key={category}>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">{category}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 7-Day Plan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="text-primary" size={24} /> 7-Day Plan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {data.plan.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex-shrink-0 w-16 text-xs font-bold text-primary pt-1">{item.days}</div>
                                <p className="text-sm text-gray-600">{item.task}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Round-wise Checklist */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ListChecks className="text-primary" size={24} /> Preparation Checklist
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {data.checklist.map((round, i) => (
                            <div key={i}>
                                <h4 className="text-sm font-bold text-gray-900 mb-3">{round.round}</h4>
                                <div className="space-y-2">
                                    {round.items.map((item, j) => (
                                        <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle size={14} className="text-gray-300" /> {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Interview Questions */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="text-primary" size={24} /> Predicted Interview Questions
                        </CardTitle>
                        <CardDescription>Based on detected skills and historical patterns</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {data.questions.map((q, i) => (
                                <div key={i} className="p-6 text-gray-700 text-sm flex gap-4">
                                    <span className="font-serif font-bold text-primary">Q{i + 1}.</span>
                                    {q}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Results;
