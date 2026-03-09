import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight, MessageCircle, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Maria Santos",
    event: "Debut",
    quote: "LynxInvitation made my daughter's 18th birthday truly magical. The 18 Roses section was breathtaking and all our guests loved the interactive RSVP!",
    rating: 5,
    avatar: "MS",
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    name: "James & Ana Cruz",
    event: "Wedding",
    quote: "Our wedding invitation was so elegant. Guests loved the countdown timer, gallery, and the seamless RSVP system. Worth every peso!",
    rating: 5,
    avatar: "JA",
    color: "from-purple-500/20 to-violet-500/20",
  },
  {
    name: "Carlo Reyes",
    event: "Corporate",
    quote: "Professional and sleek — perfect for our company's annual gala. The analytics dashboard helped us track attendance in real-time.",
    rating: 5,
    avatar: "CR",
    color: "from-blue-500/20 to-indigo-500/20",
  },
  {
    name: "Sofia Mendoza",
    event: "Birthday",
    quote: "The story-style navigation made my birthday invitation feel like a beautiful journey. My friends couldn't stop talking about it!",
    rating: 5,
    avatar: "SM",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    name: "Angela & Mark Tan",
    event: "Christening",
    quote: "Such a gentle and beautiful invitation for our baby's christening. The timeline feature was perfect for our ceremony schedule.",
    rating: 5,
    avatar: "AT",
    color: "from-teal-500/20 to-cyan-500/20",
  },
  {
    name: "Patricia Luna",
    event: "Debut",
    quote: "The customer portal let me manage my own guest list. So convenient! The password protection kept everything private until the big reveal.",
    rating: 5,
    avatar: "PL",
    color: "from-fuchsia-500/20 to-pink-500/20",
  },
  {
    name: "David & Celine Lim",
    event: "Wedding",
    quote: "The block editor gave us complete creative control. Our invitation looked like it was designed by a professional agency. Incredible value!",
    rating: 5,
    avatar: "DL",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    name: "Rico Fernandez",
    event: "Corporate",
    quote: "Managing 500+ guests for our conference was seamless. The bulk import and CSV export saved us hours of manual work.",
    rating: 5,
    avatar: "RF",
    color: "from-red-500/20 to-rose-500/20",
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="glass-card p-5 sm:p-6 flex flex-col hover:shadow-lg transition-all duration-500 group relative overflow-hidden"
    >
      {/* Background gradient */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${testimonial.color}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Rating stars */}
      <div className="relative flex gap-0.5 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, j) => (
          <motion.div
            key={j}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + j * 0.05, type: "spring" }}
          >
            <Star className="h-4 w-4 fill-foreground text-foreground" />
          </motion.div>
        ))}
      </div>

      {/* Quote icon */}
      <motion.div
        animate={isHovered ? { scale: 1.1, rotate: -5 } : { scale: 1, rotate: 0 }}
        transition={{ type: "spring" }}
      >
        <Quote className="relative h-5 w-5 text-muted-foreground/30 mb-3 group-hover:text-primary/30 transition-colors" />
      </motion.div>

      {/* Quote text */}
      <p className="relative text-sm mb-6 leading-relaxed flex-1">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="relative flex items-center gap-3 pt-4 border-t border-border">
        <motion.div 
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-xs font-bold`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring" }}
        >
          {testimonial.avatar}
        </motion.div>
        <div>
          <p className="font-display font-semibold text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {testimonial.event} Event
          </p>
        </div>
      </div>

      {/* Floating heart on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            className="absolute top-4 right-4"
          >
            <Heart className="h-5 w-5 text-red-400 fill-red-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Testimonials() {
  const [activePage, setActivePage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Auto-rotate testimonials
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActivePage((prev) => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalPages, isPaused]);

  const visibleTestimonials = testimonials.slice(
    activePage * itemsPerPage,
    activePage * itemsPerPage + itemsPerPage
  );

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="section-container relative" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Testimonials
          </motion.span>
          <motion.h2 
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Loved by Clients
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            See what our customers have to say about their experience
          </motion.p>
          
          {/* Average rating */}
          <motion.div 
            className="flex items-center justify-center gap-2 mt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.05, type: "spring" }}
                >
                  <Star className="h-4 w-4 fill-foreground text-foreground" />
                </motion.div>
              ))}
            </div>
            <motion.span 
              className="text-sm font-bold"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              4.9/5
            </motion.span>
            <motion.span 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8 }}
            >
              from {testimonials.length}+ reviews
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Testimonials grid */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {visibleTestimonials.map((t, i) => (
                <TestimonialCard key={t.name} testimonial={t} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination dots + arrows */}
        <motion.div 
          className="flex items-center justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setActivePage((prev) => (prev - 1 + totalPages) % totalPages)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </motion.div>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActivePage(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activePage ? "w-6 h-2 bg-foreground" : "w-2 h-2 bg-border hover:bg-muted-foreground"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                layout
              />
            ))}
          </div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setActivePage((prev) => (prev + 1) % totalPages)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-accent/50 border border-border/50">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">
              <span className="font-semibold">10,000+</span> happy customers and counting
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
