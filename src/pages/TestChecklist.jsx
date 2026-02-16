import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Check, AlertCircle, Info, RotateCcw } from 'lucide-react';

const TEST_ITEMS = [
    { id: 'jd-req', label: 'JD required validation works', hint: 'Try to submit without a JD.' },
    { id: 'short-jd', label: 'Short JD warning shows for <200 chars', hint: 'Paste a very short sentence.' },
    { id: 'skill-groups', label: 'Skills extraction groups correctly', hint: 'Use keywords like React, SQL, AWS.' },
    { id: 'round-map', label: 'Round mapping changes based on company + skills', hint: 'Compare Amazon vs an unknown startup.' },
    { id: 'score-det', label: 'Score calculation is deterministic', hint: 'Re-analyze same JD, check score consistency.' },
    { id: 'live-score', label: 'Skill toggles update score live', hint: 'Toggle a skill on Results page.' },
    { id: 'persist', label: 'Changes persist after refresh', hint: 'Change a skill confidence and hit F5.' },
    { id: 'history', label: 'History saves and loads correctly', hint: 'Check the History page after analysis.' },
    { id: 'export', label: 'Export buttons copy the correct content', hint: 'Click Copy and paste into a notepad.' },
    { id: 'no-errors', label: 'No console errors on core pages', hint: 'Open DevTools and check for red logs.' },
];

const TestChecklist = () => {
    const [checks, setChecks] = useState({});

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('prp_test_checks') || '{}');
        setChecks(saved);
    }, []);

    const toggleCheck = (id) => {
        const newChecks = { ...checks, [id]: !checks[id] };
        setChecks(newChecks);
        localStorage.setItem('prp_test_checks', JSON.stringify(newChecks));
    };

    const handleReset = () => {
        if (confirm('Reset all test progress?')) {
            setChecks({});
            localStorage.removeItem('prp_test_checks');
        }
    };

    const passedCount = TEST_ITEMS.filter(item => checks[item.id]).length;
    const isComplete = passedCount === TEST_ITEMS.length;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Final Test Protocols</h1>
                    <p className="text-gray-500">Verify system integrity before final deployment.</p>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
                >
                    <RotateCcw size={14} /> Reset checklist
                </button>
            </div>

            <Card className={`border-t-4 transition-all ${isComplete ? 'border-t-green-500 bg-green-50/10' : 'border-t-amber-500 bg-amber-50/10'}`}>
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-4xl font-serif font-bold text-gray-900 mb-2">{passedCount} / {TEST_ITEMS.length}</div>
                    <p className={`text-sm font-bold uppercase tracking-widest ${isComplete ? 'text-green-600' : 'text-amber-600'}`}>
                        {isComplete ? 'All Tests Passed' : 'Fix issues before shipping'}
                    </p>
                    {!isComplete && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-amber-700">
                            <AlertCircle size={14} /> Shipping remains locked until 100% completion.
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid gap-3">
                {TEST_ITEMS.map((item) => (
                    <label
                        key={item.id}
                        className={`flex items-start gap-4 p-4 border transition-all cursor-pointer hover:bg-white ${checks[item.id] ? 'bg-white border-primary/20' : 'bg-gray-50/50 border-gray-100'
                            }`}
                    >
                        <div className={`mt-1 flex-shrink-0 w-5 h-5 border flex items-center justify-center transition-all ${checks[item.id] ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300'
                            }`}>
                            {checks[item.id] && <Check size={14} />}
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={!!checks[item.id]}
                                onChange={() => toggleCheck(item.id)}
                            />
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-semibold transition-colors ${checks[item.id] ? 'text-gray-900' : 'text-gray-500'}`}>
                                {item.label}
                            </p>
                            {item.hint && (
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 font-medium">
                                    <Info size={12} /> {item.hint}
                                </p>
                            )}
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default TestChecklist;
