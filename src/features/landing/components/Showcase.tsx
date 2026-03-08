import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Smartphone, Monitor, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const showcaseFeatures = [
  "Story-style swipeable pages",
  "Live countdown timers",
  "Interactive RSVP forms",
  "Background music player",
  "Particle effects & animations",
  "Password-protected events",
  "Real-time guest tracking",
  "Custom theme engine",
  "Drag-and-drop block editor",
  "Guest message wall",
];

const mockScreens = [
  { emoji: "✨", title: "You're Invited", subtitle: "Sofia's 18th Birthday" },
  { emoji: "💍", title: "Save the Date", subtitle: "James & Ana's Wedding" },
  { emoji: "🎂", title: "Join the Party", subtitle: "Carlo's Birthday Bash" },
];

export function Showcase() {
  const [activeScreen, setActiveScreen] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % mockScreens.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const screen = mockScreens[activeScreen];

  return (
    <section className="py-20 sm:py-28 overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Mobile-First</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Beautiful on Every Device
            </h2>
            <p className="text-muted-foreground mb-8 text-base sm:text-lg leading-relaxed">
              Your invitations look stunning on mobile, tablet, and desktop. Full-screen story navigation
              with swipe gestures, smooth animations, and responsive layouts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {showcaseFeatures.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 py-1.5 group"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Check className="h-3 w-3 text-foreground" />
                  </div>
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
            <Button asChild className="rounded-full shadow-md" size="lg">
              <Link to="/auth">
                Try It Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center order-1 lg:order-2"
          >
            {/* Phone mockup */}
            <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px]">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 rounded-[3rem] border-[6px] border-foreground/15 bg-card overflow-hidden shadow-2xl">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-foreground/15 rounded-b-2xl z-10" />
                  {/* Screen content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeScreen}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="text-center w-full"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="w-14 h-14 rounded-full bg-primary/10 mb-5 flex items-center justify-center mx-auto"
                        >
                          <span className="text-2xl">{screen.emoji}</span>
                        </motion.div>
                        <p className="font-display text-lg font-bold mb-1">{screen.title}</p>
                        <p className="text-xs text-muted-foreground mb-5">{screen.subtitle}</p>
                        <div className="flex gap-3 justify-center mb-5">
                          {[
                            { val: "07", label: "Days" },
                            { val: "14", label: "Hrs" },
                            { val: "21", label: "Min" },
                            { val: "28", label: "Sec" },
                          ].map((d) => (
                            <div key={d.label} className="text-center bg-accent/50 rounded-xl px-2.5 py-2">
                              <div className="text-lg font-bold font-display">{d.val}</div>
                              <div className="text-[10px] text-muted-foreground">{d.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="h-px bg-border w-full mb-4" />
                        <p className="text-[10px] text-muted-foreground">Swipe to explore →</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  {/* Progress dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {mockScreens.map((_, d) => (
                      <motion.div
                        key={d}
                        animate={{ width: d === activeScreen ? 16 : 6 }}
                        className={`h-1.5 rounded-full transition-colors ${d === activeScreen ? "bg-foreground" : "bg-border"}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
              {/* Glow effect */}
              <div className="absolute -inset-4 rounded-[4rem] bg-primary/5 blur-2xl -z-10" />
              
              {/* Floating device indicators */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -left-16 top-1/4 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-lg text-xs"
              >
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="absolute -right-16 top-2/3 hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-lg text-xs"
              >
                <Monitor className="h-3.5 w-3.5" /> Desktop
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
