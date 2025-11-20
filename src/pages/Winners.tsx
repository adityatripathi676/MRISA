import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Zap, Calendar } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Float, Text3D, Center } from "@react-three/drei";
import { Scene3D } from "@/components/Scene3D";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Data structure for a winner
interface Winner {
  id: string;
  player_name: string;
  team_name: string | null;
  rank: number;
  score: number;
  avatar_url: string | null;
}

// Data structure for an event with its winners
interface EventWithWinners {
  id: string;
  title: string;
  date: string;
  winners: Winner[];
}

// Manual data now grouped by event
const manualEventsWithWinners: EventWithWinners[] = [
  {
    id: 'evt_quantum',
    title: 'Quantum Break CTF 2024',
    date: '2024-08-15',
    winners: [
      { id: 'w1', player_name: 'Cipher', team_name: 'The Phantoms', rank: 1, score: 9850, avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=cipher' },
      { id: 'w2', player_name: 'Glitch', team_name: null, rank: 2, score: 9120, avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=glitch' },
      { id: 'w3', player_name: 'Nyx', team_name: 'Data Daemons', rank: 3, score: 8750, avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=nyx' },
    ],
  },
  {
    id: 'evt_sentinel',
    title: 'Project Sentinel Finals',
    date: '2024-05-20',
    winners: [
      { id: 'w4', player_name: 'Vector', team_name: null, rank: 1, score: 8500, avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=vector' },
      { id: 'w5', player_name: 'Proxy', team_name: 'Root Cause', rank: 2, score: 8100, avatar_url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=proxy' },
    ],
  },
];

// --- FIX: The `return` statement and JSX body are included ---
const Title3D = () => {
  return ( // This was the missing return statement
    <div className="h-48 w-full cursor-grab">
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ff99" />
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1}>
          <Center>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={5} height={1} curveSegments={12}
              bevelEnabled bevelThickness={0.1} bevelSize={0.1}
            >
              Hall of Fame
              <meshStandardMaterial color="#00ff99" emissive="#00ff99" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
            </Text3D>
          </Center>
        </Float>
      </Canvas>
    </div>
  );
};

const getRankColor = (rank: number) => {
    if (rank === 1) return { border: "border-yellow-400", shadow: "shadow-[0_0_25px_rgba(250,204,21,0.7)]" };
    if (rank === 2) return { border: "border-gray-400", shadow: "shadow-[0_0_20px_rgba(156,163,175,0.6)]" };
    if (rank === 3) return { border: "border-amber-600", shadow: "shadow-[0_0_20px_rgba(217,119,6,0.6)]" };
    return { border: "border-blue-900/40", shadow: "" };
};

const WinnerCard = ({ winner, variants }: { winner: Winner, variants: any }) => {
    const { border, shadow } = getRankColor(winner.rank);
    return (
        <motion.div
            variants={variants}
            whileHover={{ y: -8, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className={`relative flex flex-col bg-[#121224]/70 backdrop-blur-md rounded-xl overflow-hidden h-full border ${border} ${shadow}`}
        >
            {winner.rank === 1 && <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 animate-pulse" />}
            <div className="relative h-40">
                <img src={winner.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${winner.player_name}`} alt={winner.player_name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121224] to-transparent" />
                <motion.div
                    animate={winner.rank <= 3 ? { scale: [1, 1.05, 1] } : {}}
                    transition={winner.rank <= 3 ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                    className={`absolute -bottom-6 left-6 flex items-center justify-center w-12 h-12 bg-[#121224] rounded-full border-2 text-xl font-bold font-mono text-white ${border}`}
                >
                    #{winner.rank}
                </motion.div>
            </div>
            <div className="p-6 pt-10 flex-grow flex flex-col">
                <h3 className="text-2xl font-sans font-bold text-white mb-1 truncate">{winner.player_name}</h3>
                {winner.team_name && <p className="text-sm text-gray-400">Team: {winner.team_name}</p>}
                <div className="flex items-center space-x-2 text-green-400 my-4">
                    <Zap className="h-5 w-5" />
                    <span className="text-3xl font-mono font-bold">{winner.score.toLocaleString()}</span>
                    <span className="text-sm text-gray-400 self-end pb-1">points</span>
                </div>
            </div>
        </motion.div>
    );
};

const EventWinnersSection = ({ event }: { event: EventWithWinners }) => {
    const topThree = event.winners.slice(0, 3).sort((a, b) => a.rank - b.rank);
    const otherWinners = event.winners.slice(3);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-24"
        >
            <div className="bg-[#121224]/70 backdrop-blur-md rounded-xl p-6 md:p-8 border border-blue-900/40 mb-12">
                <div className="flex items-center">
                    <div className="mr-4 text-green-400"><Crown size={32} /></div>
                    <div>
                        <h2 className="text-3xl font-sans font-bold text-white">{event.title}</h2>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {topThree.length > 0 && (
                 <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-center items-end gap-8 mb-16"
                >
                    {topThree.find(w => w.rank === 2) && <motion.div variants={itemVariants} className="w-full md:w-1/3 order-2 md:order-1"><WinnerCard winner={topThree.find(w => w.rank === 2)!} variants={itemVariants} /></motion.div>}
                    {topThree.find(w => w.rank === 1) && <motion.div variants={itemVariants} className="w-full md:w-1/3 order-1 md:order-2 mb-0 md:mb-8"><WinnerCard winner={topThree.find(w => w.rank === 1)!} variants={itemVariants} /></motion.div>}
                    {topThree.find(w => w.rank === 3) && <motion.div variants={itemVariants} className="w-full md:w-1/3 order-3 md:order-3"><WinnerCard winner={topThree.find(w => w.rank === 3)!} variants={itemVariants} /></motion.div>}
                </motion.div>
            )}

            {otherWinners.length > 0 && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <h3 className="col-span-full text-2xl font-sans font-bold text-center text-white mb-8">Elite Competitors</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherWinners.map((winner) => <WinnerCard key={winner.id} winner={winner} variants={itemVariants} />)}
                    </div>
                </motion.div>
            )}
        </motion.section>
    );
};

const Winners = () => {
    const [events] = useState<EventWithWinners[]>(manualEventsWithWinners);

    return (
        <div className="relative min-h-screen py-20 text-gray-200">
            <div className="fixed inset-0 z-0"><Scene3D /></div>
            <div className="relative z-10 container mx-auto px-4">
                
                <Title3D />
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center text-lg text-gray-300 max-w-3xl mx-auto -mt-8 mb-24">
                    Celebrating the elite hackers from each of our challenging cybersecurity competitions.
                </motion.p>
                
                {events.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                         <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                         <h3 className="text-2xl font-mono text-green-400">The Hall is Awaiting its First Champions</h3>
                    </motion.div>
                ) : (
                    <div className="space-y-16">
                        {events.map((event) => <EventWinnersSection key={event.id} event={event} />)}
                    </div>
                )}
                
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-28 text-center bg-[#121224]/70 backdrop-blur-md rounded-2xl p-12 border border-blue-900/40">
                    <h2 className="text-3xl font-sans font-bold mb-6 text-white">Want to Join the Elite?</h2>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
                      Think you have what it takes to crack advanced systems and solve complex challenges?
                    </p>
                    <Button asChild className="bg-green-500 text-black hover:bg-green-400 transition-all duration-300 transform hover:scale-105 rounded-lg px-8 py-3 group">
                      <Link to="/events">View Upcoming Events</Link>
                    </Button>
                </motion.div>
            </div>
        </div>
    );
};

export default Winners;