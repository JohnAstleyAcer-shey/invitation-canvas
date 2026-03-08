import { motion } from "framer-motion";

export function SectionWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-screen w-full flex items-center justify-center overflow-y-auto ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="w-full max-w-2xl mx-auto px-6 py-12 text-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
