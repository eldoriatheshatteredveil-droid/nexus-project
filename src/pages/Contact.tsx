import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Globe, MapPin, Terminal, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pb-20 pt-10 container mx-auto px-4 relative">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#00ffd5]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#ff66cc]/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ffd5]/30 bg-[#00ffd5]/5 text-[#00ffd5] text-xs font-mono mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffd5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffd5]"></span>
            </span>
            SECURE CHANNEL OPEN
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter font-orbitron">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              CONTACT
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffd5] to-[#ff66cc] ml-4">
              NEXUS
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Establish a direct uplink with the administration. Report bugs, request features, or inquire about partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Email Card */}
            <div className="bg-black/40 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group hover:border-[#00ffd5]/50 transition-colors duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Mail size={100} />
              </div>
              
              <h3 className="text-white font-bold font-orbitron text-xl mb-2 flex items-center gap-2">
                <Terminal size={20} className="text-[#00ffd5]" />
                DIRECT UPLINK
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Primary communication frequency for all inquiries.
              </p>
              
              <div className="bg-black/60 border border-gray-700 rounded-lg p-4 mb-4 group-hover:border-[#00ffd5]/30 transition-colors">
                <div className="text-xs text-gray-500 font-mono mb-1">TARGET ADDRESS</div>
                <a 
                  href="mailto:eldoriatheshatteredveil@gmail.com" 
                  className="text-[#00ffd5] font-mono text-sm break-all hover:underline decoration-[#00ffd5]/50 underline-offset-4"
                >
                  eldoriatheshatteredveil@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                RESPONSE TIME: &lt; 24H
              </div>
            </div>

            {/* Other Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="bg-black/40 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2] group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">DISCORD SERVER</h4>
                    <p className="text-gray-500 text-xs">Join the community</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-gray-800 rounded-xl p-6 backdrop-blur-sm hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1DA1F2]/20 flex items-center justify-center text-[#1DA1F2] group-hover:scale-110 transition-transform">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">GLOBAL NETWORK</h4>
                    <p className="text-gray-500 text-xs">Follow updates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location/Info */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-1" />
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">DIGITAL FRONTIER HQ</h4>
                  <p className="text-gray-500 text-xs font-mono leading-relaxed">
                    Sector 7G, Node 42<br />
                    Virtual Space, Metaverse<br />
                    ID: 0x8F3...9A2
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-black/40 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm h-full relative">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ffd5]/30 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ffd5]/30 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ffd5]/30 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ffd5]/30 rounded-br-lg" />

              <h3 className="text-white font-bold font-orbitron text-xl mb-6 flex items-center gap-2">
                <Send size={20} className="text-[#ff66cc]" />
                TRANSMISSION FORM
              </h3>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[400px] flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-[#00ffd5]/20 rounded-full flex items-center justify-center text-[#00ffd5] mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">TRANSMISSION SENT</h4>
                  <p className="text-gray-400 max-w-md">
                    Your message has been encrypted and successfully uploaded to our secure servers. We will establish a connection shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 px-6 py-2 border border-[#00ffd5]/30 text-[#00ffd5] rounded hover:bg-[#00ffd5]/10 transition-colors text-sm font-mono"
                  >
                    SEND ANOTHER
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-500 ml-1">CODENAME / NAME</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#00ffd5] focus:ring-1 focus:ring-[#00ffd5] outline-none transition-all font-mono text-sm placeholder-gray-700"
                        placeholder="ENTER IDENTIFIER"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-500 ml-1">RETURN FREQUENCY / EMAIL</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#00ffd5] focus:ring-1 focus:ring-[#00ffd5] outline-none transition-all font-mono text-sm placeholder-gray-700"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-500 ml-1">SUBJECT</label>
                    <select
                      name="subject"
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({...formState, subject: e.target.value})}
                      className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#00ffd5] focus:ring-1 focus:ring-[#00ffd5] outline-none transition-all font-mono text-sm"
                    >
                      <option value="" disabled>SELECT TOPIC</option>
                      <option value="support">TECHNICAL SUPPORT</option>
                      <option value="business">BUSINESS INQUIRY</option>
                      <option value="bug">BUG REPORT</option>
                      <option value="other">OTHER</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-500 ml-1">ENCRYPTED MESSAGE</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-[#00ffd5] focus:ring-1 focus:ring-[#00ffd5] outline-none transition-all font-mono text-sm placeholder-gray-700 resize-none"
                      placeholder="TYPE YOUR MESSAGE HERE..."
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Shield size={14} className="text-[#00ffd5]" />
                      <span>256-BIT ENCRYPTION ACTIVE</span>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`
                        px-8 py-3 rounded-lg font-bold font-orbitron tracking-wider flex items-center gap-2 transition-all
                        ${isSubmitting 
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-[#00ffd5] to-[#00ffd5]/80 text-black hover:shadow-[0_0_20px_rgba(0,255,213,0.4)] hover:scale-105'
                        }
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin">⟳</span> TRANSMITTING...
                        </>
                      ) : (
                        <>
                          SEND TRANSMISSION <Send size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
