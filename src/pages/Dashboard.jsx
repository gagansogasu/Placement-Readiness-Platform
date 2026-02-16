import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { Calendar, ChevronRight, Clock, Search, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { analyzeJD, saveAnalysis } from '../utils/analyzer';

const skillData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        jd: ''
    });
    const [analyzing, setAnalyzing] = useState(false);

    const handleAnalyze = (e) => {
        e.preventDefault();
        if (!formData.jd) return;

        setAnalyzing(true);
        // Simulate some logic delay for "premium" feel
        setTimeout(() => {
            const results = analyzeJD(formData.company, formData.role, formData.jd);
            saveAnalysis(results);
            setAnalyzing(false);
            navigate(`/results/${results.id}`);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Premium Analysis</h1>
                    <p className="text-gray-500">Analyze job descriptions to generate a custom 7-day preparation roadmap.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Analysis Form - 2/3 width */}
                <Card className="lg:col-span-2 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="text-primary" size={24} /> New Job Analysis
                        </CardTitle>
                        <CardDescription>Enter details to get a personalized preparation strategy.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAnalyze} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-widest text-gray-400">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google, Meta, StartupX"
                                        className="w-full text-lg p-4 bg-gray-50 border border-gray-100 focus:border-primary outline-none transition-all"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold uppercase tracking-widest text-gray-400">Role Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Software Engineer"
                                        className="w-full text-lg p-4 bg-gray-50 border border-gray-100 focus:border-primary outline-none transition-all"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold uppercase tracking-widest text-gray-400">Job Description (Paste Text)</label>
                                <textarea
                                    rows="10"
                                    placeholder="Paste the full job description here..."
                                    className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-primary outline-none transition-all resize-none"
                                    value={formData.jd}
                                    required
                                    onChange={(e) => setFormData({ ...formData, jd: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={analyzing}
                                className="w-full bg-primary text-white py-4 font-bold text-lg flex items-center justify-center gap-3 transition-all hover:bg-opacity-90 disabled:opacity-50"
                            >
                                {analyzing ? (
                                    <>
                                        <Cpu className="animate-spin" /> Analyzing Requirements...
                                    </>
                                ) : (
                                    <>START ANALYSIS</>
                                )}
                            </button>
                        </form>
                    </CardContent>
                </Card>

                {/* Sidebar Stats */}
                <aside className="space-y-8">
                    {/* Readiness Score */}
                    <Card className="flex flex-col items-center justify-center p-8 bg-white overflow-hidden">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="10" fill="transparent" />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="hsl(245, 58%, 51%)"
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 70}
                                    strokeDashoffset={2 * Math.PI * 70 * (1 - 72 / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-gray-900">72</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Avg readiness</span>
                            </div>
                        </div>
                        <CardHeader className="text-center p-0 mt-4">
                            <CardTitle className="text-lg">Overall Profile</CardTitle>
                        </CardHeader>
                    </Card>

                    {/* Quick Stats Card */}
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Platform Usage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-500">History Entries</span>
                                <span className="font-bold">14</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-500">Avg Skill Match</span>
                                <span className="font-bold text-primary">68%</span>
                            </div>
                            <button
                                onClick={() => navigate('/history')}
                                className="w-full text-xs font-bold text-primary flex items-center justify-center gap-1 mt-2 uppercase tracking-widest"
                            >
                                View full history <ChevronRight size={14} />
                            </button>
                        </CardContent>
                    </Card>
                </aside>

                {/* Previous Skill Breakdown (Moved down) */}
                <Card className="bg-white lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Current Benchmarks</CardTitle>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Skills"
                                    dataKey="A"
                                    stroke="hsl(245, 58%, 51%)"
                                    fill="hsl(245, 58%, 51%)"
                                    fillOpacity={0.6}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Weekly Goals */}
                <Card className="bg-white lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">Platform Engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-12">
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Problems Solved</span>
                                <span className="text-gray-500">12/20 this week</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2">
                                <div className="bg-primary h-full" style={{ width: '60%' }} />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <div key={i} className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold border ${i < 4 ? 'bg-primary text-white border-primary' : 'text-gray-300 border-gray-100'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default Dashboard;
