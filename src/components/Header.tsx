import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberSound } from '../hooks/useCyberSound';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { Crosshair, Gamepad2, Upload, Info, Mail, User, LogIn, Shield, MessageSquare } from 'lucide-react';
import NexusLogo from './NexusLogo';
import AuthModal from './AuthModal';
import Chat from './Chat';
import Mailbox from './Mailbox';
import { AVATARS, getLevelFromXP } from '../data/avatars';

const CyberNavLink: React.FC<{ to: string; children: React.ReactNode; icon: React.ReactNode }> = ({ to, children, icon }) => {
    const { playHover, playClick } = useCyberSound();
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            onClick={playClick}
            onMouseEnter={playHover}
            className="relative group px-5 py-2"
        >
            {/* Background Shape */}
            <div className={`absolute inset-0 transform -skew-x-12 border transition-all duration-300 ${
                isActive 
                    ? 'bg-[#00ffd5]/10 border-[#00ffd5] shadow-[0_0_10px_rgba(0,255,213,0.3)]' 
                    : 'bg-transparent border-white/10 group-hover:border-[#00ffd5]/50 group-hover:bg-[#00ffd5]/5'
            }`} />

            {/* Active/Hover Indicator Line */}
            <div className={`absolute bottom-0 left-0 h-[2px] bg-[#00ffd5] transition-all duration-300 transform -skew-x-12 ${
                isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
            }`} />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2">
                <span className={`transition-colors duration-300 ${isActive ? 'text-[#00ffd5]' : 'text-gray-400 group-hover:text-[#00ffd5]'}`}>
                    {icon}
                </span>
                <span className={`font-orbitron text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                    {children}
                </span>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#00ffd5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
    );
};

const Header: React.FC = () => {
    const { playHover, playClick } = useCyberSound();
    const { killCount, selectedAvatarId, xp, messages } = useStore();
    const { user } = useAuth();
    const [fireworksId, setFireworksId] = useState<number | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMailboxOpen, setIsMailboxOpen] = useState(false);

    const currentLevel = getLevelFromXP(xp);
    const avatarUrl = AVATARS.find(a => a.id === selectedAvatarId)?.url || user?.avatar_url;
    const unreadMessages = messages.filter(m => !m.read).length;

    useEffect(() => {
        if (killCount > 0 && killCount % 10 === 0) {
            setFireworksId(Date.now());
            const timer = setTimeout(() => setFireworksId(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [killCount]);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center h-24">
                <div className="cursor-pointer" onMouseEnter={playHover} onClick={playClick}>
                    <Link to="/">
                        <NexusLogo />
                    </Link>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center gap-4">
                    {/* Kill Counter */}
                    <div className="flex items-center gap-2 bg-black/60 border border-red-500/30 px-3 py-1 rounded-lg relative shadow-[0_0_10px_rgba(220,38,38,0.15)] backdrop-blur-sm group hover:border-red-500/60 transition-colors">
                        <Crosshair size={14} className="text-red-500 animate-[spin_4s_linear_infinite]" />
                        <span className="text-red-500 font-mono text-[10px] font-bold tracking-[0.15em]">
                            KILLS: <span className="text-white text-xs ml-1">{killCount.toString().padStart(3, '0')}</span>
                        </span>

                        {/* Fireworks Effect */}
                        <AnimatePresence>
                            {fireworksId && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={`${fireworksId}-${i}`}
                                            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                                            animate={{ 
                                                x: (Math.random() - 0.5) * 400, 
                                                y: (Math.random() - 0.5) * 400, 
                                                scale: Math.random() * 1.5 + 0.5, 
                                                opacity: 0,
                                                rotate: Math.random() * 360
                                            }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="absolute w-2 h-2 rounded-full"
                                            style={{ 
                                                backgroundColor: ['#ff0000', '#ff4400', '#ffcc00', '#ffffff', '#00ffd5'][Math.floor(Math.random() * 5)],
                                                boxShadow: '0 0 15px currentColor'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Level Badge (Only if logged in) */}
                    {user && (
                        <div className="hidden md:flex items-center gap-2 bg-black/60 border border-[#00ffd5]/30 px-3 py-1 rounded-lg backdrop-blur-sm">
                            <Shield size={14} className="text-[#00ffd5]" />
                            <span className="text-[#00ffd5] font-mono text-[10px] font-bold tracking-[0.15em]">
                                LVL <span className="text-white text-xs ml-1">{currentLevel}</span>
                            </span>
                        </div>
                    )}
                </div>

                <nav className="flex items-center gap-4">
                    <CyberNavLink to="/" icon={<Gamepad2 size={16} />}>Games</CyberNavLink>
                    {user && <CyberNavLink to="/upload" icon={<Upload size={16} />}>Upload</CyberNavLink>}
                    <CyberNavLink to="/about" icon={<Info size={16} />}>About</CyberNavLink>
                    <CyberNavLink to="/contact" icon={<Mail size={16} />}>Contact</CyberNavLink>
                    
                    {user && (
                        <>
                            <button
                                onClick={() => { playClick(); setIsChatOpen(!isChatOpen); }}
                                onMouseEnter={playHover}
                                className="relative group px-3 py-2"
                                title="Global Chat"
                            >
                                <div className={`absolute inset-0 transform -skew-x-12 border transition-all duration-300 ${
                                    isChatOpen 
                                        ? 'bg-[#00ffd5]/20 border-[#00ffd5]' 
                                        : 'bg-[#00ffd5]/5 border-[#00ffd5]/30 group-hover:bg-[#00ffd5]/10'
                                }`} />
                                <div className="relative z-10 text-[#00ffd5]">
                                    <MessageSquare size={18} />
                                </div>
                            </button>

                            <button
                                onClick={() => { playClick(); setIsMailboxOpen(true); }}
                                onMouseEnter={playHover}
                                className="relative group px-3 py-2"
                                title="Inbox"
                            >
                                <div className={`absolute inset-0 transform -skew-x-12 border transition-all duration-300 ${
                                    isMailboxOpen 
                                        ? 'bg-[#00ffd5]/20 border-[#00ffd5]' 
                                        : 'bg-[#00ffd5]/5 border-[#00ffd5]/30 group-hover:bg-[#00ffd5]/10'
                                }`} />
                                <div className="relative z-10 text-[#00ffd5]">
                                    <Mail size={18} />
                                    {unreadMessages > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                                            {unreadMessages}
                                        </span>
                                    )}
                                </div>
                            </button>
                        </>
                    )}

                    {user ? (
                        <Link 
                            to="/profile"
                            onClick={playClick}
                            onMouseEnter={playHover}
                            className="relative group px-5 py-2"
                        >
                            <div className="absolute inset-0 transform -skew-x-12 border border-[#00ffd5]/30 bg-[#00ffd5]/10 group-hover:bg-[#00ffd5]/20 transition-all" />
                            <div className="relative z-10 flex items-center gap-2 text-[#00ffd5]">
                                {avatarUrl ? (
                                    <img 
                                        src={avatarUrl} 
                                        alt="Profile" 
                                        className="w-4 h-4 rounded-full border border-[#00ffd5] object-cover bg-gray-900" 
                                    />
                                ) : (
                                    <User size={16} />
                                )}
                                <span className="font-orbitron text-xs font-bold tracking-widest uppercase truncate max-w-[100px]">
                                    {user.username || 'PROFILE'}
                                </span>
                            </div>
                        </Link>
                    ) : (
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="relative group px-5 py-2"
                        >
                            <div className="absolute inset-0 transform -skew-x-12 border border-[#00ffd5]/30 bg-[#00ffd5]/10 group-hover:bg-[#00ffd5]/20 transition-all" />
                            <div className="relative z-10 flex items-center gap-2 text-[#00ffd5]">
                                <LogIn size={16} />
                                <span className="font-orbitron text-xs font-bold tracking-widest uppercase">
                                    LOGIN
                                </span>
                            </div>
                        </button>
                    )}
                </nav>
            </header>

            <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            <Mailbox isOpen={isMailboxOpen} onClose={() => setIsMailboxOpen(false)} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default Header;

