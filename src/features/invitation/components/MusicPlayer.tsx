import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  url: string;
  autoplay?: boolean;
  loop?: boolean;
  volume?: number;
}

export function MusicPlayer({ url, autoplay = false, loop = true, volume = 0.5 }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.loop = loop;
    }
  }, [volume, loop]);

  useEffect(() => {
    if (autoplay && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [autoplay]);

  const toggle = () => {
    if (!audioRef.current) return;
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
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-all"
        aria-label={playing ? "Mute music" : "Play music"}
      >
        {playing ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  );
}
