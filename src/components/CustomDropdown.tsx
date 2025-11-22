import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCyberSound } from '../hooks/useCyberSound';

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick } = useCyberSound();

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    playClick();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full select-none" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => { setIsOpen(!isOpen); playClick(); }}
        className={`w-full flex items-center justify-between bg-black/50 border rounded-xl p-4 text-white transition-all duration-300 ${
          isOpen 
            ? 'border-[#00ffd5] shadow-[0_0_15px_rgba(0,255,213,0.2)]' 
            : 'border-white/10 hover:bg-white/5 hover:border-[#00ffd5]/50'
        }`}
        onMouseEnter={playHover}
      >
        <span className={`font-mono ${!selectedOption ? 'text-gray-500' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-[#00ffd5] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0f] border border-[#00ffd5]/30 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                onMouseEnter={playHover}
                className={`w-full text-left px-4 py-3 text-sm font-mono transition-colors border-b border-white/5 last:border-0 ${
                  value === option.value 
                    ? 'bg-[#00ffd5]/20 text-[#00ffd5]' 
                    : 'text-gray-300 hover:bg-[#00ffd5]/10 hover:text-[#00ffd5]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
