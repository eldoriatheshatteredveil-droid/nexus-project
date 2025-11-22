import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Key, Terminal, User, Lock, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithDevKey, signInWithEmail, signUpWithEmail } = useAuth();
  const { addMessage } = useStore();
  const [devKey, setDevKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'dev'>('login');

  const handleDevLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signInWithDevKey(devKey);
    if (result.success) {
      onClose();
      window.location.href = '/';
    } else {
      setError(result.error || 'Access Denied');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const { error } = await signInWithEmail(email, password);
    if (error) {
      setError(error.message);
    } else {
      onClose();
      window.location.href = '/';
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const { error } = await signUpWithEmail(email, password, username);
    if (error) {
      setError(error.message);
    } else {
      // Send Welcome Message
      addMessage({
        id: `welcome-${Date.now()}`,
        sender: 'NEXUS_SYSTEM',
        subject: 'WELCOME TO THE NEXUS',
        content: `Greetings, ${username}.\n\nWelcome to the Nexus Digital Frontier. Your neural link has been established successfully.\n\nAs a registered operative, you now have access to:\n- Upload Protocol: Deploy your own creations to the network.\n- Global Chat: Communicate with other operatives.\n- Profile Tracking: Monitor your XP and stats.\n\nExplore the archives, play games, and contribute to the system.\n\nEnd of transmission.`,
        date: new Date().toISOString(),
        read: false,
        type: 'system'
      });

      setSuccessMsg('Account created! Please check your email to confirm.');
      // Optional: Switch to login mode or close modal
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 m-auto w-full max-w-md h-fit bg-[#0a0a0f] border border-[#00ffd5]/30 rounded-xl p-6 z-[101] shadow-[0_0_50px_rgba(0,255,213,0.1)]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#00ffd5] font-orbitron mb-2">
                {mode === 'dev' ? 'DEVELOPER ACCESS' : mode === 'signup' ? 'NEW USER REGISTRATION' : 'IDENTIFY YOURSELF'}
              </h2>
              <p className="text-gray-400 text-xs font-mono">
                {mode === 'dev' ? 'ENTER ROOT ACCESS KEY' : mode === 'signup' ? 'CREATE YOUR DIGITAL IDENTITY' : 'CONNECT TO THE NEXUS NETWORK'}
              </p>
            </div>

            {mode === 'dev' ? (
              <form onSubmit={handleDevLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#00ffd5] mb-2">ACCESS KEY</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="password"
                      value={devKey}
                      onChange={(e) => setDevKey(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-[#00ffd5] focus:outline-none font-mono"
                      placeholder="ENTER KEY..."
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-xs font-mono bg-red-500/10 p-2 rounded border border-red-500/20">
                    ERROR: {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-mono transition-colors"
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-[#00ffd5] hover:bg-[#00ffd5]/80 text-black font-bold rounded-lg text-xs font-mono transition-colors"
                  >
                    AUTHENTICATE
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={mode === 'login' ? handleEmailLogin : handleEmailSignUp} className="space-y-4">
                
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-mono text-[#00ffd5] mb-2">USERNAME</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-[#00ffd5] focus:outline-none font-mono"
                        placeholder="CHOOSE ALIAS..."
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-[#00ffd5] mb-2">EMAIL ADDRESS</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-[#00ffd5] focus:outline-none font-mono"
                      placeholder="ENTER EMAIL..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#00ffd5] mb-2">PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:border-[#00ffd5] focus:outline-none font-mono"
                      placeholder="ENTER PASSWORD..."
                      required
                    />
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                    {rememberMe ? <CheckSquare size={16} className="text-[#00ffd5]" /> : <Square size={16} className="text-gray-500" />}
                    <span className="text-xs text-gray-400 font-mono select-none">REMEMBER NEURAL LINK</span>
                  </div>
                )}

                {error && (
                  <div className="text-red-500 text-xs font-mono bg-red-500/10 p-2 rounded border border-red-500/20">
                    ERROR: {error}
                  </div>
                )}
                
                {successMsg && (
                  <div className="text-green-500 text-xs font-mono bg-green-500/10 p-2 rounded border border-green-500/20">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#00ffd5] hover:bg-[#00ffd5]/80 text-black font-bold rounded-lg text-xs font-mono transition-colors flex items-center justify-center gap-2"
                >
                  {mode === 'login' ? 'ESTABLISH CONNECTION' : 'INITIATE REGISTRATION'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0a0a0f] px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="w-full py-2 px-4 bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg text-xs font-mono transition-colors"
                  >
                    {mode === 'login' ? 'CREATE NEW ACCOUNT' : 'ALREADY HAVE AN ACCOUNT? LOGIN'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('dev');
                      setError('');
                      setSuccessMsg('');
                    }}
                    className="w-full py-2 px-4 bg-transparent border border-[#00ffd5]/30 text-[#00ffd5] hover:bg-[#00ffd5]/10 rounded-lg flex items-center justify-center gap-2 transition-all font-mono text-xs"
                  >
                    <Terminal size={14} />
                    <span>DEVELOPER OVERRIDE</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
