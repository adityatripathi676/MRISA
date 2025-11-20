import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Scene3D } from "@/components/Scene3D";
import { Canvas } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@holoforge.dev", href: "mailto:hello@holoforge.dev" },
  { icon: MapPin, label: "Location", value: "Global (Remote)", href: null },
  { icon: Clock, label: "Response Time", value: "Within 24 hours", href: null },
];

const Title3D = () => (
    <div className="h-48 w-full cursor-grab -mt-8">
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
            <ambientLight intensity={0.8} /><pointLight position={[10, 10, 10]} intensity={1} color="#00ff99" />
            <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1}>
                <Center>
                    <Text3D font="/fonts/helvetiker_bold.typeface.json" size={5} height={1} curveSegments={12} bevelEnabled bevelThickness={0.1} bevelSize={0.1}>
                        Contact Us
                        <meshStandardMaterial color="#00ff99" emissive="#00ff99" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
                    </Text3D>
                </Center>
            </Float>
        </Canvas>
    </div>
);

// --- NEW: Motion-wrapped input components for animation ---
const MotionInput = motion(Input);
const MotionTextarea = motion(Textarea);

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false); // New state for success animation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert([formData]);
      if (error) throw error;
      toast({ title: "Message Sent!", description: "We'll be in touch soon." });
      setFormSubmitted(true); // Trigger success animation
    } catch (error) {
      toast({ title: "Submission Failed", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const resetForm = () => {
      setFormData({ name: "", email: "", message: "" });
      setFormSubmitted(false);
  }

  return (
    <div className="relative text-gray-200">
      <div className="fixed inset-0 z-0"><Scene3D /></div>
      <div className="relative z-10 min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-16">
            <Title3D />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 }}} className="text-lg text-gray-300 max-w-3xl mx-auto -mt-12">
              Have a question, partnership proposal, or want a custom event? Let's build the future of cybersecurity together.
            </motion.p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto" style={{ perspective: "1500px" }}>
            <motion.div
              initial={{ opacity: 0, x: -50, rotateY: 15 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-[#121224]/70 backdrop-blur-md rounded-xl p-8 border border-blue-900/40 min-h-[500px]"
            >
              <div className="flex items-center mb-6"><MessageSquare className="h-6 w-6 text-green-400 mr-3" /><h2 className="text-2xl font-sans font-bold text-white">Send a Direct Message</h2></div>
              
              {/* --- NEW: Success Animation Logic --- */}
              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div><Label htmlFor="name">Name *</Label>
                        <MotionInput whileFocus={{ scale: 1.02, boxShadow: '0 0 15px rgba(16,185,129,0.5)' }} id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Your full name" />
                    </div>
                    <div><Label htmlFor="email">Email *</Label>
                        <MotionInput whileFocus={{ scale: 1.02, boxShadow: '0 0 15px rgba(16,185,129,0.5)' }} id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your.email@example.com" />
                    </div>
                    <div><Label htmlFor="message">Message *</Label>
                        <MotionTextarea whileFocus={{ scale: 1.02, boxShadow: '0 0 15px rgba(16,185,129,0.5)' }} id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="How can we help you?" />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-green-500 text-black hover:bg-green-400 group relative overflow-hidden">
                        {/* --- NEW: Shimmer Effect --- */}
                        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 transition-all duration-500 group-hover:opacity-10 group-hover:-translate-x-full group-hover:skew-x-12" />
                        <span className="relative flex items-center">{isSubmitting ? "Sending..." : <><Send className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-6" /> Send Message</>}</span>
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full">
                    <CheckCircle className="h-20 w-20 text-green-400 mb-6" />
                    <h3 className="text-2xl font-sans font-bold text-white mb-3">Message Sent!</h3>
                    <p className="text-gray-400 mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
                    <Button onClick={resetForm} variant="outline" className="border-gray-600 text-gray-300">Send Another Message</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -15 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.label} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.5 }}
                    whileHover={{ y: -5, scale: 1.02 }} className="bg-[#121224]/70 backdrop-blur-md rounded-xl p-6 border border-blue-900/40 group"
                  >
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-900/50 rounded-lg mr-4">
                        {/* --- NEW: Breathing Icon Animation --- */}
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}>
                           <info.icon className="h-6 w-6 text-green-400" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-lg font-sans font-semibold text-white mb-1">{info.label}</h3>
                        {info.href ? (<a href={info.href} className="text-gray-400 hover:text-green-400 transition-colors">{info.value}</a>) : (<p className="text-gray-400">{info.value}</p>)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-[#121224]/70 backdrop-blur-md rounded-xl p-8 border border-blue-900/40">
                  <h3 className="text-xl font-sans font-bold text-white mb-4">Common Inquiries</h3>
                  <motion.ul initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={{ visible: { transition: { staggerChildren: 0.1 }} }} className="space-y-3 text-gray-400">
                    {["Partnerships & Sponsorships", "Custom Enterprise Events", "Platform & Technical Support", "Media & Press Inquiries"].map(item => (
                      <motion.li key={item} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;