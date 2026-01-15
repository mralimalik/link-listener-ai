import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const loadingPhrases = [
  "Connecting to pages...",
  "Reading content...",
  "Extracting knowledge...",
  "Building context...",
  "Almost ready...",
];

interface AnalyzingAnimationProps {
  progress: number;
}

export const AnalyzingAnimation = ({ progress }: AnalyzingAnimationProps) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center space-y-10"
    >
      {/* Animated orb */}
      <div className="relative w-32 h-32">
        {/* Outer rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/20"
            animate={{
              scale: [1, 1.5 + i * 0.3],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Core orb */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-primary glow-primary"
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner shine */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-t from-transparent via-white/20 to-white/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating particles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{ top: '50%', left: '50%' }}
            animate={{
              x: [0, Math.cos((i / 4) * Math.PI * 2) * 60, 0],
              y: [0, Math.sin((i / 4) * Math.PI * 2) * 60, 0],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Progress section */}
      <div className="flex flex-col items-center gap-4 w-64">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Loading text */}
        <motion.p
          key={phraseIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-muted-foreground"
        >
          {loadingPhrases[phraseIndex]}
        </motion.p>

        <p className="text-xs text-muted-foreground/60">
          {Math.round(progress)}% complete
        </p>
      </div>
    </motion.div>
  );
};
