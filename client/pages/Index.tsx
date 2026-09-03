import { useEffect, useRef, useState } from "react";
import { analyzeProduct } from "@/lib/nutriscan-api";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleUserRound,
  Clock3,
  FileSearch,
  Info,
  Leaf,
  Lightbulb,
  Menu,
  Moon,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  X,
  XCircle,
} from "lucide-react";

const steps = [
  {
    icon: Camera,
    number: "01",
    title: "Scan",
    copy: "Upload or capture a product image",
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Extract",
    copy: "Our AI extracts ingredients & nutrition facts",
  },
  {
    icon: BrainCircuit,
    number: "03",
    title: "Analyze",
    copy: "AI analyzes for health impact",
  },
  {
    icon: ShieldCheck,
    number: "04",
    title: "Get Insights",
    copy: "Easy-to-understand results & recommendations",
  },
];

function Brand() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3"
      aria-label="NutriScan home"
    >
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#168A4A] text-[#B6F35B] shadow-[0_0_0_5px_rgba(24,217,107,.08)]">
        <Leaf className="h-5 w-5" strokeWidth={2.5} />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#001F16] bg-[#65C51A]" />
      </span>
      <span>
        <span className="block text-[22px] font-bold leading-none tracking-[-0.04em] text-white">
          Nutri<span className="text-[#B6F35B]">Scan</span>
        </span>
        <span className="mt-1 block text-[10px] tracking-[.04em] text-[#B4C9BF]">
          Scan. Understand. Choose Better.
        </span>
      </span>
    </Link>
  );
}

function Navbar({
  onScan,
  isDark,
  onToggleTheme,
}: {
  onScan: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIsScrolled(window.scrollY > 40));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`site-navbar text-white ${isScrolled ? "is-scrolled" : ""}`}
    >
      <div className="mx-auto flex h-[88px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-9 md:flex">
          <button onClick={onScan} className="nav-link active">
            <ScanLine className="h-4 w-4" /> Scan
          </button>
          <Link to="/history" className="nav-link">
            <Clock3 className="h-4 w-4" /> History
          </Link>
          <Link to="/about" className="nav-link">
            <Info className="h-4 w-4" /> About
          </Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            onClick={onToggleTheme}
            className="icon-button"
          >
            {isDark ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
          <button className="login-button">
            <CircleUserRound className="h-[17px] w-[17px]" /> Log In
          </button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            onClick={onToggleTheme}
            className="icon-button"
          >
            {isDark ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
          <button
            className="rounded-lg p-2 text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="border-t border-white/10 px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-2">
            <button onClick={onScan} className="nav-link justify-start active">
              {" "}
              <ScanLine className="h-4 w-4" /> Scan
            </button>
            <Link to="/history" className="nav-link justify-start">
              <Clock3 className="h-4 w-4" /> History
            </Link>
            <Link to="/about" className="nav-link justify-start">
              <Info className="h-4 w-4" /> About
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

const scanningProducts = [
  {
    id: "Kelloggs",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2F5b2435694d464514a426120e6d2a3aac?format=webp&width=800&height=1200",
    name: "Kellogg's Frosties",
    alt: "Kellogg's Frosties cereal box being scanned",
  },
  {
    id: "QuinoaPuffs",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2Fd96cd29fe62342c797a94fd40118bed3?format=webp&width=800&height=1200",
    name: "Quinoa Puffs",
    alt: "Quinoa puffs snack packet being scanned",
  },
  {
    id: "DairyMilk",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2Fe7867c7552b84aff8107d262e4eb4382?format=webp&width=800&height=1200",
    name: "Cadbury Dairy Milk",
    alt: "Cadbury Dairy Milk chocolate packet being scanned",
  },
  {
    id: "Maggi",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2F936f745696c8462fa1003f88ea030024?format=webp&width=800&height=1200",
    name: "Maggi",
    alt: "Maggi 2-Minute Noodles packet being scanned",
  },
  {
    id: "Lays",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd1f1a73a712c46ada14ee971643df117%2Fa3c1fd1798034f27ba3bbbb683c28888?format=webp&width=800&height=1200",
    name: "Lay's Classic",
    alt: "Lay's Classic chips packet being scanned",
  },
];

function FoodProductCarousel() {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const rotation = [
    ...scanningProducts.slice(currentProductIndex),
    ...scanningProducts.slice(0, currentProductIndex),
  ];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentProductIndex(
        (current) => (current + 1) % scanningProducts.length,
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <div className="product-pack product-carousel-track">
        {rotation.map((product, slotIndex) => {
          const isCenter = slotIndex === 2;

          return (
            <div
              key={product.id}
              className={`product-slot slot-${slotIndex + 1} ${
                isCenter ? "center" : ""
              }`}
              style={{
                width: isCenter ? "180px" : "110px",
                height: isCenter ? "240px" : "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={product.image}
                alt={product.alt}
                className={`product-carousel-image motion-${product.id.toLowerCase()}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        className="product-indicators"
        aria-label={`Center product: ${rotation[2].id}`}
      >
        {scanningProducts.map((product) => (
          <span
            key={product.id}
            className={product.id === rotation[2].id ? "active" : ""}
          />
        ))}
      </div>
    </>
  );
}
function ScannerVisual() {
  return (
    <div className="scanner-stage">
      <div className="scanner-orb orb-one" />
      <div className="scanner-orb orb-two" />
      <FoodProductCarousel />
      <span className="bracket tl" />
      <span className="bracket tr" />
      <span className="bracket bl" />
      <span className="bracket br" />
      <span className="scan-beam" />
      <Leaf className="decor-leaf leaf-a" />
      <Leaf className="decor-leaf leaf-b" />
      <span className="dot dot-a" />
      <span className="dot dot-b" />
      <div className="scan-label">
        <ScanLine className="h-4 w-4" /> Scanning food label...{" "}
        <span className="ml-1 text-[#18D96B]">•</span>
      </div>
    </div>
  );
}

function ScoreRing() {
  return (
    <div
      className="relative flex h-[146px] w-[146px] items-center justify-center rounded-full"
      style={{
        background:
          "conic-gradient(#18D96B 0deg 162deg, #E7C84F 162deg 205deg, #E9F0EA 205deg 360deg)",
      }}
    >
      <div className="flex h-[122px] w-[122px] flex-col items-center justify-center rounded-full bg-white">
        <span className="text-[42px] font-bold leading-none text-[#101828]">
          45<span className="text-[17px] font-medium text-[#98A2B3]">/100</span>
        </span>
        <span className="mt-1 text-xs font-semibold text-[#667085]">
          Average Choice
        </span>
      </div>
    </div>
  );
}

function ResultsPreview() {
  return (
    <section
      id="results"
      className="scroll-reveal mx-auto max-w-[1240px] px-5 pb-24 lg:px-8"
    >
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="eyebrow">A clearer way to choose</p>
          <h2 className="section-title">Your Results</h2>
        </div>
        <span className="hidden rounded-full bg-[#F3F9F3] px-4 py-2 text-xs font-semibold text-[#168A4A] sm:block">
          <Sparkles className="mr-1 inline h-3.5 w-3.5" /> AI-powered preview
        </span>
      </div>
      <div className="result-card grid gap-8 lg:grid-cols-[1.1fr_.9fr_1.65fr] lg:gap-0">
        <div className="flex items-center gap-5 lg:border-r lg:border-[#E5E7EB] lg:pr-8">
          <div className="result-product">
            <div className="mini-pack">
              OAT
              <br />
              <b>BITES</b>
              <small>HONEY</small>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#101828]">
              Crispy Oat Bites
            </h3>
            <p className="mt-1 text-sm text-[#667085]">Harvest &amp; Co.</p>
            <p className="mt-5 text-[11px] leading-5 text-[#98A2B3]">
              <Clock3 className="mr-1 inline h-3.5 w-3.5" /> Scanned on 10 May,
              2024
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;10:30 AM
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center lg:border-r lg:border-[#E5E7EB]">
          <ScoreRing />
        </div>
        <div className="lg:pl-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <InsightCard
              good
              title="What's Good"
              items={["No trans fat", "Contains iron"]}
            />
            <InsightCard
              title="Watch Out"
              items={["High sugar", "High in saturated fat"]}
            />
          </div>
          <div className="recommendation mt-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[#C49400]" />
            <div>
              <p className="text-sm font-bold text-[#7B5C00]">
                Okay for occasional consumption
              </p>
              <p className="mt-1 text-xs leading-5 text-[#92752A]">
                High sugar and saturated fat may not be ideal for daily intake.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightCard({
  good,
  title,
  items,
}: {
  good?: boolean;
  title: string;
  items: string[];
}) {
  return (
    <div className={good ? "insight-card good" : "insight-card warning"}>
      <p
        className={
          good
            ? "text-sm font-bold text-[#168A4A]"
            : "text-sm font-bold text-[#C52F2C]"
        }
      >
        {title}
      </p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <p
            key={item}
            className="flex items-center gap-2 text-xs text-[#475467]"
          >
            <span className={good ? "text-[#168A4A]" : "text-[#E53935]"}>
              {good ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
            </span>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function LegacyScanModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const chooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > 10 * 1024 * 1024) {
      alert("Please choose an image under 10MB.");
      return;
    }
    setFile(URL.createObjectURL(selected));
  };
  const analyze = () => {
    setAnalyzing(true);
    window.setTimeout(() => {
      setAnalyzing(false);
      setDone(true);
    }, 1800);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001F16]/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[620px] overflow-hidden rounded-[28px] bg-[#0B211A] p-4 text-white shadow-2xl sm:p-7">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          aria-label="Close scanner"
        >
          <X className="h-5 w-5" />
        </button>
        {done ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#18D96B] text-[#001F16]">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Your product is ready</h2>
            <p className="mt-2 max-w-sm text-sm text-[#B4C9BF]">
              We found the ingredients and nutrition details. Your preview has
              been updated below.
            </p>
            <button
              onClick={onClose}
              className="mt-7 rounded-xl bg-[#18D96B] px-6 py-3 text-sm font-bold text-[#001F16]"
            >
              View results
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#168A4A]">
                <ScanLine className="h-5 w-5 text-[#B6F35B]" />
              </div>
              <div>
                <p className="font-bold">Scan your food label</p>
                <p className="text-xs text-[#8EA99D]">
                  Position the ingredient label inside the frame
                </p>
              </div>
            </div>
            <div className="camera-viewport">
              {file ? (
                <img
                  src={file}
                  alt="Selected food label"
                  className="h-full w-full object-contain"
                />
              ) : (
                <>
                  <div className="camera-placeholder">
                    <Camera className="h-12 w-12" />
                    <span>Camera preview</span>
                  </div>
                  <span className="bracket tl" />
                  <span className="bracket tr" />
                  <span className="bracket bl" />
                  <span className="bracket br" />
                  <span className="scan-beam" />
                </>
              )}{" "}
            </div>
            <div className="mt-5 flex flex-col items-center gap-4">
              <p className="text-center text-sm text-[#B4C9BF]">
                {file
                  ? "Image ready to analyze"
                  : "Keep the label clear and well lit"}
              </p>
              {file ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => setFile(null)}
                    className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold"
                  >
                    Retake
                  </button>
                  <button
                    onClick={analyze}
                    className="rounded-xl bg-[#18D96B] px-5 py-3 text-sm font-bold text-[#001F16]"
                  >
                    {analyzing ? "Analyzing…" : "Analyze Product"}
                  </button>
                </div>
              ) : (
                <button
                  className="capture-button"
                  onClick={() => inputRef.current?.click()}
                  aria-label="Upload an image"
                >
                  <Upload className="h-5 w-5 text-[#001F16]" />
                </button>
              )}
              <div className="flex items-center gap-5 text-xs text-[#8EA99D]">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="hover:text-[#B6F35B]"
                >
                  Upload instead
                </button>
                <button onClick={onClose} className="hover:text-white">
                  Cancel
                </button>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              onChange={chooseFile}
            />
          </>
        )}
      </div>
    </div>
  );
}

function ScanModal({
  onClose,
  initialFile,
}: {
  onClose: () => void;
  initialFile: File | null;
}) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    setCapturedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access requires a secure browser context.");
      }
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
      } catch (error) {
        if ((error as DOMException).name !== "OverconstrainedError")
          throw error;
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      const reason =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access in your browser settings or upload an image instead."
          : "Camera access is unavailable in this browser. Check permissions or upload an image instead.";
      setCameraError(reason);
    }
  };

  useEffect(() => {
    if (initialFile) {
      setCapturedFile(initialFile);
      setPreviewUrl(URL.createObjectURL(initialFile));
      stopCamera();
    } else {
      void startCamera();
    }

    return () => {
      stopCamera();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, []);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (
      !video ||
      !canvas ||
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
    )
      return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "nutriscan-capture.jpg", {
          type: "image/jpeg",
        });
        setCapturedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        stopCamera();
      },
      "image/jpeg",
      0.92,
    );
  };

  const chooseFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > 10 * 1024 * 1024) {
      setCameraError("Please choose an image under 10MB.");
      return;
    }
    stopCamera();
    setCapturedFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const analyze = async () => {
    if (!capturedFile) return;

    setAnalyzing(true);
    setErrorMessage("");

    try {
      const data = await analyzeProduct(capturedFile);

      stopCamera();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      onClose();

      navigate("/result", {
        state: data,
      });
    } catch (error) {
      console.error(error);

      setErrorMessage(error.message || "Failed to analyze image");
    } finally {
      setAnalyzing(false);
    }
  };

  const close = () => {
    stopCamera();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001F16]/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-[620px] overflow-hidden rounded-[28px] bg-[#0B211A] p-4 text-white shadow-2xl sm:p-7">
        <button
          onClick={close}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 hover:bg-white/20"
          aria-label="Close scanner"
        >
          <X className="h-5 w-5" />
        </button>
        {done ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#18D96B] text-[#001F16]">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Your product is ready</h2>
            <p className="mt-2 max-w-sm text-sm text-[#B4C9BF]">
              Your image was captured and sent to the analysis service.
            </p>
            <button
              onClick={() => {
                close();
                navigate("/result");
              }}
              className="mt-7 rounded-xl bg-[#18D96B] px-6 py-3 text-sm font-bold text-[#001F16]"
            >
              View results
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#168A4A]">
                <ScanLine className="h-5 w-5 text-[#B6F35B]" />
              </div>
              <div>
                <p className="font-bold">Scan your food label</p>
                <p className="text-xs text-[#8EA99D]">
                  Position the ingredient label inside the frame
                </p>
              </div>
            </div>
            <div className="camera-viewport">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Captured food label"
                  className="h-full w-full object-contain"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  <span className="bracket tl" />
                  <span className="bracket tr" />
                  <span className="bracket bl" />
                  <span className="bracket br" />
                  <span className="scan-beam" />
                </>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            {cameraError && (
              <p className="mt-3 text-center text-xs text-[#FFB4B1]">
                {cameraError}
              </p>
            )}
            <div className="mt-5 flex flex-col items-center gap-4">
              <p className="text-center text-sm text-[#B4C9BF]">
                {previewUrl
                  ? "Image ready to analyze"
                  : "Keep the label clear and well lit"}
              </p>
              {previewUrl ? (
                <>
                  {/* 👇 Error Message */}
                  {errorMessage && (
                    <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => void startCamera()}
                      className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold"
                    >
                      Retake
                    </button>

                    <button
                      onClick={() => void analyze()}
                      className="rounded-xl bg-[#18D96B] px-5 py-3 text-sm font-bold text-[#001F16]"
                    >
                      {analyzing ? "Analyzing…" : "Analyze Product"}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  className="capture-button"
                  onClick={captureFrame}
                  aria-label="Capture image"
                >
                  <Camera className="h-5 w-5 text-[#001F16]" />
                </button>
              )}
              <div className="flex items-center gap-5 text-xs text-[#8EA99D]">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="hover:text-[#B6F35B]"
                >
                  Upload instead
                </button>
                <button onClick={close} className="hover:text-white">
                  Cancel
                </button>
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
              onChange={chooseFile}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(
    null,
  );
  const [scannerOpen, setScannerOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    () => window.localStorage.getItem("nutriscan-theme") !== "light",
  );
  const uploadRef = useRef<HTMLInputElement>(null);
  const toggleTheme = () => {
    setIsDark((current) => {
      const next = !current;
      window.localStorage.setItem("nutriscan-theme", next ? "dark" : "light");
      return next;
    });
  };
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".scroll-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={`min-h-screen font-sans text-[#101828] ${isDark ? "dark-theme" : "bg-[#F7FBF7]"}`}
    >
      <Navbar
        onScan={() => setScannerOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      <main>
        <section className="scroll-reveal px-5 py-7 lg:px-8 lg:py-10">
          <div className="hero-shell mx-auto max-w-[1240px]">
            <div className="hero-panel grid items-center gap-8 rounded-[24px] p-6 sm:p-10 lg:grid-cols-[.95fr_1.05fr] lg:p-14">
              <div className="max-w-[500px]">
                <p className="eyebrow">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#18D96B]" />{" "}
                  Food clarity, powered by AI
                </p>
                <h1 className="hero-title mt-5 text-[clamp(2.55rem,5vw,4.65rem)] font-bold leading-[.98] tracking-[-.065em] text-[#F5F8F3]">
                  Scan any food product
                  <span className="block text-[#18D96B]">
                    Know what’s inside.
                  </span>
                </h1>
                <p className="hero-copy mt-6 max-w-[410px] text-[15px] leading-7">
                  Upload or capture a product image and get AI-powered insights
                  in seconds.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setScannerOpen(true)}
                    className="primary-cta"
                  >
                    <Camera className="h-[18px] w-[18px]" /> Scan Now{" "}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => uploadRef.current?.click()}
                    className="secondary-cta"
                  >
                    <Upload className="h-[18px] w-[18px]" /> Upload Image
                  </button>
                </div>
                <p className="hero-support mt-4 text-[11px]">
                  Supports: JPG, PNG <span className="mx-2">•</span> Max size:
                  10MB
                </p>
                <input
                  ref={uploadRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // selected file ko temporary store karo
                    setSelectedUploadFile(file);

                    // scanner modal open karo
                    setScannerOpen(true);
                  }}
                />
              </div>
              <ScannerVisual />
            </div>
          </div>
        </section>
        <section className="scroll-reveal mx-auto max-w-[1240px] px-5 py-16 lg:px-8">
          <div className="text-center">
            <p className="eyebrow">Simple by design</p>
            <h2 className="section-title mt-2">How it works</h2>
            <p className="mx-auto mt-3 max-w-[430px] text-sm leading-6 text-[#667085]">
              From label to clarity in four simple steps.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {steps.map(({ icon: Icon, number, title, copy }, index) => (
              <div className="workflow-step relative text-center" key={title}>
                {index < 3 && <span className="step-line" />}
                <div className="step-icon">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mt-5 block text-[11px] font-bold tracking-[.15em] text-[#8BA296]">
                  {number}
                </span>
                <h3 className="mt-2 font-bold text-[#101828]">{title}</h3>
                <p className="mx-auto mt-2 max-w-[180px] text-sm leading-6 text-[#667085]">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </section>
        <ResultsPreview />
      </main>
      {scannerOpen && (
        <ScanModal
          onClose={() => setScannerOpen(false)}
          initialFile={selectedUploadFile}
        />
      )}
    </div>
  );
}
