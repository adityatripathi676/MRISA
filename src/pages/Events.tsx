import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Calendar, Clock, Users, Trophy, ExternalLink, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Scene3D } from "@/components/Scene3D";

interface CTFEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  registration_link: string | null;
  status: "upcoming" | "active" | "past";
}

// Restyled Registration Modal
const RegistrationModal = ({ event, onClose }: { event: CTFEvent, onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: "", email: "", team_name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("registrations").insert([{
        event_id: event.id,
        name: formData.name,
        email: formData.email,
        team_name: formData.team_name || null,
      }]);
      if (error) throw error;
      toast({
        title: "Registration Successful!",
        description: `You're registered for ${event.title}. Check your email for confirmation.`,
      });
      onClose(); // Close modal on success
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="bg-[#121224]/70 backdrop-blur-md border border-blue-900/40 text-gray-200">
      <DialogHeader>
        <DialogTitle className="text-2xl font-sans text-green-400">
          Register for: {event.title}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6 pt-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </div>
        <div>
          <Label htmlFor="team_name">Team Name (Optional)</Label>
          <Input id="team_name" value={formData.team_name} onChange={(e) => setFormData({ ...formData, team_name: e.target.value })} />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-green-500 text-black hover:bg-green-400">
          {isSubmitting ? "Submitting..." : "Confirm Registration"}
        </Button>
      </form>
    </DialogContent>
  );
};

// 3D Interactive Event Card
const EventCard = ({ event }: { event: CTFEvent }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [-10, 10]);
  const rotateY = useTransform(x, [-150, 150], [10, -10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const statusStyles = {
    upcoming: { color: "border-green-500" },
    active: { color: "border-blue-500" },
    past: { color: "border-gray-600" },
  };

  const status = statusStyles[event.status] || statusStyles.past;

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative bg-[#121224]/70 backdrop-blur-md p-6 rounded-lg border ${status.color} transition-shadow duration-300 hover:shadow-2xl hover:shadow-green-500/10`}
      >
        <div style={{ transform: "translateZ(20px)" }}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-sans font-bold text-white mb-2">{event.title}</h3>
            <span className={`px-3 py-1 text-xs font-mono uppercase rounded-full bg-black/30`}>
              {event.status}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-6 line-clamp-3">{event.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
            <span className="flex items-center"><Calendar className="h-4 w-4 mr-2" />{new Date(event.date).toLocaleDateString()}</span>
            <span className="flex items-center"><Clock className="h-4 w-4 mr-2" />{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div style={{ transform: "translateZ(30px)" }}>
            {event.status === "upcoming" && (
              <DialogTrigger asChild>
                <Button className="w-full bg-green-500 text-black hover:bg-green-400">Register Now</Button>
              </DialogTrigger>
            )}
            {event.status === "past" && <Button variant="outline" className="w-full border-gray-600 text-gray-400">View Results</Button>}
            {event.status === "active" && <Button className="w-full bg-blue-500 text-white hover:bg-blue-400">Join Now</Button>}
          </div>
        </div>
      </motion.div>
      <RegistrationModal event={event} onClose={() => setIsModalOpen(false)} />
    </Dialog>
  );
};

// Main Events Page Component
const Events = () => {
  const [events, setEvents] = useState<CTFEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "active" | "past">("all");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // FIX: Tell Supabase what type of data to expect to satisfy TypeScript
        const { data, error } = await supabase
          .from("ctf_events")
          .select<"*", CTFEvent>("*") // Asserting the type here
          .order("date", { ascending: false });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => filter === "all" || e.status === filter);
  const filterOptions = ["all", "upcoming", "active", "past"];

  return (
    <div className="relative text-gray-200">
      <div className="fixed inset-0 z-0"><Scene3D /></div>
      <div className="relative z-10 min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-sans font-bold mb-6 text-white" style={{ textShadow: '0 0 20px rgba(0, 255, 150, 0.5)' }}>
              CTF Events
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Test your skills in our cutting-edge cybersecurity competitions against a global community of hackers.
            </p>
          </motion.div>
          <div className="flex justify-center mb-12">
            <div className="flex space-x-2 bg-[#121224]/70 backdrop-blur-md rounded-lg p-2 border border-blue-900/40">
              {filterOptions.map(option => (
                <button key={option} onClick={() => setFilter(option as any)} className="relative px-6 py-2 rounded-md font-mono text-sm transition-colors text-gray-300 hover:text-white">
                  {filter === option && (
                    <motion.div layoutId="filter-active" className="absolute inset-0 bg-green-500/30 rounded-md" />
                  )}
                  <span className="relative z-10 capitalize">{option}</span>
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <Shield className="h-16 w-16 text-green-500 animate-pulse mx-auto mb-4" />
              <h3 className="text-2xl font-mono text-white">Querying Event Matrix...</h3>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={filter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
              </motion.div>
            </AnimatePresence>
          )}
          {!loading && filteredEvents.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <h3 className="text-2xl font-mono text-green-400 mb-4">No Events Found</h3>
              <p className="text-gray-400">There are currently no {filter} events. Please check back later.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;