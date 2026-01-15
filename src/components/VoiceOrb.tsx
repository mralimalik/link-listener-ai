import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Mic } from 'lucide-react';

type VoiceState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'disconnecting';

interface VoiceOrbProps {
  state: VoiceState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const VoiceOrb = ({ state, onConnect, onDisconnect }: VoiceOrbProps) => {
  const isActive = state !== 'idle' && state !== 'disconnecting';
  const isConnecting = state === 'connecting';
  const isSpeaking = state === 'speaking';
  const isListening = state === 'listening';

  const getStatusText = () => {
    switch (state) {
      case 'idle': return 'Tap to start';
      case 'connecting': return 'Connecting...';
      case 'listening': return 'Listening...';
      case 'speaking': return 'AI Speaking...';
      case 'disconnecting': return 'Ending...';
      default: return '';
    }
  };

  const getOrbGradient = () => {
    if (isSpeaking) return 'from-violet-500 via-purple-500 to-fuchsia-500';
    if (isListening) return 'from-emerald-500 via-teal-500 to-cyan-500';
    if (isConnecting) return 'from-amber-500 via-orange-500 to-red-500';
    return 'from-violet-500 via-purple-500 to-pink-500';
  };

  const getGlowClass = () => {
    if (isSpeaking) return 'glow-accent';
    if (isListening) return 'glow-emerald';
    return 'glow-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col items-center space-y-8"
    >
      {/* Orb container */}
      <div className="relative">
        {/* Pulse rings when active */}
        <AnimatePresence>
          {isActive && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  className={`absolute inset-0 rounded-full border ${
                    isSpeaking ? 'border-accent/30' : 
                    isListening ? 'border-emerald-500/30' : 
                    'border-primary/30'
                  }`}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: [1, 2 + i * 0.4],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: isSpeaking ? 0.6 : 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Sound wave bars when speaking */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`bar-${i}`}
                  className="w-1 bg-white/80 rounded-full"
                  animate={{
                    height: [12, 32 + Math.random() * 20, 12],
                  }}
                  transition={{
                    duration: 0.3 + Math.random() * 0.2,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main orb button */}
        <motion.button
          onClick={isActive ? onDisconnect : onConnect}
          disabled={isConnecting || state === 'disconnecting'}
          className={`relative w-28 h-28 rounded-full bg-gradient-to-br ${getOrbGradient()} ${getGlowClass()} transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed shadow-2xl`}
          whileHover={{ scale: isActive ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isActive ? {
            scale: isSpeaking ? [1, 1.08, 1] : [1, 1.03, 1],
          } : {}}
          transition={{
            duration: isSpeaking ? 0.3 : 2,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {/* Shine overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/25" />

          {/* Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              {isActive ? (
                isListening || isSpeaking ? (
                  <Mic className="w-8 h-8 text-white" />
                ) : (
                  <PhoneOff className="w-8 h-8 text-white" />
                )
              ) : (
                <Phone className="w-8 h-8 text-white" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Status */}
      <motion.div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <motion.div
            className={`w-2 h-2 rounded-full ${
              isSpeaking ? 'bg-accent' :
              isListening ? 'bg-emerald-500' :
              isConnecting ? 'bg-amber-500' :
              'bg-primary'
            }`}
            animate={{
              scale: isActive ? [1, 1.5, 1] : 1,
              opacity: isActive ? [1, 0.5, 1] : 1,
            }}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
          />
          <motion.span
            key={state}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-medium text-foreground"
          >
            {getStatusText()}
          </motion.span>
        </div>
        
        <p className="text-xs text-muted-foreground">
          {isActive ? 'Click to end call' : 'Start voice conversation'}
        </p>
      </motion.div>
    </motion.div>
  );
};
