import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Trash2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useStore, Message } from '../store';

interface MailboxProps {
  isOpen: boolean;
  onClose: () => void;
}

const Mailbox: React.FC<MailboxProps> = ({ isOpen, onClose }) => {
  const { messages, markMessageRead, deleteMessage } = useStore();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markMessageRead(msg.id);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteMessage(id);
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const getIcon = (type: Message['type']) => {
    switch (type) {
      case 'admin': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'system': return <Info size={16} className="text-[#00ffd5]" />;
      default: return <Mail size={16} className="text-gray-400" />;
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
            initial={{ scale: 0.9, opacity: 0, x: 100 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.9, opacity: 0, x: 100 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0f] border-l border-[#00ffd5]/30 z-[101] shadow-[-10px_0_30px_rgba(0,255,213,0.1)] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/50">
              <div className="flex items-center gap-3">
                <Mail className="text-[#00ffd5]" />
                <h2 className="text-xl font-bold text-white font-orbitron">NEURAL INBOX</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {selectedMessage ? (
                <div className="flex-1 p-6 overflow-y-auto">
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="mb-4 text-xs text-[#00ffd5] hover:underline flex items-center gap-1"
                  >
                    ← BACK TO INBOX
                  </button>
                  
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        selectedMessage.type === 'admin' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10' :
                        selectedMessage.type === 'system' ? 'border-[#00ffd5]/50 text-[#00ffd5] bg-[#00ffd5]/10' :
                        'border-gray-500/50 text-gray-400 bg-gray-500/10'
                      }`}>
                        {selectedMessage.type}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">{new Date(selectedMessage.date).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{selectedMessage.subject}</h3>
                    <p className="text-xs text-gray-400 mb-6 font-mono">FROM: {selectedMessage.sender}</p>
                    
                    <div className="prose prose-invert text-sm text-gray-300 font-mono whitespace-pre-wrap">
                      {selectedMessage.content}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={(e) => handleDelete(e, selectedMessage.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded hover:bg-red-500/20 transition-colors text-xs font-bold"
                    >
                      <Trash2 size={14} /> DELETE TRANSMISSION
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                      <Mail size={48} className="mb-4" />
                      <p className="font-mono text-sm">NO NEW TRANSMISSIONS</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleSelectMessage(msg)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all group relative overflow-hidden ${
                          msg.read 
                            ? 'bg-transparent border-white/5 hover:bg-white/5' 
                            : 'bg-[#00ffd5]/5 border-[#00ffd5]/30 hover:bg-[#00ffd5]/10'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {getIcon(msg.type)}
                            <span className={`text-sm font-bold ${msg.read ? 'text-gray-400' : 'text-white'}`}>
                              {msg.subject}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-600 font-mono">
                            {new Date(msg.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-500 truncate font-mono pl-6">
                          {msg.content}
                        </p>

                        <button
                          onClick={(e) => handleDelete(e, msg.id)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Mailbox;
