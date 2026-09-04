import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Activity,
  CalendarDays,
  Check,
  CheckCircle2,
  Download,
  Droplet,
  FileText,
  HeartPulse,
  Info,
  Leaf,
  Lightbulb,
  Moon,
  ScanLine,
  Scale,
  ShieldAlert,
  Smile,
  Sun,
  TriangleAlert,
  XCircle,
} from "lucide-react";

type AnalysisState = "success" | "loading" | "error" | "empty";
type IngredientRisk = "safe" | "moderate" | "high";
type Ingredient = {
  name: string;
  risk: IngredientRisk;
  description: string;
  assessment: string;
};

type HealthImpactLevel = "low" | "moderate" | "high";
type HealthImpactIcon =
  "bloodSugar" | "bloodPressure" | "weight" | "heart" | "dental";

type HealthImpact = {
  key: string;
  icon: HealthImpactIcon;
  title: string;
  impact: HealthImpactLevel;
  description: string;
  reasons: string[];
};

type Analysis = {
  product: { image: string; name: string; brand: string; category: string };
  score: number;
  rating: string;
  explanation: string;
  factors: {
    label: string;
    value: string;
    tone: "good" | "moderate" | "high";
  }[];
  good: string[];
  watchOut: string[];
  ingredients: Ingredient[];
  nutrition: { label: string; value: string; warning?: boolean }[];
  healthImpacts: HealthImpact[];
  healthTip: { detail: string };
  recommendation: { title: string; detail: string };
};

const analysis: Analysis = {
  product: {
    image: "https://placehold.co/600x800?text=No+Scan",
    name: "No Product Scanned",
    brand: "NutriScan",
    category: "Awaiting Scan",
  },

  score: 0,
  rating: "No Analysis Available",

  explanation:
    "Upload or scan a food package to view ingredient insights, nutrition highlights, and a health assessment.",

  factors: [
    { label: "Sugar", value: "Unknown", tone: "moderate" },
    { label: "Saturated Fat", value: "Unknown", tone: "moderate" },
    { label: "Trans Fat", value: "Unknown", tone: "moderate" },
    { label: "Additives", value: "Unknown", tone: "moderate" },
  ],

  good: ["Scan a food label to discover positive nutritional highlights."],

  watchOut: ["No ingredient data is available yet."],

  ingredients: [],

  nutrition: [
    { label: "Energy", value: "--" },
    { label: "Carbohydrates", value: "--" },
    { label: "Sugar", value: "--" },
    { label: "Protein", value: "--" },
    { label: "Total Fat", value: "--" },
    { label: "Saturated Fat", value: "--" },
    { label: "Trans Fat", value: "--" },
  ],

  healthImpacts: [
    {
      key: "bloodSugar",
      icon: "bloodSugar",
      title: "Blood Sugar",
      impact: "low",
      description: "Scan a product to see how it may affect blood sugar.",
      reasons: [],
    },
    {
      key: "bloodPressure",
      icon: "bloodPressure",
      title: "Blood Pressure",
      impact: "low",
      description: "Scan a product to see how it may affect blood pressure.",
      reasons: [],
    },
    {
      key: "weight",
      icon: "weight",
      title: "Weight Management",
      impact: "low",
      description: "Scan a product to see how it may affect weight goals.",
      reasons: [],
    },
    {
      key: "heart",
      icon: "heart",
      title: "Heart Health",
      impact: "low",
      description: "Scan a product to see how it may affect heart health.",
      reasons: [],
    },
    {
      key: "dental",
      icon: "dental",
      title: "Dental Health",
      impact: "low",
      description: "Scan a product to see how it may affect dental health.",
      reasons: [],
    },
  ],

  healthTip: {
    detail:
      "Scan your first product to get a personalized healthy-eating tip here.",
  },

  recommendation: {
    title: "Start by scanning a product",
    detail:
      "Capture a clear image of the front and ingredients panel to receive a complete NutriScan analysis.",
  },
};

function ResultHeader({
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
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="result-nav-link">
            <ScanLine className="h-4 w-4" /> Scan
          </Link>
          <Link to="/history" className="result-nav-link">
            History
          </Link>
          <Link to="/about" className="result-nav-link">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            className="icon-button"
          >
            {isDark ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
          {/* <button className="login-button hidden sm:flex">Log In</button> */}
        </div>
      </div>
    </header>
  );
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div
      className="result-score-ring"
      style={{
        background: `conic-gradient(#18D96B 0deg ${score * 3.6}deg, #E7C84F ${score * 3.6}deg 205deg, #DCE8DF 205deg 360deg)`,
      }}
    >
      <div className="bg-white dark:bg-[#0f172a] text-[#101828] dark:text-white">
        <strong className="text-[#101828] dark:text-white">{score}</strong>
        <span className="text-[#667085] dark:text-slate-300">/100</span>
      </div>
    </div>
  );
}
function StatusBadge({
  tone,
  value,
}: {
  tone: "good" | "moderate" | "high";
  value: string;
}) {
  return (
    <span className={`status-badge ${tone}`}>
      {tone === "good" ? (
        <Check className="h-3 w-3" />
      ) : tone === "high" ? (
        <XCircle className="h-3 w-3" />
      ) : (
        <TriangleAlert className="h-3 w-3" />
      )}
      {value}
    </span>
  );
}
function InsightPanel({ good, items }: { good: boolean; items: string[] }) {
  return (
    <section className={`analysis-panel ${good ? "good" : "watch"}`}>
      <div className="flex items-center gap-2">
        {good ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <ShieldAlert className="h-5 w-5" />
        )}
        <h2>{good ? "What's Good" : "Watch Out"}</h2>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item}>
            <span>
              {good ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function IngredientExplorer({ ingredients }: { ingredients: Ingredient[] }) {
  const [openIngredient, setOpenIngredient] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideTap = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      )
        setOpenIngredient(null);
    };
    document.addEventListener("pointerdown", closeOnOutsideTap);
    return () => document.removeEventListener("pointerdown", closeOnOutsideTap);
  }, []);

  return (
    <div ref={containerRef} className="ingredient-explorer" role="list">
      {ingredients.map((ingredient) => {
        const isOpen = openIngredient === ingredient.name;
        const indicator =
          ingredient.risk === "safe"
            ? "✓"
            : ingredient.risk === "moderate"
              ? "⚠"
              : "!";
        return (
          <div
            className={`ingredient-item ${isOpen ? "is-open" : ""}`}
            key={ingredient.name}
            role="listitem"
            onMouseEnter={() => setOpenIngredient(ingredient.name)}
            onMouseLeave={() => setOpenIngredient(null)}
          >
            <button
              type="button"
              className="ingredient-row"
              aria-expanded={isOpen}
              aria-controls={`ingredient-info-${ingredient.name}`}
              onClick={() => setOpenIngredient(isOpen ? null : ingredient.name)}
              onFocus={() => setOpenIngredient(ingredient.name)}
            >
              <span
                className={`ingredient-risk ${ingredient.risk}`}
                aria-label={`${ingredient.risk} concern`}
              >
                {indicator}
              </span>
              <span>{ingredient.name}</span>
            </button>
            {isOpen && (
              <div
                id={`ingredient-info-${ingredient.name}`}
                className="ingredient-info-card"
                role="tooltip"
              >
                <strong>{ingredient.name}</strong>
                <p>{ingredient.description}</p>
                <span>
                  AI assessment: <b>{ingredient.assessment}</b>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---- Health Impact Section ----

const HEALTH_IMPACT_ICONS: Record<HealthImpactIcon, typeof Droplet> = {
  bloodSugar: Droplet,
  bloodPressure: HeartPulse,
  weight: Scale,
  heart: Activity,
  dental: Smile,
};

const IMPACT_LABELS: Record<HealthImpactLevel, string> = {
  low: "Low Impact",
  moderate: "Moderate Impact",
  high: "High Impact",
};

function HealthImpactBar({ impact }: { impact: HealthImpactLevel }) {
  const segments = 7;
  const filled = impact === "high" ? 4 : impact === "moderate" ? 4 : 3;
  const color =
    impact === "high"
      ? "#F04438"
      : impact === "moderate"
        ? "#F79009"
        : "#12B76A";

  return (
    <div className="flex gap-1">
      {Array.from({ length: segments }).map((_, index) => (
        <span
          key={index}
          className="h-1.5 flex-1 rounded-full"
          style={{
            backgroundColor: index < filled ? color : "rgba(148,163,184,0.25)",
          }}
        />
      ))}
    </div>
  );
}

function HealthImpactCard({ impact }: { impact: HealthImpact }) {
  const Icon = HEALTH_IMPACT_ICONS[impact.icon];
  const iconTone =
    impact.impact === "high"
      ? "bg-[#3a1414] text-[#F04438]"
      : impact.impact === "moderate"
        ? "bg-[#3a2c10] text-[#F79009]"
        : "bg-[#12301f] text-[#12B76A]";
  const badgeTone =
    impact.impact === "high"
      ? "bg-[#3a1414] text-[#F97066]"
      : impact.impact === "moderate"
        ? "bg-[#3a2c10] text-[#FDB022]"
        : "bg-[#12301f] text-[#32D583]";

  return (
    <div className="health-impact-card">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconTone}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-sm font-bold">{impact.title}</h3>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${badgeTone}`}
          >
            {IMPACT_LABELS[impact.impact]}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <HealthImpactBar impact={impact.impact} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#B4C9BF]">
        {impact.description}
      </p>
      {impact.reasons.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-[#12301f] px-2 py-1 font-bold text-[#65C51A]">
            Why?
          </span>
          <span className="text-[#98A2B3]">{impact.reasons.join(", ")}</span>
        </div>
      )}
    </div>
  );
}

function HealthImpactSection({
  impacts,
  healthTip,
}: {
  impacts: HealthImpact[];
  healthTip: { detail: string };
}) {
  return (
    <section className="analysis-card mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-[#168A4A]" />
            <h2>How This Product May Affect Your Health</h2>
          </div>
          <p className="mt-1 text-xs text-[#98A2B3]">
            Based on ingredients and nutritional information
          </p>
        </div>
        <button className="text-sm font-bold text-[#168A4A]">
          View Detailed Analysis →
        </button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {impacts.map((impact) => (
          <HealthImpactCard key={impact.key} impact={impact} />
        ))}
        <div className="health-impact-card health-impact-tip">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-[#65C51A]" />
            <h3 className="text-sm font-bold">Healthy Tip</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#B4C9BF]">
            {healthTip.detail}
          </p>
        </div>
      </div>
    </section>
  );
}

function ResultContent({ data }: { data: Analysis }) {
  const [scanTime, setScanTime] = useState("");

  useEffect(() => {
    const now = new Date();

    const formatted = now.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setScanTime(formatted);
  }, []);

  return (
    <div className="mx-auto max-w-[1240px] px-5 pb-20 lg:px-8">
      <div className="result-summary">
        <div className="result-product-large">
          <img src={data.product.image} alt={`${data.product.name} package`} />
        </div>
        <div className="min-w-0">
          <span className="category-badge">{data.product.category}</span>
          <h2 className="mt-3 text-2xl font-bold tracking-[-.04em]">
            {data.product.name}
          </h2>
          <p className="mt-1 text-sm text-[#667085]">{data.product.brand}</p>
          <p className="mt-6 text-xs text-[#98A2B3]">
            <CalendarDays className="mr-1 inline h-3.5 w-3.5" /> Scanned today ·
            {scanTime}
          </p>
        </div>
        <div className="result-score-block">
          <ScoreRing score={data.score} />
          <p className="mt-3 font-bold">{data.rating}</p>
          <p className="mt-1 max-w-[210px] text-center text-xs leading-5 text-[#667085]">
            {data.explanation}
          </p>
        </div>
        <div className="factor-list">
          {data.factors.map((factor) => (
            <div className="factor-row" key={factor.label}>
              <span>{factor.label}</span>
              <StatusBadge tone={factor.tone} value={factor.value} />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <InsightPanel good items={data.good} />
        <InsightPanel good={false} items={data.watchOut} />
      </div>

      <HealthImpactSection
        impacts={data.healthImpacts}
        healthTip={data.healthTip}
      />

      <section className="analysis-card mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#168A4A]" />
            <h2>Ingredients</h2>
          </div>
          <button className="text-sm font-bold text-[#168A4A]">
            View Full Ingredients
          </button>
        </div>
        <div className="mt-5">
          <IngredientExplorer ingredients={data.ingredients} />
        </div>
        <p className="mt-5 flex items-center gap-2 text-xs text-[#98A2B3]">
          <Info className="h-3.5 w-3.5" /> Ingredients are listed in descending
          order by weight.
        </p>
      </section>
      <section className="analysis-card mt-6">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-[#168A4A]" />
          <h2>
            Nutrition Snapshot{" "}
            <span className="ml-1 text-xs font-normal text-[#98A2B3]">
              per 100g
            </span>
          </h2>
        </div>
        <div className="nutrition-grid mt-5">
          {data.nutrition.map((item) => (
            <div
              className={
                item.warning ? "nutrition-item warning" : "nutrition-item"
              }
              key={item.label}
            >
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="recommendation-large mt-6">
        <Lightbulb className="h-6 w-6 shrink-0 text-[#C49400]" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#9A7600]">
            Recommendation
          </p>
          <h2 className="mt-2 text-lg font-bold dark:text-yellow-300 text-[#8d6e11]">
            {data.recommendation.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#92752A]">
            {data.recommendation.detail}
          </p>
        </div>
      </section>
      <div className="mt-8 text-center">
        <Link to="/" className="primary-cta">
          <ArrowLeft className="h-4 w-4" /> Scan Another Product
        </Link>
      </div>
    </div>
  );
}

export default function Result() {
  const [isDark, setIsDark] = useState(
    () => window.localStorage.getItem("nutriscan-theme") !== "light",
  );
  const [state] = useState<AnalysisState>("success");

  const location = useLocation();
  const backendResult = location.state as any;

  const dynamicAnalysis: Analysis = backendResult?.success
    ? {
        ...backendResult,

        product: {
          image: backendResult.product?.image || analysis.product.image,
          name: backendResult.product?.name || analysis.product.name,
          brand: backendResult.product?.brand || analysis.product.brand,
          category:
            backendResult.product?.category || analysis.product.category,
        },
        score: backendResult.score || analysis.score,
        rating: backendResult.rating || analysis.rating,
        explanation: backendResult.explanation || analysis.explanation,
        factors: backendResult.factors || analysis.factors,
        good: backendResult.good || analysis.good,
        watchOut: backendResult.watchOut || analysis.watchOut,
        ingredients: backendResult.ingredients || analysis.ingredients,
        nutrition: backendResult.nutrition || analysis.nutrition,
        healthImpacts: backendResult.healthImpacts || analysis.healthImpacts,
        healthTip: backendResult.healthTip || analysis.healthTip,
        recommendation: backendResult.recommendation || analysis.recommendation,
      }
    : analysis;

  const toggleTheme = () =>
    setIsDark((current) => {
      const next = !current;
      window.localStorage.setItem("nutriscan-theme", next ? "dark" : "light");
      return next;
    });
  return (
    <div
      className={`min-h-screen font-sans ${isDark ? "dark-theme" : "bg-[#F7FBF7]"}`}
    >
      <ResultHeader isDark={isDark} onToggleTheme={toggleTheme} />
      <main className="px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">
                <CheckCircle2 className="mr-1 inline h-4 w-4" /> Analysis
                Complete!
              </p>
              <h1 className="section-title mt-2">
                Here's what we found in your product
              </h1>
            </div>
            <div className="flex gap-3">
              <Link to="/" className="back-button">
                <ArrowLeft className="h-4 w-4" /> Back to Scan
              </Link>
              <button
                className="download-button"
                onClick={() => {
                  const doc = new jsPDF();

                  let y = 20;

                  const addText = (
                    text: unknown,
                    x: number = 20,
                    fontSize: number = 11,
                  ) => {
                    if (y > 275) {
                      doc.addPage();
                      y = 20;
                    }

                    doc.setFontSize(fontSize);
                    doc.setFont("helvetica", "normal");

                    const safeText = String(text ?? "");
                    const lines = doc.splitTextToSize(safeText, 170);

                    lines.forEach((line: string) => {
                      if (y > 275) {
                        doc.addPage();
                        y = 20;
                      }

                      doc.text(line, x, y);
                      y += 6;
                    });
                  };

                  const addHeading = (text: string) => {
                    if (y > 250) {
                      doc.addPage();
                      y = 20;
                    }

                    doc.setFontSize(16);
                    doc.setFont("helvetica", "bold");
                    doc.text(String(text), 20, y);

                    y += 9;
                  };

                  // =========================
                  // HEADER
                  // =========================

                  doc.setFontSize(22);
                  doc.setFont("helvetica", "bold");
                  doc.text("NutriScan", 20, y);

                  y += 8;

                  doc.setFontSize(11);
                  doc.setFont("helvetica", "normal");
                  doc.text("Food Health Analysis Report", 20, y);

                  y += 15;

                  // =========================
                  // PRODUCT DETAILS
                  // =========================

                  addHeading("Product Details");

                  addText(
                    `Product: ${dynamicAnalysis.product?.name ?? "Unknown"}`,
                  );
                  addText(
                    `Brand: ${dynamicAnalysis.product?.brand ?? "Unknown"}`,
                  );
                  addText(
                    `Category: ${dynamicAnalysis.product?.category ?? "Unknown"}`,
                  );
                  addText(`Health Score: ${dynamicAnalysis.score ?? 0}/100`);
                  addText(`Rating: ${dynamicAnalysis.rating ?? "Unknown"}`);

                  y += 6;

                  // =========================
                  // OVERALL ASSESSMENT
                  // =========================

                  addHeading("Overall Assessment");

                  addText(dynamicAnalysis.explanation);

                  y += 6;

                  // =========================
                  // HEALTH FACTORS
                  // =========================

                  addHeading("Health Factors");

                  (dynamicAnalysis.factors ?? []).forEach((factor) => {
                    addText(
                      `${factor?.label ?? "Factor"}: ${factor?.value ?? "Unknown"}`,
                    );
                  });

                  y += 6;

                  // =========================
                  // WHAT'S GOOD
                  // =========================

                  addHeading("What's Good");

                  (dynamicAnalysis.good ?? []).forEach((item) => {
                    addText(`• ${item}`);
                  });

                  y += 6;

                  // =========================
                  // WATCH OUT
                  // =========================

                  addHeading("Watch Out");

                  (dynamicAnalysis.watchOut ?? []).forEach((item) => {
                    addText(`• ${item}`);
                  });

                  y += 6;

                  // =========================
                  // NUTRITION
                  // =========================

                  addHeading("Nutrition Snapshot (per 100g)");

                  (dynamicAnalysis.nutrition ?? []).forEach((item) => {
                    addText(
                      `${item?.label ?? "Nutrient"}: ${item?.value ?? "--"}`,
                    );
                  });

                  y += 6;

                  // =========================
                  // INGREDIENTS
                  // =========================

                  addHeading("Ingredients");

                  (dynamicAnalysis.ingredients ?? []).forEach((ingredient) => {
                    addText(
                      `• ${ingredient?.name ?? "Unknown"} — ${
                        ingredient?.risk ?? "Unknown"
                      }`,
                    );
                  });

                  y += 6;

                  // =========================
                  // HEALTH IMPACT
                  // =========================

                  addHeading("Health Impact");

                  (dynamicAnalysis.healthImpacts ?? []).forEach((impact) => {
                    const impactLabel =
                      impact?.impact === "high"
                        ? "High Impact"
                        : impact?.impact === "moderate"
                          ? "Moderate Impact"
                          : "Low Impact";

                    addText(`${impact?.title ?? "Health"}: ${impactLabel}`);

                    addText(impact?.description ?? "", 25);

                    if (impact?.reasons?.length) {
                      addText(`Why: ${impact.reasons.join(", ")}`, 25);
                    }

                    y += 3;
                  });

                  // =========================
                  // RECOMMENDATION
                  // =========================

                  addHeading("Recommendation");

                  doc.setFontSize(12);
                  doc.setFont("helvetica", "bold");

                  doc.text(
                    String(dynamicAnalysis.recommendation?.title ?? ""),
                    20,
                    y,
                  );

                  y += 7;

                  addText(dynamicAnalysis.recommendation?.detail ?? "");

                  y += 6;

                  // =========================
                  // HEALTHY TIP
                  // =========================

                  addHeading("Healthy Tip");

                  addText(dynamicAnalysis.healthTip?.detail ?? "");

                  // =========================
                  // FOOTER
                  // =========================

                  const pageCount = doc.getNumberOfPages();

                  for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);

                    doc.setFontSize(9);
                    doc.setFont("helvetica", "normal");

                    doc.text(
                      `NutriScan - Food Health Analysis - Page ${i} of ${pageCount}`,
                      20,
                      290,
                    );
                  }

                  // =========================
                  // DOWNLOAD
                  // =========================

                  const productName = dynamicAnalysis.product?.name || "food";

                  const safeFileName = String(productName)
                    .replace(/[^a-z0-9]/gi, "-")
                    .toLowerCase();

                  doc.save(`nutriscan-${safeFileName}-report.pdf`);
                }}
              >
                <Download className="h-4 w-4" />
                Download Report
              </button>
            </div>
          </div>
          {state === "loading" && (
            <div className="analysis-empty">Analyzing your product…</div>
          )}
          {state === "error" && (
            <div className="analysis-empty">
              We couldn't load this result. Please scan again.
            </div>
          )}
          {state === "empty" && (
            <div className="analysis-empty">No analysis is available yet.</div>
          )}
          {state === "success" && <ResultContent data={dynamicAnalysis} />}
        </div>
      </main>
    </div>
  );
}