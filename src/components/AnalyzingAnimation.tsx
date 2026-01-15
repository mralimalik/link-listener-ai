import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const loadingPhrases = [
  "Connecting to web pages...",
  "Reading content...",
  "Extracting knowledge...",
  "Processing information...",
  "Building AI memory...",
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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center space-y-8"
    >
      {/* Main orb */}
      <div className="relative w-48 h-48">
        {/* Outer glow rings */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-glow-cyan/30"
            animate={{
              scale: [1, 1.5 + i * 0.2],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Core orb */}
        <motion.div
          className="absolute inset-4 rounded-full bg-gradient-to-br from-glow-cyan via-glow-purple to-glow-cyan glow-cyan"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner shimmer */}
        <motion.div
          className="absolute inset-8 rounded-full bg-gradient-to-t from-transparent via-white/20 to-transparent"
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-glow-cyan"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [
                Math.cos((i / 6) * Math.PI * 2) * 80,
                Math.cos((i / 6) * Math.PI * 2 + Math.PI) * 80,
                Math.cos((i / 6) * Math.PI * 2 + Math.PI * 2) * 80,
              ],
              y: [
                Math.sin((i / 6) * Math.PI * 2) * 80,
                Math.sin((i / 6) * Math.PI * 2 + Math.PI) * 80,
                Math.sin((i / 6) * Math.PI * 2 + Math.PI * 2) * 80,
              ],
              scale: [1, 0.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-glow-cyan to-glow-purple"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Loading text */}
      <motion.p
        key={phraseIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-lg text-muted-foreground font-medium"
      >
        {loadingPhrases[phraseIndex]}
      </motion.p>

      <p className="text-sm text-muted-foreground/60">
        {progress}% complete
      </p>
    </motion.div>
  );
};
