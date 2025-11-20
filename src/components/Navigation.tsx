import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/winners", label: "Winners" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" }
];

const mobileMenuVariants = {
  hidden: { opacity: 0, transition: { duration: 0.3, ease: "easeOut" } },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeIn", when: "beforeChildren", staggerChildren: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: "easeOut", when: "afterChildren", staggerChildren: 0.08, staggerDirection: -1 } },
};

const mobileLinkVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
  exit: { y: 20, opacity: 0 },
};

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // --- NEW: Handle navbar style on scroll ---
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- NEW: Lock body scroll when mobile menu is open ---
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
        document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* --- UPDATED: Navbar transitions smoothly on scroll --- */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          hasScrolled ? "bg-background/80 backdrop-blur-lg border-b border-primary/10 shadow-md" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/photos/mrisa.jpg" alt="MRISA Logo" className="h-9 w-auto transition-transform duration-300 group-hover:scale-105" />
            </Link>

            <div className="hidden md:flex items-center space-x-2 bg-black/20 border border-primary/10 rounded-full px-2">
              {navItems.map((item) => (
                <Link key={item.href} to={item.href} className="relative font-mono text-sm uppercase tracking-wider transition-colors duration-300 px-4 py-2 rounded-full text-muted-foreground hover:text-primary">
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-full z-0"
                      initial={false}
                      // --- UPDATED: Refined spring animation ---
                      transition={{ type: "spring", stiffness: 280, damping: 30 }} 
                    />
                  )}
                  <span className={`relative z-10 ${location.pathname === item.href ? 'text-background' : ''}`}>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="md:hidden">
              <button onClick={toggleMenu} className="relative w-8 h-8 text-primary z-50" aria-label="Toggle Menu">
                  {/* --- NEW: Animated Menu/X icon --- */}
                  <AnimatePresence initial={false}>
                      <motion.div
                          key={isOpen ? "x" : "menu"}
                          initial={{ rotate: 45, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -45, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex items-center justify-center"
                      >
                          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                      </motion.div>
                  </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <AnimatePresence>
          {isOpen && (
            <motion.div variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit" className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden">
              <div className="flex flex-col items-center justify-center h-full text-center">
                  {navItems.map((item) => (
                    <motion.div key={item.href} variants={mobileLinkVariants} className="my-4">
                      <Link to={item.href} onClick={toggleMenu} className={`text-2xl font-mono uppercase tracking-widest transition-colors duration-300 ${location.pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"}`}>
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      <div className="h-16" />
    </>
  );
};
