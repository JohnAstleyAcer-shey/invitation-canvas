import { motion } from "framer-motion";
import { Check } from "lucide-react";

const showcaseFeatures = [
  "Story-style swipeable pages",
  "Live countdown timers",
  "Interactive RSVP forms",
  "Background music player",
  "Particle effects & animations",
  "Password-protected events",
  "Real-time guest tracking",
  "Custom theme engine",
];

export function Showcase() {
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {showcaseFeatures.map((item) => (
                <div key={item} className="flex items-center gap-3 py-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-foreground" />
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center order-1 lg:order-2"
          >
            {/* Phone mockup */}
            <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px] animate-float">
              <div className="absolute inset-0 rounded-[3rem] border-[6px] border-foreground/15 bg-card overflow-hidden shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-foreground/15 rounded-b-2xl z-10" />
                {/* Screen content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-14 h-14 rounded-full bg-primary/10 mb-5 flex items-center justify-center"
                  >
                    <span className="text-2xl">✨</span>
                  </motion.div>
                  <div className="text-center w-full">
                    <p className="font-display text-lg font-bold mb-1">You're Invited</p>
                    <p className="text-xs text-muted-foreground mb-5">Sofia's 18th Birthday</p>
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
                  </div>
                </div>
                {/* Progress dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((d) => (
                    <div key={d} className={`w-1.5 h-1.5 rounded-full transition-colors ${d === 0 ? "bg-foreground w-4" : "bg-border"}`} />
                  ))}
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 rounded-[4rem] bg-primary/5 blur-2xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
