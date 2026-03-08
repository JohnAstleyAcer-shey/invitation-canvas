import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicPlayerProps {
  url: string;
  autoplay?: boolean;
  loop?: boolean;
  volume?: number;
}

export function MusicPlayer({ url, autoplay = false, loop = true, volume = 0.5 }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
    }
  }, [volume, loop]);

  useEffect(() => {
    if (autoplay && audioRef.current) {
      audioRef.current.play().then(() => { setPlaying(true); setShowHint(false); }).catch(() => {});
    }
  }, [autoplay]);

  // Hide hint after 5 seconds
  useEffect(() => {
    if (showHint) {
      const t = setTimeout(() => setShowHint(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showHint]);

  const toggle = () => {
    if (!audioRef.current) return;
    setShowHint(false);
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={url} preload="auto" />
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        <AnimatePresence>
          {showHint && !playing && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="text-xs px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center gap-1.5"
            >
              <Music className="w-3 h-3" /> Tap to play music
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggle}
          className={`p-3 rounded-full backdrop-blur-md text-white transition-all ${
            playing ? "bg-black/40 hover:bg-black/50" : "bg-black/30 hover:bg-black/50 animate-pulse"
          }`}
          aria-label={playing ? "Mute music" : "Play music"}
        >
          {playing ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>
    </>
  );
}
