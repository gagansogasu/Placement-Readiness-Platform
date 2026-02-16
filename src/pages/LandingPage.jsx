import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Video, BarChart2 } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-white border-b border-gray-200 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
                        Ace Your Placement
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Practice, assess, and prepare for your dream job with our comprehensive placement readiness platform.
                    </p>
                    <Link
                        to="/dashboard"
                        className="inline-block bg-primary text-white px-10 py-4 font-semibold text-lg transition-transform hover:scale-105 active:scale-95"
                    >
                        Get Started
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-4 bg-[#F7F6F3]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Code className="w-8 h-8 text-primary" />}
                            title="Practice Problems"
                            description="Master technical concepts with thousands of curated coding challenges."
                        />
                        <FeatureCard
                            icon={<Video className="w-8 h-8 text-primary" />}
                            title="Mock Interviews"
                            description="Simulate real-world interviews with industry experts and AI feedback."
                        />
                        <FeatureCard
                            icon={<BarChart2 className="w-8 h-8 text-primary" />}
                            title="Track Progress"
                            description="Monitor your growth with detailed analytics and personalized insights."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-8 bg-white border-t border-gray-200 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} KodNest Premium. All rights reserved.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-8 border border-gray-100 hover:border-primary/20 transition-all">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-serif font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 line-clamp-2">{description}</p>
    </div>
);

export default LandingPage;
