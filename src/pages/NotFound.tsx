import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Compass } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-6">
      <SEOHead title="Page Not Found" description="The page you're looking for doesn't exist." />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-28 h-28 rounded-3xl bg-gradient-to-br from-accent to-muted mx-auto mb-8 flex items-center justify-center relative"
        >
          <span className="text-5xl font-display font-black text-muted-foreground/20">404</span>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <Compass className="h-4 w-4 text-primary/50" />
          </motion.div>
        </motion.div>

        <h1 className="text-3xl font-display font-black mb-3">Page not found</h1>
        <p className="text-muted-foreground mb-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-xs text-muted-foreground/60 mb-8">
          <code className="bg-muted px-2 py-1 rounded-md">{location.pathname}</code>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="rounded-full w-full sm:w-auto">
            <Link to="/"><Home className="w-4 h-4 mr-2" /> Go Home</Link>
          </Button>
          <Button variant="outline" className="rounded-full w-full sm:w-auto" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
