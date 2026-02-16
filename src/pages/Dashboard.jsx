import React from 'react';
import {
    Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

const skillData = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

const Dashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Overall Readiness Score */}
                <Card className="flex flex-col items-center justify-center p-8 bg-white">
                    <CardHeader className="text-center pb-2">
                        <CardTitle>Overall Readiness</CardTitle>
                        <CardDescription>Your current placement preparedness</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center pt-4">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-gray-100"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 80}
                                    strokeDashoffset={2 * Math.PI * 80 * (1 - 72 / 100)}
                                    strokeLinecap="round"
                                    className="text-primary transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-5xl font-bold text-gray-900">72</span>
                                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">Readiness Score</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skill Breakdown Radar Chart */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Skill Breakdown</CardTitle>
                        <CardDescription>Performance across key assessment areas</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
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

                {/* Continue Practice */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Continue Practice</CardTitle>
                        <CardDescription>Pick up where you left off</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h4 className="font-semibold text-lg text-gray-900">Dynamic Programming</h4>
                                <p className="text-sm text-gray-500">Advanced Algorithms Path</p>
                            </div>
                            <span className="text-sm font-medium text-primary">3/10 completed</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-500"
                                style={{ width: '30%' }}
                            />
                        </div>
                        <button className="w-full py-3 bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all">
                            Continue <ChevronRight size={18} />
                        </button>
                    </CardContent>
                </Card>

                {/* Weekly Goals */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Weekly Goals</CardTitle>
                        <CardDescription>Your activity this week</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">Problems Solved</span>
                                <span className="text-gray-500">12/20 this week</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all duration-500"
                                    style={{ width: '60%' }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className={`w-8 h-8 flex items-center justify-center border ${i < 4 ? 'bg-primary text-white border-primary' : 'bg-transparent text-gray-400 border-gray-100'}`}>
                                        <span className="text-[10px] font-bold">{day}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Assessments */}
                <Card className="bg-white lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Upcoming Assessments</CardTitle>
                        <CardDescription>Scheduled tests and interview reviews</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {[
                                { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM', icon: <Clock className="text-primary" size={20} /> },
                                { title: 'System Design Review', time: 'Wed, 2:00 PM', icon: <Calendar className="text-primary" size={20} /> },
                                { title: 'HR Interview Prep', time: 'Friday, 11:00 AM', icon: <Clock className="text-primary" size={20} /> },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 flex items-center justify-center bg-gray-50">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900">{item.title}</h5>
                                            <p className="text-sm text-gray-500">{item.time}</p>
                                        </div>
                                    </div>
                                    <button className="text-sm font-medium text-primary hover:underline">Remind Me</button>
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
