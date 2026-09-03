import { ArrowRight, CalendarDays, Clock3, Leaf, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

type ScanRecord = { id: string; image: string; name: string; brand: string; date: string; category: string; score: number; status: string; tone: "good" | "average" | "attention" };

const demoScans: ScanRecord[] = [
  { id: "oat-bites", image: "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2Fe7867c7552b84aff8107d262e4eb4382?format=webp&width=800&height=1200", name: "Crispy Oat Bites", brand: "Harvest & Co.", date: "10 May, 2024", category: "Snack / Breakfast", score: 45, status: "Average Choice", tone: "average" },
  { id: "dairy-milk", image: "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2Fe7867c7552b84aff8107d262e4eb4382?format=webp&width=800&height=1200", name: "Dairy Milk Chocolate", brand: "Cadbury", date: "08 May, 2024", category: "Chocolate", score: 38, status: "Needs Attention", tone: "attention" },
  { id: "quinoa-puffs", image: "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2Fd96cd29fe62342c797a94fd40118bed3?format=webp&width=800&height=1200", name: "Quinoa Puffs", brand: "Good Grain", date: "04 May, 2024", category: "Healthy Snack", score: 78, status: "Good Choice", tone: "good" },
  { id: "classic-chips", image: "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2Fa3c1fd1798034f27ba3bbbb683c28888?format=webp&width=800&height=1200", name: "Classic Potato Chips", brand: "Lay's", date: "29 Apr, 2024", category: "Savory Snack", score: 32, status: "Needs Attention", tone: "attention" },
  { id: "breakfast-cereal", image: "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2F5b2435694d464514a426120e6d2a3aac?format=webp&width=800&height=1200", name: "Breakfast Cereal", brand: "Kellogg's", date: "22 Apr, 2024", category: "Breakfast", score: 67, status: "Good Choice", tone: "good" },
];

function HistoryCard({ scan }: { scan: ScanRecord }) {
  return <article className="history-card"><div className="history-image"><img src={scan.image} alt={`${scan.name} package`} /></div><div className="min-w-0 flex-1"><span className={`history-category ${scan.tone}`}>{scan.category}</span><h2 className="mt-3 text-lg font-bold tracking-[-.03em] text-[#101828]">{scan.name}</h2><p className="mt-1 text-sm text-[#667085]">{scan.brand}</p><p className="mt-4 flex items-center gap-1.5 text-xs text-[#98A2B3]"><CalendarDays className="h-3.5 w-3.5" /> {scan.date}</p></div><div className="history-score"><div><strong>{scan.score}</strong><span>/100</span></div><span className={`history-status ${scan.tone}`}>{scan.status}</span><Link to={`/result?scan=${scan.id}`} className="history-link">View Analysis <ArrowRight className="h-4 w-4" /></Link></div></article>;
}

export default function History() {
  const [isDark, setIsDark] = useState(() => window.localStorage.getItem("nutriscan-theme") !== "light");
  const toggleTheme = () => setIsDark((current) => { const next = !current; window.localStorage.setItem("nutriscan-theme", next ? "dark" : "light"); return next; });
  const [scans] = useState<ScanRecord[]>(() => {
    try {
      const saved = window.localStorage.getItem("nutriscan-history");
      return saved ? [...JSON.parse(saved), ...demoScans] : demoScans;
    } catch {
      return demoScans;
    }
  });
  return <div className={`min-h-screen font-sans text-[#101828] ${isDark ? "dark-theme" : "bg-[#F7FBF7]"}`}><header className="bg-[#001F16]"><div className="mx-auto flex h-[88px] max-w-[1240px] items-center justify-between px-5 lg:px-8"><Link to="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#168A4A] text-[#B6F35B]"><Leaf className="h-5 w-5" /></span><span className="text-[22px] font-bold text-white">Nutri<span className="text-[#B6F35B]">Scan</span></span></Link><div className="flex items-center gap-3"><button aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"} onClick={toggleTheme} className="icon-button">{isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}</button><Link to="/" className="flex items-center gap-2 text-sm font-semibold text-[#B6F35B]"><Clock3 className="h-4 w-4" /> Back to scan</Link></div></div></header><main className="mx-auto max-w-[960px] px-5 py-14 lg:py-20"><p className="eyebrow">Your recent scans</p><h1 className="section-title mt-2">Scan History</h1><p className="history-page-copy mt-3 max-w-xl text-sm leading-6 text-[#667085]">Review your previously scanned food products and their AI health analysis.</p><div className="mt-9 space-y-4">{scans.map((scan) => <HistoryCard key={`${scan.id}-${scan.date}`} scan={scan} />)}</div></main></div>;
}
