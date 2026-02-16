import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Code, BookOpen, User, ClipboardCheck, History as HistoryIcon, Rocket, ShieldCheck } from 'lucide-react';

const AppShell = () => {
    const [submission, setSubmission] = React.useState({ stepStates: [], links: {} });
    const [testCount, setTestCount] = React.useState(0);

    React.useEffect(() => {
        const sub = JSON.parse(localStorage.getItem('prp_final_submission') || '{}');
        const tests = JSON.parse(localStorage.getItem('prp_test_checks') || '{}');
        setSubmission(sub);
        setTestCount(Object.values(tests).filter(Boolean).length);
    }, []);

    const completedSteps = (submission.stepStates || []).filter(Boolean).length;
    const isValidUrl = (url) => { try { new URL(url); return true; } catch { return false; } };
    const allLinks = submission.links && isValidUrl(submission.links.lovable) && isValidUrl(submission.links.github) && isValidUrl(submission.links.deploy);
    const isShipped = completedSteps === 8 && testCount === 10 && allLinks;

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'History', path: '/history', icon: <HistoryIcon size={20} /> },
        { name: 'PRP Test', path: '/prp/07-test', icon: <ClipboardCheck size={20} /> },
        { name: 'Ship', path: '/prp/08-ship', icon: <Rocket size={20} /> },
        { name: 'Proof of Work', path: '/prp/proof', icon: <ShieldCheck size={20} /> },
        { name: 'Practice', path: '/practice', icon: <Code size={20} /> },
        { name: 'Assessments', path: '/assessments', icon: <ClipboardCheck size={20} /> },
        { name: 'Resources', path: '/resources', icon: <BookOpen size={20} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-[#F7F6F3]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-100 flex flex-col bg-white">
                <div className="p-8 border-b border-gray-50">
                    <h1 className="text-xl font-serif font-bold text-gray-900 leading-tight">Placement Prep</h1>
                    <p className="text-[10px] uppercase font-bold text-primary tracking-widest mt-1 opacity-60">KodNest Premium</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all ${isActive
                                    ? 'bg-primary/5 text-primary border-l-4 border-primary'
                                    : 'text-gray-400 hover:text-gray-900 border-l-4 border-transparent'
                                }`
                            }
                        >
                            {item.icon}
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 border-b border-gray-50 bg-white flex items-center justify-between px-8 z-10">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">PRP v1.0</div>
                    <div className="flex items-center gap-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-gray-50 text-gray-400 border border-gray-100">
                            Step {completedSteps} / 8
                        </div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 border transition-all duration-500 ${isShipped ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-primary/20 text-primary'}`}>
                            {isShipped ? 'Shipped' : 'In Progress'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-12 bg-[#F7F6F3]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppShell;
