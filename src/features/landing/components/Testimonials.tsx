import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Maria Santos",
    event: "Debut",
    quote: "LynxInvitation made my daughter's 18th birthday truly magical. The 18 Roses section was breathtaking and all our guests loved the interactive RSVP!",
    rating: 5,
    avatar: "MS",
  },
  {
    name: "James & Ana Cruz",
    event: "Wedding",
    quote: "Our wedding invitation was so elegant. Guests loved the countdown timer, gallery, and the seamless RSVP system. Worth every peso!",
    rating: 5,
    avatar: "JA",
  },
  {
    name: "Carlo Reyes",
    event: "Corporate",
    quote: "Professional and sleek — perfect for our company's annual gala. The analytics dashboard helped us track attendance in real-time.",
    rating: 5,
    avatar: "CR",
  },
  {
    name: "Sofia Mendoza",
    event: "Birthday",
    quote: "The story-style navigation made my birthday invitation feel like a beautiful journey. My friends couldn't stop talking about it!",
    rating: 5,
    avatar: "SM",
  },
  {
    name: "Angela & Mark Tan",
    event: "Christening",
    quote: "Such a gentle and beautiful invitation for our baby's christening. The timeline feature was perfect for our ceremony schedule.",
    rating: 5,
    avatar: "AT",
  },
  {
    name: "Patricia Luna",
    event: "Debut",
    quote: "The customer portal let me manage my own guest list. So convenient! The password protection kept everything private until the big reveal.",
    rating: 5,
    avatar: "PL",
  },
  {
    name: "David & Celine Lim",
    event: "Wedding",
    quote: "The block editor gave us complete creative control. Our invitation looked like it was designed by a professional agency. Incredible value!",
    rating: 5,
    avatar: "DL",
  },
  {
    name: "Rico Fernandez",
    event: "Corporate",
    quote: "Managing 500+ guests for our conference was seamless. The bulk import and CSV export saved us hours of manual work.",
    rating: 5,
    avatar: "RF",
  },
];

export function Testimonials() {
  const [activePage, setActivePage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePage((prev) => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const visibleTestimonials = testimonials.slice(
    activePage * itemsPerPage,
    activePage * itemsPerPage + itemsPerPage
  );

  return (
    <section className="py-20 sm:py-28">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Loved by Clients</h2>
          <p className="text-muted-foreground max-w-md mx-auto">See what our customers have to say about their experience</p>
          
          {/* Average rating */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
              ))}
            </div>
            <span className="text-sm font-bold">4.9/5</span>
            <span className="text-xs text-muted-foreground">from {testimonials.length}+ reviews</span>
          </div>
        </motion.div>

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
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 sm:p-6 flex flex-col hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-foreground text-foreground" />
                  ))}
                </div>
                <Quote className="h-5 w-5 text-muted-foreground/30 mb-3 group-hover:text-primary/30 transition-colors" />
                <p className="text-sm mb-6 leading-relaxed flex-1">{t.quote}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold group-hover:scale-110 transition-transform">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.event} Event</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination dots + arrows */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setActivePage((prev) => (prev - 1 + totalPages) % totalPages)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePage(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activePage ? "w-6 h-2 bg-foreground" : "w-2 h-2 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setActivePage((prev) => (prev + 1) % totalPages)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
