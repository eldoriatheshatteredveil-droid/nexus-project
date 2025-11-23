import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Image as ImageIcon, FileCode, Cpu, Tag, Type, AlignLeft, Save, Zap, Info, Users } from 'lucide-react';
import { useCyberSound } from '../hooks/useCyberSound';
import { useStore } from '../store';
import { useAuth } from '../hooks/useAuth';
import { Game, GENRES } from '../data/games';
import GameCardHolographic from '../components/GameCardHolographic';
import CustomDropdown from '../components/CustomDropdown';

const Upload: React.FC = () => {
  const { playHover, playClick, playSwitch } = useCyberSound();
  const addGame = useStore((state) => state.addGame);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'ai' | 'dev'>('ai');
  const [genre, setGenre] = useState(GENRES[0]);
  const [gameMode, setGameMode] = useState<'singleplayer' | 'multiplayer'>('singleplayer');
  const [gameType, setGameType] = useState<'browser' | 'download'>('browser');
  const [gameUrl, setGameUrl] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffd5]"></div>
      </div>
    );
  }

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
    
    // Simulate file handling by setting a fake download URL if one isn't provided
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (!gameUrl) {
        setGameUrl(`https://nexus-storage.system/files/${file.name}`);
        setGameType('download');
      }
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setError('');

    if (!user) {
      setError('User authentication lost. Please login again.');
      return;
    }

    if (!title.trim()) {
      setError('Project Title is required.');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the Upload Terms and certify your rights.');
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newGame: Game = {
      id: `game-${Date.now()}`,
      title: title || 'Untitled Project',
      slug: (title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      price: 0,
      payWhatYouWant: true,
      cover: coverImage || `https://source.unsplash.com/900x900/?cyberpunk,game&sig=${Date.now()}`,
      description: description || 'No description provided.',
      tags: [genre, 'Indie', 'New Release', gameMode === 'singleplayer' ? 'Single Player' : 'Multiplayer'],
      rating: 0,
      downloads: 0,
      category: category,
      mode: gameMode,
      uploaderId: user.id,
      uploaderName: user.username,
      type: gameType,
      embedUrl: gameType === 'browser' ? gameUrl : undefined,
      downloadUrl: gameType === 'download' ? gameUrl : undefined
    };

    addGame(newGame);
    setIsSubmitting(false);
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
    tags: [genre, category === 'ai' ? 'AI Generated' : 'Dev Made', gameMode === 'singleplayer' ? 'Single Player' : 'Multiplayer'],
    rating: 5.0,
    downloads: 0,
    category: category,
    mode: gameMode
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

        {/* Upload Guidelines Panel */}
        <div className="mb-8 bg-black/40 backdrop-blur-md border border-[#00ffd5]/30 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#00ffd5]" />
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#00ffd5]/10 rounded-full blur-3xl group-hover:bg-[#00ffd5]/20 transition-all" />
          
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-orbitron">
            <Info className="text-[#00ffd5]" size={24} />
            UPLOAD GUIDELINES
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300 font-mono">
            <div className="space-y-3">
              <h3 className="text-[#00ffd5] font-bold uppercase flex items-center gap-2">
                <span className="bg-[#00ffd5] text-black w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                Game Format
              </h3>
              <ul className="space-y-2 list-none pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#00ffd5] mt-1">›</span>
                  <span><strong className="text-white">HTML5 / WebGL:</strong> Upload a .ZIP file containing your game files. <span className="text-[#ff66cc]">index.html must be in the root folder</span> (not in a subfolder) for the game to load correctly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ffd5] mt-1">›</span>
                  <span><strong className="text-white">Downloadable:</strong> For Windows, Mac, or Linux builds. Upload .ZIP, .RAR, or .EXE files. Max file size: 1GB.</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-[#00ffd5] font-bold uppercase flex items-center gap-2">
                <span className="bg-[#00ffd5] text-black w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                Assets & Policy
              </h3>
              <ul className="space-y-2 list-none pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#00ffd5] mt-1">›</span>
                  <span><strong className="text-white">Cover Art:</strong> The first thing players see. Recommended size: <strong className="text-white">1600x900px</strong> (16:9 aspect ratio). JPG or PNG.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ffd5] mt-1">›</span>
                  <span><strong className="text-white">Free Games Only:</strong> NEXUS is a free-to-play platform. Do not upload demos that require payment elsewhere.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00ffd5] mt-1">›</span>
                  <span><strong className="text-white">Copyright:</strong> Ensure you own all assets or have permission. No pirated content.</span>
                </li>
              </ul>
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
            <div className="space-y-4">
              <div className="flex gap-4 bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setGameType('browser')}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${
                    gameType === 'browser' ? 'bg-[#00ffd5] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  WEB EMBED (URL)
                </button>
                <button
                  onClick={() => setGameType('download')}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${
                    gameType === 'download' ? 'bg-[#00ffd5] text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  DOWNLOADABLE BUILD
                </button>
              </div>

              {gameType === 'download' ? (
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
              ) : (
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#00ffd5] uppercase tracking-wider select-none">
                    <Zap size={14} /> Game Embed URL
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#00ffd5] focus:shadow-[0_0_15px_rgba(0,255,213,0.2)] transition-all font-mono"
                    placeholder="https://itch.io/embed/..."
                    value={gameUrl}
                    onChange={(e) => setGameUrl(e.target.value)}
                    onFocus={playHover}
                  />
                  <p className="text-xs text-gray-500">Supports Itch.io, Newgrounds, and HTML5 embed links.</p>
                </div>
              )}
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
                  <Users size={14} /> Game Mode
                </label>
                <div className="flex gap-4 bg-black/20 p-1 rounded-xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setGameMode('singleplayer')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      gameMode === 'singleplayer' ? 'bg-[#00ffd5] text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    SINGLE PLAYER
                  </button>
                  <button
                    type="button"
                    onClick={() => setGameMode('multiplayer')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      gameMode === 'multiplayer' ? 'bg-[#00ffd5] text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    MULTIPLAYER
                  </button>
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

              {/* Legal / Terms Checkbox */}
              <div className="pt-4 border-t border-white/10">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-1">
                    <input 
                      type="checkbox" 
                      className="peer sr-only"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <div className="w-5 h-5 border-2 border-white/30 rounded bg-black/50 peer-checked:bg-[#00ffd5] peer-checked:border-[#00ffd5] transition-all"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-black opacity-0 peer-checked:opacity-100 pointer-events-none">
                      <Zap size={12} fill="currentColor" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    <span className="font-bold text-white">I certify that I have the rights to upload this content.</span>
                    <br />
                    I confirm this project does not infringe on any third-party copyrights or trademarks. If AI tools were used, I have disclosed this in the description/tags. I agree to the <a href="/terms" className="text-[#00ffd5] hover:underline" target="_blank">Terms of Service</a>.
                  </div>
                </label>
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
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm font-mono text-center">
                ERROR: {error}
              </div>
            )}
            
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 bg-[#00ffd5] text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,255,213,0.4)] hover:shadow-[0_0_40px_rgba(0,255,213,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              onMouseEnter={playHover}
            >
              {isSubmitting ? (
                <>
                  <Zap className="animate-spin" />
                  DEPLOYING...
                </>
              ) : (
                <>
                  <Save className="group-hover:animate-bounce" />
                  DEPLOY TO NEXUS
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
