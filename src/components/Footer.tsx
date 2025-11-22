import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black border-t border-white/10 py-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#00ffd5]/50 to-transparent" />
            
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Brand / Copyright */}
                    <div className="text-center md:text-left">
                        <h3 className="font-orbitron text-lg font-bold text-white tracking-wider mb-1 flex items-center gap-2 justify-center md:justify-start">
                            NEXUS <span className="text-[10px] px-1 py-0.5 bg-[#00ffd5]/20 text-[#00ffd5] rounded border border-[#00ffd5]/30">v1.0.0</span>
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">
                            &copy; {new Date().getFullYear()} DIGITAL FRONTIER. ALL SYSTEMS NOMINAL.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap justify-center gap-6 text-xs font-mono tracking-wider">
                        <Link to="/about" className="text-gray-400 hover:text-[#00ffd5] transition-colors">ABOUT</Link>
                        <Link to="/privacy" className="text-gray-400 hover:text-[#00ffd5] transition-colors">PRIVACY</Link>
                        <Link to="/terms" className="text-gray-400 hover:text-[#00ffd5] transition-colors">TERMS</Link>
                        <Link to="/contact" className="text-gray-400 hover:text-[#00ffd5] transition-colors">CONTACT</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;