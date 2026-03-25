/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Music, 
  Music2, 
  ChevronDown, 
  Instagram,
  MessageCircle,
  Gift,
  Camera,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Leaf,
  Flower,
  Bird,
  Navigation,
  ShieldCheck,
  HandMetal,
  Users,
  Thermometer,
  Send
} from 'lucide-react';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

// --- Types ---

interface Wish {
  id?: string;
  name: string;
  message: string;
  createdAt: Timestamp | any;
}

// --- Components ---

const FloatingElement = ({ delay = 0, left = "50%", size = 24, type = "heart" }: { delay?: number, left?: string, size?: number, type?: "heart" | "leaf" | "flower" }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0, rotate: 0 }}
    animate={{ 
      y: "-10vh", 
      opacity: [0, 0.6, 0.6, 0],
      rotate: [0, 180, 360],
      x: ["0%", "10%", "-10%", "0%"]
    }}
    transition={{ 
      duration: 20, 
      repeat: Infinity, 
      delay,
      ease: "linear"
    }}
    className="fixed pointer-events-none z-0 text-gold-200/30"
    style={{ left }}
  >
    {type === "heart" && <Heart fill="currentColor" size={size} />}
    {type === "leaf" && <Leaf size={size} />}
    {type === "flower" && <Flower size={size} />}
  </motion.div>
);

const Section = ({ children, className = "", id = "" }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`min-h-[90vh] flex flex-col items-center justify-center p-4 md:p-8 text-center relative overflow-hidden damask-pattern royal-gradient-bg ${className}`}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-6xl flex flex-col items-center relative z-10"
    >
      {children}
    </motion.div>
    {/* Subtle vignette for luxury */}
    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
  </section>
);

const RoyalOrnament = () => (
  <div className="flex items-center justify-center gap-6 my-10 w-full max-w-md">
    <div className="flex-1 flex flex-col gap-1">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gold-500 to-gold-300" />
      <div className="h-[0.5px] w-full bg-gradient-to-r from-transparent via-gold-600 to-gold-400 opacity-50" />
    </div>
    <div className="relative flex items-center justify-center">
      <div className="absolute w-10 h-10 bg-gold-500/10 rounded-full blur-xl animate-pulse" />
      <Sparkles className="text-gold-400 relative z-10" size={24} />
    </div>
    <div className="flex-1 flex flex-col gap-1">
      <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-gold-500 to-gold-300" />
      <div className="h-[0.5px] w-full bg-gradient-to-l from-transparent via-gold-600 to-gold-400 opacity-50" />
    </div>
  </div>
);

const FloatingGoldFlakes = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {Array.from({ length: 25 }).map((_, i) => (
      <motion.div
        key={`flake-${i}`}
        initial={{ 
          y: -100, 
          x: Math.random() * 100 + "vw",
          rotate: 0,
          opacity: 0
        }}
        animate={{ 
          y: "110vh",
          x: (Math.random() * 100 - 50) + "vw",
          rotate: 360,
          opacity: [0, 0.4, 0.4, 0]
        }}
        transition={{ 
          duration: 15 + Math.random() * 20,
          repeat: Infinity,
          delay: Math.random() * 10,
          ease: "linear"
        }}
        className="absolute w-1 h-1 bg-gold-400 rounded-full blur-[1px]"
      />
    ))}
  </div>
);

const CountdownItem = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center mx-3 sm:mx-6 group">
    <div className="text-4xl sm:text-6xl font-display font-bold gold-text-shimmer mb-2 transition-transform group-hover:scale-110 duration-500">{value}</div>
    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-3" />
    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-gold-400 font-bold">{label}</span>
  </div>
);

const AnimatedPhotoBackground = () => {
  const photos = [
    { src: "/love1.jpg", seed: "love1" },
    { src: "/love2.jpg", seed: "love2" },
    { src: "/love3.jpg", seed: "love3" },
    { src: "/love4.jpg", seed: "love4" },
    { src: "/love5.jpg", seed: "love5" },
    { src: "/love6.jpg", seed: "love6" },
  ];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
      {/* Sparkle Background */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          initial={{ 
            opacity: 0, 
            scale: 0,
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`
          }}
          animate={{ 
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{ 
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute text-gold-300"
        >
          <Sparkles size={8 + Math.random() * 12} />
        </motion.div>
      ))}

      {/* Floating Photo Frames with Rose Gold Border */}
      {Array.from({ length: 10 }).map((_, i) => {
        const photo = photos[i % photos.length];
        return (
          <motion.div
            key={`bg-photo-${i}`}
            initial={{ 
              x: `${Math.random() * 100}vw`,
              y: `${100 + Math.random() * 50}vh`,
              rotate: Math.random() * 360,
              scale: 0.4 + Math.random() * 0.4
            }}
            animate={{ 
              y: "-30vh",
              rotate: (Math.random() * 360) + 360,
            }}
            transition={{ 
              duration: 30 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 25
            }}
            className="absolute"
          >
            <div className="p-1.5 bg-white shadow-xl border-[4px] border-gold-200/40 rounded-sm transform hover:scale-110 transition-transform">
              <div className="w-20 h-28 overflow-hidden">
                <img 
                  src={photo.src} 
                  alt="Couple" 
                  className="w-full h-full object-cover grayscale-[0.2] sepia-[0.1]"
                  onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${photo.seed}/200/300` }}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Rose Gold Dust Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          initial={{ 
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0
          }}
          animate={{ 
            y: [null, Math.random() * 100 + "vh"],
            x: [null, Math.random() * 100 + "vw"],
            opacity: [0, 0.4, 0]
          }}
          transition={{ 
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-rosegold-300 rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showGrandDoves, setShowGrandDoves] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [wishName, setWishName] = useState('');
  const [wishMessage, setWishMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [guestName, setGuestName] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(decodeURIComponent(to));
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishesData: Wish[] = [];
      snapshot.forEach((doc) => {
        wishesData.push({ id: doc.id, ...doc.data() } as Wish);
      });
      setWishes(wishesData);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleSendWish = async () => {
    if (wishName.trim() && wishMessage.trim()) {
      setIsSending(true);
      try {
        await addDoc(collection(db, 'wishes'), {
          name: wishName,
          message: wishMessage,
          createdAt: serverTimestamp()
        });
        setWishName('');
        setWishMessage('');
      } catch (error) {
        console.error("Error adding wish: ", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Target date: 4 April 2026
  const targetDate = new Date('2026-04-04T10:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleOpen = () => {
    setShowGrandDoves(true);
    setIsOpen(true);
    setIsPlaying(true);
    // Hide grand doves after animation completes
    setTimeout(() => setShowGrandDoves(false), 4000);
  };

  return (
    <div className="relative bg-royal-bg min-h-screen selection:bg-gold-500/20 selection:text-gold-100 overflow-x-hidden">
      {/* Luxurious Animated Background */}
      {isOpen && <AnimatedPhotoBackground />}
      {isOpen && <FloatingGoldFlakes />}

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold-200 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rosegold-100 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Floating Decorations */}
      {isOpen && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          <FloatingElement delay={0} left="5%" size={20} type="leaf" />
          <FloatingElement delay={3} left="25%" size={32} type="flower" />
          <FloatingElement delay={7} left="45%" size={18} type="heart" />
          <FloatingElement delay={2} left="65%" size={28} type="leaf" />
          <FloatingElement delay={5} left="85%" size={22} type="flower" />
          <FloatingElement delay={9} left="15%" size={24} type="heart" />
        </div>
      )}

      {/* Music Toggle */}
      {isOpen && (
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-black/60 backdrop-blur-xl border border-gold-500/30 text-gold-400 shadow-[0_0_20px_rgba(194,149,70,0.3)] hover:bg-gold-500 hover:text-royal-bg transition-all active:scale-90"
          >
            {isPlaying ? <Music className="w-6 h-6 animate-pulse" /> : <Music2 className="w-6 h-6" />}
          </button>
      )}

      <audio 
        ref={audioRef}
        src="/wedding-song.mp3"
        loop
      />

      {/* Grand Dove Animation on Open */}
      <AnimatePresence>
        {showGrandDoves && (
          <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: i % 2 === 0 ? "-20vw" : "120vw", 
                  y: `${Math.random() * 100}vh`,
                  scale: 0.3 + Math.random() * 1.2,
                  opacity: 0,
                  rotate: i % 2 === 0 ? 45 : -45
                }}
                animate={{ 
                  x: i % 2 === 0 ? "120vw" : "-20vw",
                  y: `${Math.random() * 100}vh`,
                  opacity: [0, 1, 1, 0],
                  rotate: i % 2 === 0 ? [45, 0, 45] : [-45, 0, -45]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 3,
                  ease: "easeInOut",
                  delay: Math.random() * 1.5
                }}
                className="absolute text-gold-200 drop-shadow-[0_0_20px_rgba(212,175,55,0.9)]"
              >
                <Bird size={30 + Math.random() * 50} style={{ transform: i % 2 === 0 ? 'none' : 'scaleX(-1)' }} />
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 bg-gold-100 rounded-full blur-2xl -z-10"
                />
              </motion.div>
            ))}
            {/* Sparkles trail */}
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ opacity: 0, scale: 0, x: "50vw", y: "50vh" }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 2, 0],
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`
                }}
                transition={{ duration: 3, delay: Math.random() * 2 }}
                className="absolute text-gold-300"
              >
                <Sparkles size={12 + Math.random() * 24} />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2 }}
              className="absolute inset-0 bg-white mix-blend-overlay"
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            key="cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-royal-bg text-gold-100 p-6 overflow-hidden"
          >
            {/* Elegant Background for Cover */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/royal-feather.png')] opacity-30" />
              <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 border-l-2 border-t-2 border-gold-400/30 m-4 md:m-8" />
              <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 border-r-2 border-b-2 border-gold-400/30 m-4 md:m-8" />
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative z-10 flex flex-col items-center text-center w-full max-w-[90vw]"
            >
              <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-gold-400 mb-6 md:mb-8 font-sans font-semibold">The Wedding Celebration of</span>
              
              <h1 className="text-4xl md:text-7xl font-display mb-6 tracking-widest gold-text-shimmer font-black">
                AULIA <span className="text-2xl md:text-4xl block md:inline text-gold-500 font-serif italic my-4 md:my-0 md:mx-4">&</span> JARWAL
              </h1>

              <div className="w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent my-8 md:my-10" />

              <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold-300 mb-10 md:mb-12 font-sans font-bold">
                Sabtu, 4 April 2026
              </p>

              <div className="mb-10 md:mb-12 p-6 md:p-8 border border-gold-500/30 rounded-none bg-black/40 backdrop-blur-xl shadow-[0_0_30px_rgba(194,149,70,0.2)] relative overflow-hidden group w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-gold-500 mb-3 font-bold">Kepada Yth. Bapak/Ibu/Saudara/i</p>
                <p className="text-2xl md:text-3xl font-serif italic text-gold-100 gold-text-shimmer">{guestName}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(194,149,70,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="group relative px-10 py-4 md:px-12 md:py-5 bg-gold-600 text-royal-bg uppercase tracking-[0.5em] text-[9px] md:text-[10px] font-black transition-all duration-500 overflow-hidden shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-4">
                  Buka Undangan
                  <ChevronDown className="group-hover:translate-y-1 transition-transform" size={18} />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Hero Section */}
            <Section className="pt-32 pb-20">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2 }}
                className="relative mb-20"
              >
                <div className="absolute -inset-12 border border-gold-500/20 rounded-full animate-spin-slow" />
                <div className="absolute -inset-6 border border-gold-400/10 rounded-full animate-reverse-spin-slow" />
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-gold-500/50 shadow-[0_0_60px_rgba(194,149,70,0.3)] relative z-10 bg-black">
                  <img 
                    src="/hero.jpg" 
                    alt="Aulia & Jarwal" 
                    className="w-full h-full object-cover opacity-90"
                    onError={(e) => { e.currentTarget.src = "https://picsum.photos/seed/wedding-hero/800/800" }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>

              <span className="text-[10px] md:text-xs uppercase tracking-[0.8em] text-gold-500 mb-6 md:mb-8 font-sans font-black">The Royal Wedding Celebration of</span>
              <h2 className="text-4xl md:text-8xl font-display gold-text-shimmer mb-8 md:mb-10 tracking-tighter font-black">
                Aulia <span className="text-2xl md:text-5xl font-serif italic text-gold-500">&</span> Jarwal
              </h2>
              
              <RoyalOrnament />

              <p className="text-lg md:text-2xl font-body italic text-gold-100/80 max-w-3xl leading-relaxed px-4 md:px-6">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
              </p>
              <p className="mt-8 text-xs uppercase tracking-[0.4em] text-gold-500 font-black">— Ar-Rum: 21</p>
            </Section>

            {/* --- Invitation Text --- */}
            <Section>
              <div className="max-w-4xl glass-card royal-border p-8 md:p-24 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <h3 className="text-2xl md:text-4xl font-display gold-text-shimmer mb-10 md:mb-12 tracking-[0.2em] uppercase font-bold">Assalamu'alaikum Wr. Wb.</h3>
                <p className="font-body text-lg md:text-xl leading-relaxed mb-10 md:mb-12 text-gold-100/80 italic">
                  Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri Resepsi Pernikahan putra-putri kami:
                </p>

                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center my-16 md:my-20">
                  <div className="space-y-4 md:space-y-6">
                    <h4 className="text-3xl md:text-5xl font-display gold-text-shimmer font-black tracking-tight">Aulia Ramadani</h4>
                    <p className="text-[9px] md:text-[10px] text-gold-500 font-sans uppercase tracking-[0.4em] font-black">Putri kedua dari</p>
                    <p className="text-lg md:text-xl font-serif text-gold-100 italic">Bapak ABD AZIZ & Ibu NABASIA</p>
                    <motion.a 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      href="https://www.instagram.com/dedeaul_?igsh=MWZmaDE4eG1oNjBrNQ==" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex p-3 rounded-full bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-royal-bg transition-all shadow-md mt-4 border border-gold-500/20"
                    >
                      <Instagram className="w-5 h-5" />
                    </motion.a>
                  </div>
                  <div className="text-5xl font-script text-gold-500">&</div>
                  <div className="space-y-6">
                    <h4 className="text-5xl font-display gold-text-shimmer font-black tracking-tight">Jarwal</h4>
                    <p className="text-[10px] text-gold-500 font-sans uppercase tracking-[0.4em] font-black">Putra bungsu dari</p>
                    <p className="text-xl font-serif text-gold-100 italic">Bapak H RAMLI & Ibu HJ HAWANG</p>
                    <motion.a 
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      href="https://www.instagram.com/jarwall_09?igsh=MWVubnI2MW1scTUzMA==" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex p-3 rounded-full bg-gold-500/10 text-gold-400 hover:bg-gold-500 hover:text-royal-bg transition-all shadow-md mt-4 border border-gold-500/20"
                    >
                      <Instagram className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </Section>

            {/* Event Details */}
            <Section className="bg-royal-bg relative">
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/royal-feather.png')]" />
              
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="glass-card p-8 md:p-16 royal-border rounded-sm max-w-5xl w-full shadow-2xl relative overflow-hidden z-10"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

                <div className="relative z-10 text-center">
                  <h2 className="font-display text-2xl md:text-5xl gold-text-shimmer mb-12 md:mb-16 tracking-[0.4em] uppercase font-black">Save The Date</h2>
                  
                  <div className="grid md:grid-cols-2 gap-12 md:gap-24">
                    <div className="space-y-8 md:space-y-10">
                      <div className="flex flex-col items-center">
                        <div className="p-6 md:p-8 bg-gold-500/10 rounded-full mb-6 md:mb-8 shadow-[inset_0_0_20px_rgba(194,149,70,0.2)] border border-gold-500/30">
                          <Calendar className="w-10 h-10 md:w-12 md:h-12 text-gold-400" />
                        </div>
                        <h3 className="font-display text-xl md:text-3xl font-black text-gold-200 mb-4 md:mb-6 uppercase tracking-[0.2em]">Akad Nikah</h3>
                        <div className="w-20 md:w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-6 md:mb-8 mx-auto" />
                        <p className="font-serif text-xl md:text-2xl text-gold-100 font-bold mb-2 md:mb-3 italic">Sabtu, 4 April 2026</p>
                        <div className="flex items-center justify-center gap-4 text-gold-400 font-black uppercase tracking-[0.4em] text-[10px]">
                          <Clock className="w-5 h-5" />
                          <span>10.00 WITA - Selesai</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 md:space-y-10">
                      <div className="flex flex-col items-center">
                        <div className="p-6 md:p-8 bg-gold-500/10 rounded-full mb-6 md:mb-8 shadow-[inset_0_0_20px_rgba(194,149,70,0.2)] border border-gold-500/30">
                          <Heart className="w-10 h-10 md:w-12 md:h-12 text-gold-400" />
                        </div>
                        <h3 className="font-display text-xl md:text-3xl font-black text-gold-200 mb-4 md:mb-6 uppercase tracking-[0.2em]">Resepsi</h3>
                        <div className="w-20 md:w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-6 md:mb-8 mx-auto" />
                        <p className="font-serif text-xl md:text-2xl text-gold-100 font-bold mb-2 md:mb-3 italic">Sabtu, 4 April 2026</p>
                        <div className="flex items-center justify-center gap-4 text-gold-400 font-black uppercase tracking-[0.4em] text-[10px]">
                          <Clock className="w-5 h-5" />
                          <span>12.00 WITA - Selesai</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 md:mt-24 pt-16 md:pt-20 border-t border-gold-500/20 flex flex-col items-center">
                    <MapPin className="w-12 h-12 md:w-16 md:h-16 text-gold-400 mb-6 md:mb-8 animate-bounce" />
                    <h3 className="font-display text-xl md:text-3xl font-black text-gold-200 mb-4 md:mb-6 uppercase tracking-[0.2em]">Lokasi Acara</h3>
                    <p className="font-serif text-gold-100 max-w-lg mb-10 md:mb-12 text-xl md:text-2xl leading-relaxed font-bold italic">
                      BTN PEPABRI SUDIANG BLOK E12/7
                    </p>
                    <motion.button 
                      whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(194,149,70,0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open('https://maps.app.goo.gl/DavZrebYAX4FPHXN6?g_st=awb', '_blank')}
                      className="px-12 py-5 bg-gold-600 text-royal-bg rounded-none font-display tracking-[0.5em] uppercase text-[10px] font-black shadow-2xl flex items-center gap-4 hover:bg-gold-500 transition-all"
                    >
                      <Navigation className="w-6 h-6" />
                      Petunjuk Lokasi
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </Section>            {/* Gallery Section */}
            <Section className="bg-royal-bg relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/royal-feather.png')]" />
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-6xl w-full text-center relative z-10"
              >
                <div className="flex flex-col items-center mb-16 md:mb-20">
                  <Camera className="w-10 h-10 md:w-12 md:h-12 text-gold-400 mb-6 md:mb-8 animate-pulse" />
                  <h2 className="font-display text-2xl md:text-5xl gold-text-shimmer tracking-[0.4em] uppercase font-black">Our Gallery</h2>
                  <RoyalOrnament />
                  <p className="font-body text-lg md:text-2xl text-gold-100/70 italic mt-4 md:mt-6">Momen-momen indah perjalanan cinta kami</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <motion.div
                      key={num}
                      whileHover={{ scale: 1.05, y: -15, rotate: num % 2 === 0 ? 2 : -2 }}
                      className={`relative overflow-hidden royal-border glass-card p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${num % 2 === 0 ? 'md:mt-16' : ''}`}
                    >
                      <div className="overflow-hidden aspect-[3/4] rounded-sm">
                        <img 
                          src={`/love${num}.jpg`} 
                          onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/love${num}/400/${num % 2 === 0 ? '600' : '400'}` }} 
                          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-125" 
                          alt={`Gallery ${num}`} 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gold-900/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Section>

            {/* Love Story Section */}
            <Section className="bg-royal-bg relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/royal-feather.png')]" />
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-4xl w-full text-center relative z-10"
              >
                <RoyalOrnament />
                <h2 className="font-display text-2xl md:text-5xl gold-text-shimmer mb-16 md:mb-24 tracking-[0.4em] uppercase font-black">Our Love Story</h2>
                
                <div className="space-y-24 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-gold-500/50 before:to-transparent">
                  {[
                    { year: "2025", title: "Pertama Bertemu", desc: "Takdir membawa kami pada sebuah pertemuan yang sederhana, namun di sanalah awal dari segalanya dimulai." },
                    { year: "2025", title: "Menjalin Kasih", desc: "Dua hati yang berbeda akhirnya menemukan satu tujuan, memutuskan untuk saling melengkapi dan melangkah bersama." },
                    { year: "2026", title: "Lamaran", desc: "Di hadapan keluarga, kami mengikat janji suci untuk melangkah ke jenjang yang lebih serius, menuju ibadah terlama kami." }
                  ].map((story, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-royal-bg bg-gold-600 text-royal-bg shadow-[0_0_20px_rgba(194,149,70,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-125 group-hover:bg-gold-400">
                        <Heart size={24} fill="currentColor" />
                      </div>
                      <div className="w-[calc(100%-4.5rem)] md:w-[calc(50%-4rem)] p-10 rounded-[2.5rem] glass-card royal-border text-left group-hover:shadow-[0_0_50px_rgba(194,149,70,0.2)] transition-all duration-500">
                        <div className="flex items-center justify-between space-x-4 mb-6">
                          <div className="font-display font-black text-gold-200 text-2xl tracking-widest uppercase">{story.title}</div>
                          <time className="font-serif italic text-gold-500 font-black text-xl">{story.year}</time>
                        </div>
                        <div className="text-gold-100/80 leading-relaxed font-body text-lg italic">"{story.desc}"</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Section>



            {/* Countdown Section */}
            <Section className="bg-royal-bg relative">
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/royal-feather.png')]" />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="text-center relative z-10"
              >
                <h2 className="font-display text-2xl md:text-5xl gold-text-shimmer mb-16 md:mb-20 tracking-[0.4em] uppercase font-black">Menuju Hari Bahagia</h2>
                <div className="flex justify-center items-center gap-6 md:gap-12">
                  <CountdownItem value={timeLeft.days} label="Hari" />
                  <CountdownItem value={timeLeft.hours} label="Jam" />
                  <CountdownItem value={timeLeft.minutes} label="Menit" />
                  <CountdownItem value={timeLeft.seconds} label="Detik" />
                </div>
              </motion.div>
            </Section>

            {/* RSVP / Wish Section */}
            <Section className="bg-royal-bg">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-5xl w-full text-center"
              >
                <div className="flex flex-col items-center justify-center gap-6 md:gap-8 mb-12 md:mb-16">
                  <div className="wax-seal" />
                  <h2 className="font-display text-2xl md:text-5xl gold-text-shimmer tracking-[0.4em] uppercase font-black">Ucapan & Doa</h2>
                </div>
                <p className="font-body text-lg md:text-2xl text-gold-100/70 mb-16 md:mb-20 italic">Berikan doa restu Anda untuk perjalanan suci kami</p>
                
                <div className="grid md:grid-cols-5 gap-16 items-start">
                  <div className="md:col-span-2 space-y-8 text-left glass-card p-12 royal-border shadow-2xl">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.5em] text-gold-500 font-black ml-2">Nama Lengkap</label>
                      <input 
                        type="text" 
                        placeholder="Yth. Bapak/Ibu/Saudara/i" 
                        value={wishName}
                        onChange={(e) => setWishName(e.target.value)}
                        className="w-full bg-transparent border-b border-gold-500/30 py-4 focus:border-gold-400 outline-none transition-all font-body text-xl text-gold-100 placeholder:text-gold-500/20"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.5em] text-gold-500 font-black ml-2">Pesan & Doa Restu</label>
                      <textarea 
                        placeholder="Tuliskan doa restu Anda..." 
                        rows={5}
                        value={wishMessage}
                        onChange={(e) => setWishMessage(e.target.value)}
                        className="w-full bg-transparent border-b border-gold-500/30 py-4 focus:border-gold-400 outline-none transition-all font-body text-xl text-gold-100 resize-none placeholder:text-gold-500/20"
                      />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(194,149,70,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendWish}
                      disabled={isSending}
                      className="w-full py-6 bg-gold-600 text-royal-bg uppercase tracking-[0.5em] text-[10px] font-black shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 mt-10 hover:bg-gold-500 transition-all"
                    >
                      {isSending ? (
                        <div className="w-6 h-6 border-2 border-royal-bg/30 border-t-royal-bg rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={16} />
                          Kirim Pesan
                        </>
                      )}
                    </motion.button>
                  </div>

                  <div className="md:col-span-3 space-y-8 max-h-[700px] overflow-y-auto pr-6 custom-scrollbar">
                    {wishes.length > 0 ? (
                      wishes.map((wish, i) => (
                        <motion.div 
                          key={wish.id || i}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-10 royal-border glass-card text-left shadow-xl hover:shadow-gold-500/20 transition-all duration-500"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-300 font-display font-black text-xl shadow-inner">
                                {wish.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-display font-black text-gold-200 text-lg tracking-widest uppercase">{wish.name}</h4>
                                <span className="text-[10px] text-gold-500/70 font-sans uppercase tracking-[0.3em] font-black">
                                  {wish.createdAt?.toDate ? wish.createdAt.toDate().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gold-100/80 leading-relaxed font-body text-xl pl-20 italic">"{wish.message}"</p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-20 text-gold-500/20 italic font-body text-2xl">
                        Belum ada ucapan...
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Section>

            {/* Wedding Gift */}
            <Section className="bg-royal-bg relative">
              <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/royal-feather.png')]" />
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="max-w-5xl w-full relative z-10"
              >
                <div className="text-center mb-20">
                  <Gift className="w-12 h-12 text-gold-400 mx-auto mb-8 animate-bounce" />
                  <h2 className="font-display text-4xl md:text-6xl gold-text-shimmer mb-8 tracking-[0.4em] uppercase font-black">Wedding Gift</h2>
                  <RoyalOrnament />
                  <p className="font-body text-2xl text-gold-100/70 max-w-3xl mx-auto italic mt-8">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat melalui:</p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-10 max-w-4xl mx-auto">
                  {/* Dana */}
                  <div className="p-12 glass-card royal-border shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-125" />
                    <div className="relative z-10">
                      <div className="h-8 mb-10 flex items-center font-display font-black text-gold-300 tracking-[0.3em] text-sm uppercase">E-Wallet</div>
                      <p className="text-[10px] uppercase tracking-[0.5em] text-gold-500 font-black mb-3">Nomor Dana</p>
                      <p className="text-3xl font-display font-black text-gold-100 mb-2 tracking-tighter">085756148415</p>
                      <p className="text-lg font-body text-gold-400 italic">a.n. Aulia Ramadani</p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard('085756148415', 0)}
                        className="mt-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gold-300 hover:text-gold-100 transition-all"
                      >
                        {copiedIndex === 0 ? (
                          <><Check size={18} className="text-green-500" /> Tersalin</>
                        ) : (
                          <><Copy size={18} /> Salin Nomor</>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Bank/Other */}
                  <div className="p-12 glass-card royal-border shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-125" />
                    <div className="relative z-10">
                      <div className="h-8 mb-10 flex items-center font-display font-black text-gold-300 tracking-[0.3em] text-sm uppercase">Kirim Kado</div>
                      <p className="text-[10px] uppercase tracking-[0.5em] text-gold-500 font-black mb-3">Alamat Pengiriman</p>
                      <p className="text-2xl font-display text-gold-100 mb-2 font-black tracking-tight leading-tight">BTN PEPABRI SUDIANG BLOK E12/7</p>
                      <p className="text-lg font-body text-gold-400 italic">Makassar, Sulawesi Selatan</p>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard('BTN PEPABRI SUDIANG BLOK E12/7', 1)}
                        className="mt-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gold-300 hover:text-gold-100 transition-all"
                      >
                        {copiedIndex === 1 ? (
                          <><Check size={18} className="text-green-500" /> Tersalin</>
                        ) : (
                          <><Copy size={18} /> Salin Alamat</>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Section>

            {/* Closing Quote */}
            <Section className="bg-royal-bg py-40">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-4xl text-center"
              >
                <div className="wax-seal mx-auto mb-16" />
                <p className="font-body text-3xl text-gold-100 leading-relaxed italic mb-12 px-8">
                  "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
                </p>
                <RoyalOrnament />
                <p className="font-display text-gold-500 font-black tracking-[0.6em] uppercase text-sm mt-12">QS. Ar-Rum: 21</p>
              </motion.div>
            </Section>

            {/* Footer */}
            <footer className="py-32 bg-royal-bg text-center relative overflow-hidden border-t border-gold-500/10">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/royal-feather.png')]" />
              <div className="relative z-10">
                <h2 className="font-display text-5xl md:text-7xl gold-text-shimmer mb-10 tracking-[0.5em] uppercase font-black">Aulia & Jarwal</h2>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto mb-12" />
                <p className="font-sans text-gold-500 text-xs tracking-[0.8em] uppercase font-black">Terima Kasih Atas Doa Restu Anda</p>
                <div className="mt-20 opacity-30">
                  <RoyalOrnament />
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2d1c3;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #b76e79;
        }
      `}</style>
    </div>
  );
}
