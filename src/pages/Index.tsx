import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronLeft, ExternalLink } from 'lucide-react';
import { LinkInput } from '@/components/LinkInput';
import { AnalyzingAnimation } from '@/components/AnalyzingAnimation';
import { VoiceOrb } from '@/components/VoiceOrb';
import { BackgroundEffects } from '@/components/BackgroundEffects';
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

    // Simulate progress while scraping
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const result = await firecrawlApi.scrapeMultiple(urls);

      clearInterval(progressInterval);

      if (result.success && result.data) {
        setProgress(100);
        setScrapedContent(result.data.combinedContent);
        setScrapedUrls(urls);
        
        toast({
          title: "Analysis Complete!",
          description: `Successfully analyzed ${result.data.successCount} of ${result.data.totalCount} pages.`,
        });

        // Short delay to show 100% before transitioning
        setTimeout(() => {
          setAppState('ready');
        }, 500);
      } else {
        throw new Error(result.error || 'Failed to analyze content');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      setAppState('input');
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      });
    }
  };

  const handleConnect = useCallback(async () => {
    setVoiceState('connecting');

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      chatRef.current = new RealtimeChat((event) => {
        console.log('Voice event:', event);
        
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
        title: "Connected!",
        description: "Start speaking to ask questions about the content.",
      });
    } catch (error) {
      console.error('Error connecting:', error);
      setVoiceState('idle');
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to voice agent',
        variant: "destructive",
      });
    }
  }, [scrapedContent, toast]);

  const handleDisconnect = useCallback(() => {
    setVoiceState('disconnecting');
    
    chatRef.current?.disconnect();
    chatRef.current = null;
    
    setTimeout(() => {
      setVoiceState('idle');
    }, 500);

    toast({
      title: "Disconnected",
      description: "Voice session ended.",
    });
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-glow-cyan to-glow-purple flex items-center justify-center glow-cyan">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">VoiceLink AI</h1>
            <p className="text-xs text-muted-foreground">Knowledge-powered voice agent</p>
          </div>
        </motion.div>

        <AnimatePresence>
          {appState === 'ready' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <AnimatePresence mode="wait">
          {appState === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-12">
                <motion.h2
                  className="text-4xl md:text-5xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-gradient">Talk to Any Website</span>
                </motion.h2>
                <motion.p
                  className="text-lg text-muted-foreground max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Add links, let AI analyze the content, then have a natural voice conversation about it.
                </motion.p>
              </div>
              <LinkInput onAnalyze={handleAnalyze} isAnalyzing={false} />
            </motion.div>
          )}

          {appState === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <AnalyzingAnimation progress={Math.round(progress)} />
            </motion.div>
          )}

          {appState === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  AI is Ready to Chat
                </h2>
                <p className="text-muted-foreground">
                  Knowledge loaded from {scrapedUrls.length} source{scrapedUrls.length > 1 ? 's' : ''}
                </p>
              </motion.div>

              {/* Sources pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-2 mb-12 max-w-2xl"
              >
                {scrapedUrls.map((url, i) => (
                  <motion.a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-secondary/50 border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    <span className="truncate max-w-[200px]">
                      {new URL(url.startsWith('http') ? url : `https://${url}`).hostname}
                    </span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </motion.a>
                ))}
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

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          Powered by AI • Built with Lovable
        </p>
      </footer>
    </div>
  );
};

export default Index;
