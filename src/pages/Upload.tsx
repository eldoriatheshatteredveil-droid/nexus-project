import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Image as ImageIcon, FileCode, Cpu, Tag, Type, AlignLeft, Save, Zap } from 'lucide-react';
import { useCyberSound } from '../hooks/useCyberSound';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { Game, GENRES } from '../data/games';
import GameCardHolographic from '../components/GameCardHolographic';
import CustomDropdown from '../components/CustomDropdown';

const Upload: React.FC = () => {
  const { playHover, playClick, playSwitch } = useCyberSound();
  const addGame = useStore((state) => state.addGame);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'ai' | 'dev'>('ai');
  const [genre, setGenre] = useState(GENRES[0]);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    playSwitch();
    // Handle file drop logic here
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
        playSwitch();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    if (!user) return;

    const newGame: Game = {
      id: `game-${Date.now()}`,
      title: title || 'Untitled Project',
      slug: (title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: 0,
      payWhatYouWant: true,
      cover: coverImage || `https://source.unsplash.com/900x900/?cyberpunk,game&sig=${Date.now()}`,
      description: description || 'No description provided.',
      tags: [genre, 'Indie', 'New Release'],
      rating: 0,
      downloads: 0,
      category: category,
      uploaderId: user.id,
      uploaderName: user.username
    };

    addGame(newGame);
    navigate('/');
  };

  // Preview Game Object
  const previewGame: Game = {
    id: 'preview',
    title: title || 'PROJECT TITLE',
    slug: 'preview',
    price: 0,
    payWhatYouWant: true,
    cover: coverImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000',
    description: description || 'System description pending...',
    tags: [genre, category === 'ai' ? 'AI Generated' : 'Dev Made'],
    rating: 5.0,
    downloads: 0,
    category: category
  };

  return (
    <div className="min-h-screen pb-20 container mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-orbitron tracking-wide text-white flex items-center gap-3">
              <UploadIcon className="text-[#00ffd5]" size={32} />
              UPLOAD PROTOCOL
            </h1>
            <p className="text-gray-400 font-mono text-sm mt-2">INITIALIZE DEPLOYMENT SEQUENCE</p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-2 text-[#00ffd5] bg-[#00ffd5]/10 px-4 py-2 rounded-full border border-[#00ffd5]/30">
              <Zap size={16} className="animate-pulse" />
              <span className="font-mono text-xs font-bold">SYSTEM READY</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-6"
          >
            {/* File Upload Zone */}
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 group overflow-hidden ${
                dragActive 
                  ? "border-[#00ffd5] bg-[#00ffd5]/5 shadow-[0_0_30px_rgba(0,255,213,0.15)]" 
                  : "border-white/10 hover:border-[#00ffd5]/50 bg-black/40 backdrop-blur-sm"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,213,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00ffd5]/20 to-[#ff66cc]/20 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <FileCode className="w-10 h-10 text-[#00ffd5]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-orbitron">DROP GAME BUILD</h3>
                <p className="text-sm text-gray-400 font-mono">.ZIP .RAR .EXE (MAX 5GB)</p>
              </div>
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={playSwitch} />
            </div>

            {/* Metadata Form */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#00ffd5] uppercase tracking-wider select-none">
                    <Type size={14} /> Project Title
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffd5] focus:shadow-[0_0_15px_rgba(0,255,213,0.2)] transition-all font-orbitron"
                    placeholder="ENTER TITLE..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={playHover}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#ff66cc] uppercase tracking-wider select-none">
                    <Tag size={14} /> Version
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff66cc] focus:shadow-[0_0_15px_rgba(255,102,204,0.2)] transition-all font-mono"
                    placeholder="v1.0.0"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    onFocus={playHover}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider select-none">
                    <Cpu size={14} /> Category
                  </label>
                  <CustomDropdown
                    options={[
                      { label: 'AI TOOLS', value: 'ai' },
                      { label: 'INDIE GAMES', value: 'dev' }
                    ]}
                    value={category}
                    onChange={(val) => setCategory(val as 'ai' | 'dev')}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider select-none">
                    <Tag size={14} /> Genre
                  </label>
                  <CustomDropdown
                    options={GENRES.map(g => ({ label: g.toUpperCase(), value: g }))}
                    value={genre}
                    onChange={(val) => setGenre(val)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider select-none">
                    <AlignLeft size={14} /> Description
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffd5] transition-all resize-none"
                  placeholder="SYSTEM DESCRIPTION..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onFocus={playHover}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Preview & Cover */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[400px] space-y-6"
          >
            {/* Live Preview Card */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap size={14} className="text-[#00ffd5]" /> Live Preview
              </h3>
              <div className="flex justify-center">
                <GameCardHolographic game={previewGame} />
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={14} /> Cover Art
              </h3>
              
              <div className="relative aspect-[16/9] bg-black/50 rounded-xl overflow-hidden border-2 border-dashed border-white/10 group hover:border-[#00ffd5]/50 transition-colors">
                {coverImage ? (
                  <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <span className="text-xs font-mono">NO SIGNAL</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <span className="text-[#00ffd5] font-bold text-sm flex items-center gap-2">
                    <UploadIcon size={16} /> CHANGE IMAGE
                  </span>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-[10px] text-gray-500 font-mono text-center">RECOMMENDED: 1600x900px JPG/PNG</p>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleSubmit}
              className="w-full py-4 bg-[#00ffd5] text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,255,213,0.4)] hover:shadow-[0_0_40px_rgba(0,255,213,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
              onMouseEnter={playHover}
            >
              <Save className="group-hover:animate-bounce" />
              DEPLOY TO NEXUS
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
