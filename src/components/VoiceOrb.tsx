import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';

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
      case 'idle': return 'Ready to Talk';
      case 'connecting': return 'Connecting...';
      case 'listening': return 'Listening...';
      case 'speaking': return 'Speaking...';
      case 'disconnecting': return 'Disconnecting...';
      default: return '';
    }
  };

  const getOrbColor = () => {
    switch (state) {
      case 'speaking': return 'from-glow-purple via-glow-cyan to-glow-purple';
      case 'listening': return 'from-glow-cyan via-glow-green to-glow-cyan';
      case 'connecting':
      case 'disconnecting': return 'from-amber-500 via-orange-500 to-amber-500';
      default: return 'from-glow-cyan via-glow-purple to-glow-cyan';
    }
  };

  const getGlowClass = () => {
    switch (state) {
      case 'speaking': return 'glow-purple';
      case 'listening': return 'glow-green';
      default: return 'glow-cyan';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center space-y-8"
    >
      {/* Main voice orb container */}
      <div className="relative">
        {/* Outer pulse rings when active */}
        <AnimatePresence>
          {isActive && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  className={`absolute inset-0 rounded-full border-2 ${
                    isSpeaking ? 'border-glow-purple/40' : 
                    isListening ? 'border-glow-green/40' : 
                    'border-glow-cyan/40'
                  }`}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{
                    scale: [1, 1.8 + i * 0.3],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: isSpeaking ? 0.8 : 1.5,
                    repeat: Infinity,
                    delay: i * (isSpeaking ? 0.2 : 0.4),
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Audio wave bars for speaking */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`wave-${i}`}
                  className="w-1 mx-0.5 bg-glow-purple rounded-full"
                  animate={{
                    height: [16, 40 + Math.random() * 20, 16],
                  }}
                  transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    delay: i * 0.1,
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
          className={`relative w-40 h-40 rounded-full bg-gradient-to-br ${getOrbColor()} ${getGlowClass()} transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed`}
          whileHover={{ scale: isActive ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isActive ? {
            scale: isSpeaking ? [1, 1.1, 1] : [1, 1.02, 1],
          } : {}}
          transition={{
            duration: isSpeaking ? 0.4 : 1.5,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {/* Inner gradient overlay */}
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              {isActive ? (
                state === 'listening' ? (
                  <Mic className="w-12 h-12 text-primary-foreground" />
                ) : state === 'speaking' ? (
                  <Mic className="w-12 h-12 text-primary-foreground" />
                ) : (
                  <PhoneOff className="w-12 h-12 text-primary-foreground" />
                )
              ) : (
                <Phone className="w-12 h-12 text-primary-foreground" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Status indicator */}
      <motion.div
        className="flex items-center space-x-3"
        animate={{ opacity: 1 }}
      >
        <motion.div
          className={`w-3 h-3 rounded-full ${
            isSpeaking ? 'bg-glow-purple' :
            isListening ? 'bg-glow-green' :
            isConnecting ? 'bg-amber-500' :
            'bg-glow-cyan'
          }`}
          animate={{
            scale: isActive ? [1, 1.3, 1] : 1,
            opacity: isActive ? [1, 0.6, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isActive ? Infinity : 0,
          }}
        />
        <motion.span
          key={state}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-medium text-foreground"
        >
          {getStatusText()}
        </motion.span>
      </motion.div>

      {/* Action hint */}
      <motion.p
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {isActive ? 'Click to disconnect' : 'Click to start talking'}
      </motion.p>
    </motion.div>
  );
};
