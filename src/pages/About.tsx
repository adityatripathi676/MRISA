import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
// UPDATED: Added Linkedin and Instagram icons
import { Shield, Target, Users, Zap, BookOpen, Trophy, Linkedin, Instagram } from "lucide-react";
import { Scene3D } from "@/components/Scene3D"; 
import { Button } from "@/components/ui/button"; 
// REMOVED: useNavigate is no longer needed

const timelineEvents = [
  {
    year: "2023",
    title: "MRISA Established",
    description: "Founded by passionate cybersecurity students at Manav Rachna to create a campus hub for ethical hacking and defensive security.",
    icon: Zap,
  },
  {
    year: "2023",
    title: "First Cybersecurity Workshop",
    description: "Hosted our inaugural workshop on Network Security fundamentals, attracting over 100 students and establishing our presence.",
    icon: BookOpen,
  },
  {
    year: "2024",
    title: "Inaugural 'HackToSecure' CTF",
    description: "Successfully launched our flagship Capture The Flag event, challenging participants with diverse, real-world scenarios.",
    icon: Trophy,
  },
  {
    year: "Future",
    title: "National Recognition",
    description: "Aiming to compete in national-level cybersecurity competitions and collaborate with industry leaders on workshops.",
    icon: Target,
  },
];

const values = [
  {
    icon: Shield,
    title: "Ethical Hacking",
    description: "We champion the principle of 'Hack to Secure,' teaching offensive security techniques for building stronger defenses.",
  },
  {
    icon: Users,
    title: "Community & Collaboration",
    description: "Fostering a supportive network where students can learn from peers, share knowledge, and grow together.",
  },
  {
    icon: Target,
    title: "Practical Skill Development",
    description: "Bridging theory and practice with hands-on workshops, CTF competitions, and real-world case studies.",
  },
];

const About = () => {
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  });

  return (
    <div className="relative text-gray-200">
      <div className="fixed inset-0 z-0">
        <Scene3D />
      </div>
      
      <div className="relative z-10 min-h-screen py-20">
        <div className="container mx-auto px-4">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-28"
          >
            <h1 className="text-5xl md:text-7xl font-sans font-bold mb-6 text-white" style={{ textShadow: '0 0 20px rgba(0, 255, 150, 0.5)' }}>
              Our Mission
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto">
              To cultivate the next generation of cybersecurity experts at Manav Rachna by providing a dynamic platform for hands-on learning, ethical hacking, and collaborative problem-solving.
            </p>
          </motion.div>

          {/* Values Section */}
          <section className="mb-28">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-sans font-bold text-center mb-16 text-white"
            >
              Our Core Values
            </motion.h2>
            <motion.div 
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ staggerChildren: 0.2 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {values.map((value) => (
                <motion.div
                  key={value.title}
                  variants={{ offscreen: { opacity: 0, y: 30 }, onscreen: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="bg-[#121224]/70 backdrop-blur-md p-8 text-center rounded-lg border border-blue-900/40 transition-shadow duration-300 hover:shadow-2xl hover:shadow-green-500/10 cursor-pointer"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-900/50 text-green-400 rounded-lg mb-6">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-sans font-semibold mb-3 text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Dynamic Timeline Section */}
          <section className="mb-28">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-sans font-bold text-center mb-20 text-white"
            >
              Our Journey
            </motion.h2>
            <div ref={timelineRef} className="relative max-w-2xl mx-auto">
              <motion.div
                style={{ scaleY: scrollYProgress }}
                className="absolute left-1/2 top-0 w-1 h-full bg-green-500/50 rounded-full origin-top"
              />
              <div className="space-y-16">
                {timelineEvents.map((event, index) => (
                  <TimelineItem key={index} event={event} isLeft={index % 2 === 0} />
                ))}
              </div>
            </div>
          </section>

          {/* --- MODIFIED: Vision Section updated to CTA Section --- */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-[#121224]/70 backdrop-blur-md rounded-2xl p-12 border border-blue-900/40"
          >
            <h2 className="text-4xl font-sans font-bold mb-6 text-white">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Stay connected and be the first to know about our upcoming events, workshops, and competitions by following our social media channels.
            </p>
            {/* --- NEW: Two functional social media buttons --- */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                onClick={() => window.open('https://www.linkedin.com/company/manav-rachna-infosec-army', '_blank')}
                className="bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 rounded-lg px-8 py-3 group w-full sm:w-auto"
              >
                <Linkedin className="mr-2 h-5 w-5" />
                Follow on LinkedIn
              </Button>
              <Button
                onClick={() => window.open('https://www.instagram.com/mrisa_mriirs', '_blank')}
                className="bg-pink-600 text-white hover:bg-pink-500 transition-all duration-300 transform hover:scale-105 rounded-lg px-8 py-3 group w-full sm:w-auto"
              >
                <Instagram className="mr-2 h-5 w-5" />
                Join on Instagram
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ event, isLeft }: { event: (typeof timelineEvents)[0], isLeft: boolean }) => {
  const ref = useRef(null); 
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [isLeft ? -100 : 100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={`flex items-center w-full ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <div className={`w-[calc(50%-2rem)] ${isLeft ? 'order-1' : 'order-3'}`}>
        <motion.div 
          style={{ x, opacity }}
          className="bg-[#1a1a2e]/80 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
        >
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-sans font-semibold text-green-400 mr-auto">
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 font-mono">
              {event.year}
            </p>
          </div>
          <p className="text-gray-400 text-sm">{event.description}</p>
        </motion.div>
      </div>

      <div className="relative w-12 h-12 flex-shrink-0 order-2">
        <div className="absolute left-1/2 top-1/2 -translate-x-1-translate-y-1/2 w-8 h-8 bg-gray-900 rounded-full border-2 border-green-500 flex items-center justify-center">
          <event.icon className="h-5 w-5 text-green-400" />
        </div>
      </div>
    </div>
  );
};

export default About;