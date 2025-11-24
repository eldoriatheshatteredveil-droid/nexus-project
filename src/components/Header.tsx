import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberSound } from '../hooks/useCyberSound';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { Crosshair, Gamepad2, Upload, Info, Mail, User, LogIn, Shield, MessageSquare, ShoppingBag, Terminal, Network, Bug } from 'lucide-react';
import NexusLogo from './NexusLogo';
import AuthModal from './AuthModal';
import Chat from './Chat';
import Mailbox from './Mailbox';
import ProceduralAvatar from './ProceduralAvatar';
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
            className="relative group px-5 py-2 block"
        >
            {/* Background Shape */}
            <div className={`absolute inset-0 transform -skew-x-12 border transition-all duration-300 pointer-events-none ${
                isActive 
                    ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgb(var(--color-primary)/0.3)]' 
                    : 'bg-transparent border-white/10 group-hover:border-primary/50 group-hover:bg-primary/5'
            }`} />

            {/* Active/Hover Indicator Line */}
            <div className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 transform -skew-x-12 pointer-events-none ${
                isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
            }`} />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-2 pointer-events-none">
                <span className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
                    {icon}
                </span>
                <span className={`font-orbitron text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                }`}>
                    {children}
                </span>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
    );
};

interface HeaderProps {
  onOpenTerminal: () => void;
  onOpenBlackMarket: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenTerminal, onOpenBlackMarket }) => {
    const { playHover, playClick } = useCyberSound();
    const { killCount, selectedAvatarId, xp, messages, credits, faction, areCreaturesEnabled, toggleCreatures } = useStore();
    const { user } = useAuth();
    const [fireworksId, setFireworksId] = useState<number | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMailboxOpen, setIsMailboxOpen] = useState(false);

    const currentLevel = getLevelFromXP(xp);
    const unreadMessages = messages.filter(m => !m.read).length;
    
    const selectedAvatar = AVATARS.find(a => a.id === selectedAvatarId);
    const displayLevel = selectedAvatar ? selectedAvatar.minLevel : currentLevel;
    const userAvatarUrl = user?.avatar_url;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('action') === 'login') {
            setIsAuthModalOpen(true);
            if (params.get('verified') === 'true') {
                setAuthMessage('Account verified successfully! Please login.');
            }
            // Clean up URL
            window.history.replaceState({}, '', '/');
        }
    }, []);

    useEffect(() => {
        if (killCount > 0 && killCount % 10 === 0) {
            setFireworksId(Date.now());
            const timer = setTimeout(() => setFireworksId(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [killCount]);

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 p-4 flex justify-between items-center h-24 shadow-lg">
                <div className="cursor-pointer" onMouseEnter={playHover} onClick={playClick}>
                    <Link to="/">
                        <NexusLogo />
                    </Link>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center gap-4">
                    {/* Kill Counter */}
                    <div className="flex items-center gap-2 bg-black/60 border border-red-500/30 px-3 py-1 rounded-lg relative shadow-[0_0_15px_rgba(220,38,38,0.2)] backdrop-blur-sm group hover:border-red-500/60 transition-colors">
                        <Crosshair size={14} className="text-red-500 animate-[spin_4s_linear_infinite] drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]" />
                        <span className="text-red-500 font-mono text-[10px] font-bold tracking-[0.15em] drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">
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

                    {/* Credits Display */}
                    <div className="flex items-center gap-2 bg-black/60 border border-yellow-500/30 px-3 py-1 rounded-lg backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <span className="text-yellow-500 font-mono text-[10px] font-bold tracking-[0.15em] drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
                            CR: <span className="text-white text-xs ml-1">{(credits || 0).toLocaleString()}</span>
                        </span>
                    </div>

                    {/* Level Badge (Only if logged in) */}
                    {user && (
                        <div className="hidden md:flex items-center gap-2 bg-black/60 border border-primary/30 px-3 py-1 rounded-lg backdrop-blur-sm box-glow">
                            <Shield size={14} className="text-primary drop-shadow-[0_0_5px_rgba(var(--color-primary),0.8)]" />
                            <span className="text-primary font-mono text-[10px] font-bold tracking-[0.15em] text-glow">
                                LVL <span className="text-white text-xs ml-1">{currentLevel}</span>
                            </span>
                        </div>
                    )}
                </div>

                <nav className="flex items-center gap-4">
                    <CyberNavLink to="/" icon={<Gamepad2 size={16} />}>Games</CyberNavLink>
                    {user && faction && <CyberNavLink to="/nexus" icon={<Network size={16} />}>NEXUS</CyberNavLink>}
                    {user && <CyberNavLink to="/upload" icon={<Upload size={16} />}>Upload</CyberNavLink>}
                    <CyberNavLink to="/about" icon={<Info size={16} />}>About</CyberNavLink>
                    <CyberNavLink to="/contact" icon={<Mail size={16} />}>Contact</CyberNavLink>
                    
                    {/* Creature Toggle */}
                    <button
                        onClick={() => { 
                            playClick(); 
                            toggleCreatures();
                            setTimeout(() => window.location.reload(), 100);
                        }}
                        onMouseEnter={playHover}
                        className="relative group px-3 py-2"
                        title={areCreaturesEnabled ? "Disable Creatures" : "Enable Creatures"}
                    >
                        <div className={`absolute inset-0 transform -skew-x-12 border transition-all duration-300 pointer-events-none ${
                            areCreaturesEnabled 
                                ? 'bg-green-500/10 border-green-500/50 group-hover:bg-green-500/20' 
                                : 'bg-red-500/10 border-red-500/50 group-hover:bg-red-500/20'
                        }`} />
                        <div className={`relative z-10 transition-colors pointer-events-none ${
                            areCreaturesEnabled ? 'text-green-500' : 'text-red-500'
                        }`}>
                            <Bug size={18} className={areCreaturesEnabled ? "animate-pulse" : ""} />
                        </div>
                    </button>

                    {/* Terminal Toggle */}
                    <button
                        onClick={() => { playClick(); onOpenTerminal(); }}
                        onMouseEnter={playHover}
                        className="relative group px-3 py-2"
                        title="Open Terminal (Press ~)"
                    >
                        <div className="absolute inset-0 transform -skew-x-12 border border-white/10 bg-transparent group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300 pointer-events-none" />
                        <div className="relative z-10 text-gray-400 group-hover:text-primary transition-colors pointer-events-none">
                            <Terminal size={18} />
                        </div>
                    </button>

                    {/* Black Market Toggle */}
                    <button
                        onClick={() => { playClick(); onOpenBlackMarket(); }}
                        onMouseEnter={playHover}
                        className="relative group px-3 py-2"
                        title="Black Market"
                    >
                        <div className="absolute inset-0 transform -skew-x-12 border border-red-500/30 bg-transparent group-hover:border-red-500 group-hover:bg-red-500/10 transition-all duration-300 pointer-events-none" />
                        <div className="relative z-10 text-red-500/70 group-hover:text-red-500 transition-colors pointer-events-none">
                            <ShoppingBag size={18} />
                        </div>
                    </button>
                    
                    {user && (
                        <>
                            <button
                                onClick={() => { playClick(); setIsChatOpen(!isChatOpen); }}
                                onMouseEnter={playHover}
                                className="relative group px-3 py-2"
                                title="Global Chat"
                            >
                                <div className={`absolute inset-0 transform -skew-x-12 border transition-all duration-300 pointer-events-none ${
                                    isChatOpen 
                                        ? 'bg-primary/20 border-primary' 
                                        : 'bg-primary/5 border-primary/30 group-hover:bg-primary/10'
                                }`} />
                                <div className="relative z-10 text-primary pointer-events-none">
                                    <MessageSquare size={18} />
                                </div>
                            </button>

                            <button
                                onClick={() => { playClick(); setIsMailboxOpen(true); }}
                                onMouseEnter={playHover}
                                className="relative group px-3 py-2"
                                title="Inbox"
                            >
                                <div className={`absolute inset-0 transform -skew-x-12 border transition-all duration-300 pointer-events-none ${
                                    isMailboxOpen 
                                        ? 'bg-primary/20 border-primary' 
                                        : 'bg-primary/5 border-primary/30 group-hover:bg-primary/10'
                                }`} />
                                <div className="relative z-10 text-primary pointer-events-none">
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
                            className="relative group px-5 py-2 block"
                        >
                            <div className="absolute inset-0 transform -skew-x-12 border border-primary/30 bg-primary/10 group-hover:bg-primary/20 transition-all pointer-events-none" />
                            <div className="relative z-10 flex items-center gap-2 text-primary pointer-events-none">
                                {userAvatarUrl ? (
                                    <img 
                                        src={userAvatarUrl} 
                                        alt="Profile" 
                                        className="w-4 h-4 rounded-full border border-primary object-cover bg-gray-900" 
                                    />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border border-primary bg-gray-900 overflow-hidden flex items-center justify-center">
                                        <ProceduralAvatar level={displayLevel} size={16} />
                                    </div>
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
                            <div className="absolute inset-0 transform -skew-x-12 border border-primary/30 bg-primary/10 group-hover:bg-primary/20 transition-all pointer-events-none" />
                            <div className="relative z-10 flex items-center gap-2 text-primary pointer-events-none">
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
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => { setIsAuthModalOpen(false); setAuthMessage(''); }} 
                initialMessage={authMessage}
            />
        </>
    );
};

export default Header;

