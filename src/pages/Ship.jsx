import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Rocket, Lock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Ship = () => {
    const [isLocked, setIsLocked] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checks = JSON.parse(localStorage.getItem('prp_test_checks') || '{}');
        const passed = Object.values(checks).filter(Boolean).length;
        setIsLocked(passed < 10);
    }, []);

    if (isLocked) {
        return (
            <div className="max-w-xl mx-auto py-20 animate-in fade-in zoom-in duration-500">
                <Card className="border-t-4 border-t-red-500 shadow-xl">
                    <CardContent className="p-12 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                            <Lock size={40} />
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Ship Protocol Locked</h1>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            For security and stability, the deployment protocol is restricted. All 10 internal verification tests must be passed before you can access this terminal.
                        </p>
                        <button
                            onClick={() => navigate('/prp/07-test')}
                            className="px-8 py-3 bg-primary text-white font-bold text-sm tracking-widest uppercase hover:bg-opacity-90 transition-all"
                        >
                            Return to Test Terminal
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto py-20 animate-in fade-in zoom-in duration-700">
            <Card className="border-t-4 border-t-green-500 shadow-2xl overflow-hidden">
                <CardContent className="p-12 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 animate-bounce">
                        <Rocket size={48} />
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Clear to Launch</h1>
                    <p className="text-gray-500 mb-10 leading-relaxed">
                        All system diagnostics returned 100% success. The Placement Readiness Platform is hardened, verified, and ready for production deployment.
                    </p>
                    <div className="w-full space-y-3 mb-10">
                        {['Code Assets Sealed', 'Environment Verified', 'Deployment Token Active'].map((text) => (
                            <div key={text} className="flex items-center gap-3 justify-center text-xs font-bold text-green-700 uppercase tracking-widest">
                                <CheckCircle2 size={14} /> {text}
                            </div>
                        ))}
                    </div>
                    <button
                        className="w-full py-5 bg-green-600 text-white font-black text-xl tracking-[0.2em] hover:bg-green-700 transition-all shadow-[0_10px_20px_-10px_rgba(22,163,74,0.5)]"
                    >
                        EXECUTE SHIP
                    </button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Ship;
