import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

// Placeholder Components
const Practice = () => <PageTitle title="Practice Problems" />;
const Assessments = () => <PageTitle title="Skill Assessments" />;
const Resources = () => <PageTitle title="Study Resources" />;
const Profile = () => <PageTitle title="User Profile" />;

const PageTitle = ({ title }) => (
    <div className="bg-white p-8 border border-gray-100">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600">This page is currently under construction for the KodNest Premium Build System.</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Dashboard Routes App Shell */}
                <Route element={<AppShell />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/practice" element={<Practice />} />
                    <Route path="/assessments" element={<Assessments />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Catch all - redirect to landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
