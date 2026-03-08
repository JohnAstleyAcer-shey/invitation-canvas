import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function SectionWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-screen w-full flex items-center justify-center overflow-y-auto ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl mx-auto px-6 py-12 text-center"
      >
        {children}
      </motion.div>
    </div>
  );
}

export { itemVariants };
