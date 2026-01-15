import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Link as LinkIcon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LinkInputProps {
  onAnalyze: (urls: string[]) => void;
  isAnalyzing: boolean;
}

export const LinkInput = ({ onAnalyze, isAnalyzing }: LinkInputProps) => {
  const [links, setLinks] = useState<string[]>(['']);

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
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl font-semibold text-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Add Your Links
        </motion.h2>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Paste the URLs you want the AI to learn about
        </motion.p>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {links.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex gap-3 items-center"
            >
              <div className="relative flex-1">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="url"
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  placeholder="https://example.com"
                  className="pl-11 h-12 glass border-gradient bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50"
                  disabled={isAnalyzing}
                />
              </div>
              {links.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeLink(index)}
                  className="p-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  disabled={isAnalyzing}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={addLink}
          variant="outline"
          className="flex-1 h-12 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-all"
          disabled={isAnalyzing}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Link
        </Button>

        <Button
          onClick={handleAnalyze}
          disabled={!hasValidLinks || isAnalyzing}
          className="flex-1 h-12 bg-gradient-to-r from-glow-cyan to-glow-purple text-primary-foreground font-semibold hover:opacity-90 transition-all glow-cyan disabled:opacity-50 disabled:glow-none"
        >
          {isAnalyzing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Analyze Content
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
