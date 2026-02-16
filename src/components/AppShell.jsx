import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Code, BookOpen, User, ClipboardCheck } from 'lucide-react';

const AppShell = () => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Practice', path: '/practice', icon: <Code size={20} /> },
        { name: 'Assessments', path: '/assessments', icon: <ClipboardCheck size={20} /> },
        { name: 'Resources', path: '/resources', icon: <BookOpen size={20} /> },
        { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-[#F7F6F3]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-serif font-bold text-primary">Placement Prep</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
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
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <h1 className="text-lg font-semibold text-gray-800">Placement Prep</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Welcome, Candidate</span>
                        <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 overflow-hidden">
                            <User size={24} />
                        </div>
                    </div>
                </header>

                {/* Content Outlet */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppShell;
