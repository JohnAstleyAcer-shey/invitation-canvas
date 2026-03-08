import { motion } from "framer-motion";

export function Showcase() {
  return (
    <section className="py-24 overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Beautiful on Every Device
            </h2>
            <p className="text-muted-foreground mb-6">
              Your invitations look stunning on mobile, tablet, and desktop. Full-screen story navigation
              with swipe gestures, smooth animations, and responsive layouts.
            </p>
            <ul className="space-y-3 text-sm">
              {["Story-style swipeable pages", "Live countdown timers", "Interactive RSVP forms", "Background music player"].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            {/* Phone mockup */}
            <div className="relative w-[280px] h-[560px] animate-float">
              <div className="absolute inset-0 rounded-[3rem] border-[6px] border-foreground/20 bg-card overflow-hidden shadow-xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-foreground/20 rounded-b-2xl z-10" />
                {/* Screen content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mb-6" />
                  <div className="text-center">
                    <p className="font-display text-lg font-bold mb-1">You're Invited</p>
                    <p className="text-xs text-muted-foreground mb-4">Sofia's 18th Birthday</p>
                    <div className="flex gap-2 justify-center mb-4">
                      {[1, 2, 3, 4].map((d) => (
                        <div key={d} className="text-center">
                          <div className="text-lg font-bold font-display">{d * 7}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {["Days", "Hrs", "Min", "Sec"][d - 1]}
                          </div>
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
                    <div key={d} className={`w-1.5 h-1.5 rounded-full ${d === 0 ? "bg-foreground" : "bg-border"}`} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
