import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronLeft, ExternalLink, Zap } from 'lucide-react';
import { LinkInput } from '@/components/LinkInput';
import { AnalyzingAnimation } from '@/components/AnalyzingAnimation';
import { VoiceOrb } from '@/components/VoiceOrb';
import { BackgroundEffects } from '@/components/BackgroundEffects';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { firecrawlApi } from '@/lib/api/firecrawl';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { useToast } from '@/hooks/use-toast';

type AppState = 'input' | 'analyzing' | 'ready';
type VoiceState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'disconnecting';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [progress, setProgress] = useState(0);
  const [scrapedContent, setScrapedContent] = useState('');
  const [scrapedUrls, setScrapedUrls] = useState<string[]>([]);
  const chatRef = useRef<RealtimeChat | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (urls: string[]) => {
    setAppState('analyzing');
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 12;
      });
    }, 600);

    try {
      const result = await firecrawlApi.scrapeMultiple(urls);
      clearInterval(progressInterval);

      if (result.success && result.data) {
        setProgress(100);
        setScrapedContent(result.data.combinedContent);
        setScrapedUrls(urls);
        
        toast({
          title: "Analysis complete",
          description: `Loaded ${result.data.successCount} of ${result.data.totalCount} pages`,
        });

        setTimeout(() => setAppState('ready'), 400);
      } else {
        throw new Error(result.error || 'Failed to analyze');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setAppState('input');
      
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive",
      });
    }
  };

  const handleConnect = useCallback(async () => {
    setVoiceState('connecting');

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      chatRef.current = new RealtimeChat((event) => {
        if (event.type === 'response.audio.delta' || event.type === 'response.audio_transcript.delta') {
          setVoiceState('speaking');
        } else if (event.type === 'response.audio.done' || event.type === 'response.done') {
          setVoiceState('listening');
        } else if (event.type === 'input_audio_buffer.speech_started') {
          setVoiceState('listening');
        } else if (event.type === 'session.created' || event.type === 'session.updated') {
          setVoiceState('listening');
        }
      });

      await chatRef.current.init(scrapedContent);
      setVoiceState('listening');

      toast({
        title: "Connected",
        description: "Start speaking to ask questions",
      });
    } catch (error) {
      setVoiceState('idle');
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive",
      });
    }
  }, [scrapedContent, toast]);

  const handleDisconnect = useCallback(() => {
    setVoiceState('disconnecting');
    chatRef.current?.disconnect();
    chatRef.current = null;
    setTimeout(() => setVoiceState('idle'), 300);
    toast({ title: "Call ended" });
  }, [toast]);

  const handleReset = () => {
    chatRef.current?.disconnect();
    chatRef.current = null;
    setVoiceState('idle');
    setAppState('input');
    setScrapedContent('');
    setScrapedUrls([]);
    setProgress(0);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <BackgroundEffects />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">VoiceLink</h1>
          </div>
        </motion.div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {appState === 'ready' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  New
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <AnimatePresence mode="wait">
          {appState === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl"
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-subtle border border-primary/10 text-xs font-medium text-primary mb-5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered Voice Chat
                </motion.div>
                
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold text-foreground mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  Talk to any website
                </motion.h1>
                
                <motion.p
                  className="text-muted-foreground text-base max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Add links, let AI analyze them, then have a natural voice conversation about the content.
                </motion.p>
              </div>

              <LinkInput onAnalyze={handleAnalyze} isAnalyzing={false} />
            </motion.div>
          )}

          {appState === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AnalyzingAnimation progress={Math.round(progress)} />
            </motion.div>
          )}

          {appState === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Ready to chat
                </h2>
                <p className="text-sm text-muted-foreground">
                  {scrapedUrls.length} source{scrapedUrls.length > 1 ? 's' : ''} loaded
                </p>
              </motion.div>

              {/* Source pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap justify-center gap-2 mb-10 max-w-md"
              >
                {scrapedUrls.slice(0, 4).map((url, i) => (
                  <motion.a
                    key={i}
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span className="truncate max-w-[140px]">
                      {new URL(url.startsWith('http') ? url : `https://${url}`).hostname}
                    </span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-50" />
                  </motion.a>
                ))}
                {scrapedUrls.length > 4 && (
                  <span className="px-3 py-1.5 text-xs text-muted-foreground">
                    +{scrapedUrls.length - 4} more
                  </span>
                )}
              </motion.div>

              <VoiceOrb
                state={voiceState}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
