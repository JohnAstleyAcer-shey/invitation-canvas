import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function SectionWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref} className={`min-h-screen w-full flex items-center justify-center overflow-y-auto snap-start ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

export { itemVariants };
