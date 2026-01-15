import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Globe, Sparkles, ArrowRight } from 'lucide-react';
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
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass rounded-2xl p-6 shadow-xl">
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
                <div className="relative flex-1">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    placeholder="Enter website URL..."
                    className="pl-10 h-12 bg-background border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl transition-all"
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
            className="flex-1 h-11 rounded-xl border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all"
            disabled={isAnalyzing}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>

          <Button
            onClick={handleAnalyze}
            disabled={!hasValidLinks || isAnalyzing}
            className="flex-1 h-11 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 disabled:shadow-none"
          >
            {isAnalyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            ) : (
              <>
                Analyze
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
