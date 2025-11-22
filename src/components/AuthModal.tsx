import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Mail, Key, Terminal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithProvider, signInWithDevKey } = useAuth();
  const [devKey, setDevKey] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'user' | 'dev'>('user');

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

  const handleProviderLogin = async (provider: 'google' | 'github') => {
    const { error } = await signInWithProvider(provider);
    if (error) setError(error.message);
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
                {mode === 'user' ? 'IDENTIFY YOURSELF' : 'DEVELOPER ACCESS'}
              </h2>
              <p className="text-gray-400 text-xs font-mono">
                {mode === 'user' ? 'CONNECT TO THE NEXUS NETWORK' : 'ENTER ROOT ACCESS KEY'}
              </p>
            </div>

            {mode === 'user' ? (
              <div className="space-y-4">
                <button
                  onClick={() => handleProviderLogin('github')}
                  className="w-full py-3 px-4 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-lg flex items-center justify-center gap-3 transition-all border border-transparent hover:border-gray-500"
                >
                  <Github size={20} />
                  <span>Continue with GitHub</span>
                </button>
                
                <button
                  onClick={() => handleProviderLogin('google')}
                  className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-900 rounded-lg flex items-center justify-center gap-3 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0a0a0f] px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <button
                  onClick={() => setMode('dev')}
                  className="w-full py-3 px-4 bg-transparent border border-[#00ffd5]/30 text-[#00ffd5] hover:bg-[#00ffd5]/10 rounded-lg flex items-center justify-center gap-3 transition-all font-mono text-xs"
                >
                  <Terminal size={16} />
                  <span>DEVELOPER OVERRIDE</span>
                </button>
              </div>
            ) : (
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
                      setMode('user');
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
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
