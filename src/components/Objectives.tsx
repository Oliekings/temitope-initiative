import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  TrendingUp, 
  Globe, 
  HeartHandshake, 
  Landmark, 
  Activity, 
  Network 
} from 'lucide-react';

const objectives = [
  {
    icon: Lightbulb,
    title: "Skill & Leadership",
    desc: "Training and entrepreneurship programs for the next generation.",
    color: "bg-blue-50 text-royal-blue"
  },
  {
    icon: TrendingUp,
    title: "Economic Empowerment",
    desc: "Fostering financial independence and sustainable growth.",
    color: "bg-green-50 text-lime-green"
  },
  {
    icon: Globe,
    title: "Peace Building",
    desc: "Global mobilization for conflict resolution and harmony.",
    color: "bg-red-50 text-vibrant-red"
  },
  {
    icon: HeartHandshake,
    title: "Social Support",
    desc: "Targeted development aid for vulnerable communities.",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: Landmark,
    title: "Governance",
    desc: "Promoting African and Global leadership excellence.",
    color: "bg-amber-50 text-amber-600"
  },
  {
    icon: Activity,
    title: "Health Awareness",
    desc: "Resources for HIV/AIDS and STD prevention.",
    color: "bg-rose-50 text-rose-600"
  },
  {
    icon: Network,
    title: "Global Synergy",
    desc: "Partnership and exchange programs across borders.",
    color: "bg-indigo-50 text-indigo-600"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Objectives() {
  return (
    <section id="objectives" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our 7-Point Objective</h2>
          <p className="text-gray-600 text-lg">
            A comprehensive framework designed to create lasting, systemic change across communities worldwide.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {objectives.map((obj, i) => (
            <motion.div 
              key={i}
              variants={item}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${obj.color} transition-transform group-hover:scale-110`}>
                <obj.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3">{obj.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{obj.desc}</p>
            </motion.div>
          ))}
          
          {/* Call to action card */}
          <motion.div 
            variants={item}
            className="p-8 rounded-2xl bg-royal-blue text-white flex flex-col justify-center items-start shadow-lg"
          >
            <h3 className="text-2xl font-serif font-bold mb-4">Be Part of the Change</h3>
            <p className="text-blue-100 text-sm mb-6">Support our initiatives and help us reach more communities.</p>
            <a 
              href="#donate"
              className="inline-block px-6 py-2.5 bg-lime-green text-white rounded-full text-sm font-bold hover:bg-green-600 transition-colors shadow-md text-center"
            >
              Donate Now
            </a>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}
