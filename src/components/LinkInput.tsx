import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Globe, Sparkles, Wand2, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LinkInputProps {
  onAnalyze: (urls: string[]) => void;
  isAnalyzing: boolean;
}

export const LinkInput = ({ onAnalyze, isAnalyzing }: LinkInputProps) => {
  const [links, setLinks] = useState<string[]>(['']);
  const [isHovered, setIsHovered] = useState(false);

  const addLink = () => {
    setLinks([...links, '']);
  };

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
    }
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleAnalyze = () => {
    const validLinks = links.filter(link => link.trim() !== '');
    if (validLinks.length > 0) {
      onAnalyze(validLinks);
    }
  };

  const hasValidLinks = links.some(link => link.trim() !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass rounded-2xl p-6 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {links.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2 items-center"
              >
                <div className="relative flex-1 group">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="url"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    placeholder="Enter website URL..."
                    className="pl-10 h-12 bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
                    disabled={isAnalyzing}
                  />
                </div>
                {links.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeLink(index)}
                    className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    disabled={isAnalyzing}
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex gap-3 mt-5">
          <Button
            onClick={addLink}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all"
            disabled={isAnalyzing}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>

          {/* Premium AI Analyze Button */}
          <motion.button
            onClick={handleAnalyze}
            disabled={!hasValidLinks || isAnalyzing}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex-1 h-12 rounded-xl font-semibold text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600"
              animate={{
                backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600" />

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <BrainCircuit className="h-5 w-5" />
                  </motion.div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <motion.div
                    animate={isHovered ? { rotate: [0, 15, -15, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Wand2 className="h-5 w-5" />
                  </motion.div>
                  <span>Analyze with AI</span>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                </>
              )}
            </span>

            {/* Shadow */}
            <div className="absolute inset-0 rounded-xl shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow duration-300" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
