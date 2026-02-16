import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../utils/analyzer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Calendar, ChevronRight, Briefcase } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Analysis History</h1>
                    <p className="text-gray-500">View and revisit your past job preparation plans.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {history.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <p className="text-gray-500">No history found. Start by analyzing a Job Description!</p>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="mt-4 px-6 py-2 bg-primary text-white font-semibold"
                            >
                                Go to Dashboard
                            </button>
                        </CardContent>
                    </Card>
                ) : (
                    history.map((entry) => (
                        <Card
                            key={entry.id}
                            className="hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/results/${entry.id}`)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary">
                                            <Briefcase size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-serif font-bold text-gray-900">{entry.company}</h3>
                                            <p className="text-gray-500 text-sm">{entry.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-medium text-gray-900">Readiness Score</p>
                                            <p className="text-xl font-bold text-primary">{entry.readinessScore}%</p>
                                        </div>
                                        <div className="text-right text-gray-400">
                                            <div className="flex items-center gap-1 text-xs mb-1">
                                                <Calendar size={12} />
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </div>
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default History;
