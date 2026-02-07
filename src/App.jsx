import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Github, Linkedin, Twitter, Mail, ArrowUpRight } from 'lucide-react';
import Scene from './components/Scene';
import './App.css';

const MagneticButton = ({ children, className }) => {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const sections = [
    { id: 'home', label: '01. HOME' },
    { id: 'projects', label: '02. PROJECTS' },
    { id: 'creatives', label: '03. BEYOND CODE' },
    { id: 'writing', label: '04. WRITING' },
    { id: 'contact', label: '05. CONTACT' },
];

const projectsData = [
    {
        title: "LOCALLY RUN AI MODEL",
        tag: "AI",
        link: "https://www.linkedin.com/posts/rudra-limbachiya-77aa07358_i-deployed-an-ai-model-fully-offline-running-activity-7421260915792183298-vlTg?utm_source=share&utm_medium=member_android&rcm=ACoAAFkja44B3evXFIfzAPmPNg9ntO90eYC_KU0",
        description: "Successfully deployed and running an AI model fully offline, focusing on edge computing and privacy."
    },
    {
        title: "Project Title 2",
        tag: "TBD",
        link: "#",
        description: "WORK IN PROGRESS"
    },
    {
        title: "Project Title 3",
        tag: "TBD",
        link: "#",
        description: "WORK IN PROGRESS"
    },
    {
        title: "Project Title 4",
        tag: "TBD",
        link: "#",
        description: "WORK IN PROGRESS"
    }
];

const creativesData = [
    {
        title: "the9scavenger poetry",
        date: "Instagram",
        link: "https://www.instagram.com/the9scavenger",
        description: "A digital sanctuary for poetry and raw emotions. Exploring the scavenged pieces of the soul through words."
    }
];

const writingData = [
    {
        title: "Medium Articles",
        date: "Medium",
        link: "https://medium.com/@rudralimbachiya",
        description: "Thoughts on AI, technology, and the future of engineering."
    },
    {
        title: "WORK IN PROGRESS",
        date: "COMING SOON",
        link: "#",
        description: "Section currently being updated. Stay tuned for new articles."
    }
];

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSubtitle, setActiveSubtitle] = useState(0);
    const subtitles = ['AI STUDENT', 'ROBOTICS ENTHUSIAST', 'MATHEMATICIAN', 'CODE CRAFTER'];
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Subtitle rotation
        const timer = setInterval(() => {
            setActiveSubtitle((prev) => (prev + 1) % subtitles.length);
        }, 3000);

        return () => {
            clearInterval(timer);
            lenis.destroy();
        };
    }, []);

    return (
        <div className="app">
            <motion.div className="progress-bar" style={{ scaleX }} />
            <Scene />

            <nav className="header">
                <a href="#home"><MagneticButton className="logo">RL.</MagneticButton></a>
                <MagneticButton>
                    <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </MagneticButton>
            </nav>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="full-menu"
                        initial={{ opacity: 0, y: '-100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '-100%' }}
                        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    >
                        <div className="menu-grid">
                            {sections.map((section, idx) => (
                                <motion.div
                                    key={section.id}
                                    className="menu-item"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + idx * 0.1 }}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span className="menu-number">{section.id === 'home' ? '' : ''}</span>
                                    <a href={`#${section.id}`}>{section.label}</a>
                                </motion.div>
                            ))}
                        </div>
                        <div className="menu-footer">
                            <div className="social-links">
                                <a href="https://github.com/rudralimbachiya" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
                                <a href="https://www.linkedin.com/in/rudra-limbachiya-77aa07358" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
                                <a href="https://x.com/rudra_r1" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
                                <a href="mailto:rudra.l@outlook.com"><Mail size={20} /></a>
                            </div>
                            <p>© 2026 RUDRA LIMBACHIYA</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                <section id="home" className="hero">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="hero-name">RUDRA<br />LIMBACHIYA</h1>
                        <div className="hero-subtitle-container">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={activeSubtitle}
                                    className="hero-subtitle"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {subtitles[activeSubtitle]}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </section>

                <section id="projects" className="section projects">
                    <h2 className="section-title">PROJECTS</h2>
                    <div className="projects-grid">
                        {projectsData.map((project, i) => (
                            <motion.div
                                key={i}
                                className="project-card"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                                    <div className="project-image-placeholder"></div>
                                    <div className="project-info">
                                        <span className="project-tag">{project.tag}</span>
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section id="creatives" className="section achievements">
                    <h2 className="section-title">BEYOND CODE</h2>
                    <div className="achievement-list">
                        {creativesData.map((item, i) => (
                            <a href={item.link} key={i} className="achievement-item-link" target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                                <div className="achievement-item">
                                    <span className="ach-year">{item.date}</span>
                                    <div className="ach-content">
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                <section id="writing" className="section writing">
                    <h2 className="section-title">WRITING</h2>
                    <div className="writing-list">
                        {writingData.map((item, i) => (
                            <a href={item.link} key={i} className="writing-item-link" target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                                <div className="writing-item">
                                    <span className="writing-date">{item.date}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
                <section id="contact" className="section contact">
                    <h2 className="section-title">CONTACT</h2>
                    <div className="contact-container">
                        <motion.div
                            className="contact-content"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="contact-heading">LET'S BUILD<br />SOMETHING BOLD.</h3>
                            <a href="mailto:rudra.l@outlook.com" className="contact-email-link">
                                <MagneticButton className="email-button">
                                    EMAIL ME <ArrowUpRight size={24} />
                                </MagneticButton>
                            </a>
                        </motion.div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <p>GET IN TOUCH — <a href="mailto:rudra.l@outlook.com" style={{ color: 'var(--accent-primary)' }}>EMAIL ME</a></p>
                <div className="footer-links">
                    <a href="https://github.com/rudralimbachiya" target="_blank" rel="noopener noreferrer">GITHUB</a> / <a href="https://www.linkedin.com/in/rudra-limbachiya-77aa07358" target="_blank" rel="noopener noreferrer">LINKEDIN</a> / <a href="https://x.com/rudra_r1" target="_blank" rel="noopener noreferrer">TWITTER</a>
                </div>
            </footer>
        </div>
    );
}

export default App;
