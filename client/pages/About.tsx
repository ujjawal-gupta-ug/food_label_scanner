import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  FileSearch,
  Leaf,
  Moon,
  ScanLine,
  Sparkles,
  Sun,
} from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: ScanLine,
    number: "01",
    title: "Scan Instantly",
    copy: "Capture or upload a food product and let NutriScan analyze it.",
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Understand Ingredients",
    copy: "Get simple explanations instead of confusing technical names.",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Make Better Choices",
    copy: "See an easy health assessment based on ingredients and nutrition.",
  },
];

function AboutNav({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <header className="bg-[#001F16] text-white">
      <div className="mx-auto flex h-[88px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#168A4A] text-[#B6F35B]">
            <Leaf className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#001F16] bg-[#65C51A]" />
          </span>
          <span>
            <span className="block text-[22px] font-bold leading-none">
              Nutri<span className="text-[#B6F35B]">Scan</span>
            </span>
            <span className="mt-1 block text-[10px] text-[#B4C9BF]">
              Scan. Understand. Choose Better.
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="icon-button"
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {isDark ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
          <Link to="/" className="text-sm font-semibold text-[#B6F35B]">
            Start scanning <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function AnalysisVisual() {
  return (
    <div className="about-analysis-visual">
      <span className="about-orb orb-left" />
      <span className="about-orb orb-right" />
      <div className="about-product-card">
        <div className="about-product-art">
          <Leaf className="h-6 w-6" />
          <span>
            OAT
            <br />
            <b>BITES</b>
          </span>
        </div>
        <p>Food product</p>
      </div>
      <div className="about-flow-line">
        <span />
        <span />
        <span />
      </div>
      <div className="about-ai-state">
        <div className="about-ai-icon">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <span>AI ANALYZING</span>
          <small>Ingredients + nutrition</small>
        </div>
        <Sparkles className="ml-auto h-4 w-4 text-[#B6F35B]" />
      </div>
      <div className="about-score-card">
        <div className="about-score-ring">
          <strong>78</strong>
        </div>
        <div>
          <span>Health insight</span>
          <b>
            GOOD CHOICE <CheckCircle2 className="ml-1 inline h-4 w-4" />
          </b>
        </div>
      </div>
      <span className="about-particle p-one" />
      <span className="about-particle p-two" />
      <span className="about-particle p-three" />
    </div>
  );
}

export default function About() {
  const [isDark, setIsDark] = useState(
    () => window.localStorage.getItem("nutriscan-theme") !== "light",
  );
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const toggleTheme = () =>
    setIsDark((current) => {
      const next = !current;
      window.localStorage.setItem("nutriscan-theme", next ? "dark" : "light");
      return next;
    });

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`min-h-screen font-sans ${isDark ? "dark-theme" : "bg-[#F7FBF7]"}`}
    >
      <AboutNav isDark={isDark} onToggleTheme={toggleTheme} />
      <main
        ref={sectionRef}
        className={`about-page ${visible ? "is-visible" : ""}`}
      >
        <section className="about-main">
          <div className="about-copy">
            <p className="eyebrow">ABOUT NUTRISCAN</p>
            <h1>
              Know what you're <span>really eating.</span>
            </h1>
            <p className="about-description">
              NutriScan uses AI-powered image and label analysis to help you
              understand ingredients, nutrition, and the overall health impact
              of packaged food — in seconds.
            </p>
            <Link to="/" className="primary-cta">
              Start Scanning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <AnalysisVisual />
        </section>
        <section className="about-benefits">
          {benefits.map(({ icon: Icon, number, title, copy }) => (
            <article className="about-benefit" key={title}>
              <div className="about-benefit-icon">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <span className="about-benefit-number">{number}</span>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
