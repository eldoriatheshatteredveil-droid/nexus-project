import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Shield, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const SimulatedEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'user@example.com';
  const navigate = useNavigate();
  const { verifyUser } = useAuth();
  
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    
    // Simulate network delay
    setTimeout(() => {
      verifyUser(email);
      setIsVerifying(false);
      setVerified(true);
      
      // Redirect to home/login after delay
      setTimeout(() => {
        navigate('/?action=login&verified=true');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
            M
          </div>
          <h1 className="text-xl font-semibold text-gray-700">MailBox <span className="text-xs font-normal text-gray-500">(Simulated Environment)</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
            {email.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600">{email}</span>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 hidden md:block">
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg mb-6 font-medium shadow-sm hover:bg-blue-700 transition-colors">
            Compose
          </button>
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-700 rounded-md cursor-pointer">
              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span className="font-medium">Inbox</span>
              </div>
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">1</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
              <Shield size={18} />
              <span>Spam</span>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className={`${selectedEmail ? 'hidden md:block' : 'block'} w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto`}>
          <div className="p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors bg-blue-50/50" onClick={() => setSelectedEmail('nexus-verify')}>
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-gray-900">Nexus Identity Service</span>
              <span className="text-xs text-gray-500">Just now</span>
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-1">Activate your Nexus Account</h3>
            <p className="text-xs text-gray-500 line-clamp-2">
              Welcome to the Nexus Digital Frontier. Please verify your email address to complete your registration...
            </p>
          </div>
        </div>

        {/* Email Content */}
        <div className={`${selectedEmail ? 'block' : 'hidden md:block'} flex-1 bg-white overflow-y-auto`}>
          {selectedEmail === 'nexus-verify' ? (
            <div className="p-8 max-w-3xl mx-auto">
              <button 
                onClick={() => setSelectedEmail(null)}
                className="md:hidden mb-4 flex items-center gap-2 text-gray-500"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Activate your Nexus Account</h1>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-[#00ffd5]">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Nexus Identity Service <span className="text-gray-400 font-normal">&lt;no-reply@nexus.system&gt;</span></div>
                    <div className="text-sm text-gray-500">To: {email}</div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none text-gray-600">
                <p>Greetings Operative,</p>
                <p>You have initiated a neural link with the Nexus Digital Frontier. To secure your connection and access the network, verification of your digital signature is required.</p>
                
                <div className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <p className="mb-4 text-sm text-gray-500">Click the button below to verify your email address:</p>
                  
                  {!verified ? (
                    <button
                      onClick={handleVerify}
                      disabled={isVerifying}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ffd5] hover:bg-[#00e6c0] text-black font-bold rounded-md transition-all transform hover:scale-105 shadow-lg shadow-[#00ffd5]/20"
                    >
                      {isVerifying ? 'VERIFYING...' : 'VERIFY ACCOUNT'}
                      <ExternalLink size={16} />
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center gap-2 text-green-600"
                    >
                      <CheckCircle size={48} />
                      <span className="font-bold">VERIFICATION COMPLETE</span>
                      <span className="text-sm text-gray-500">Redirecting to login...</span>
                    </motion.div>
                  )}
                </div>

                <p>If you did not request this verification, please disregard this transmission.</p>
                <hr className="my-6 border-gray-200" />
                <p className="text-xs text-gray-400">
                  Nexus Digital Frontier // System ID: 884-221-990<br />
                  This is an automated message. Do not reply.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Mail size={64} className="mb-4 opacity-20" />
              <p>Select an email to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulatedEmail;
