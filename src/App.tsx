import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, BatteryCharging, Check, ChevronLeft,
  ChevronRight, ExternalLink, Maximize, Menu, MessageCircle, Search, ShieldCheck,
  Sun, X, ZoomIn, ZoomOut,
} from "lucide-react";

type Angle = { key: string; label: string; query: string };
type Photo = { title: string; url: string; source: string; license: string; artist: string; angle: string };
type Model = {
  name: string; type: string; tag: string; status: string; statusNote: string;
  intro: string; styling: string; interior: string; performance: string; battery: string;
  safety: string; technology: string; specifications: string; official: string;
};

const angles: Angle[] = [
  { key: "front", label: "Front exterior", query: "front exterior" },
  { key: "rear", label: "Rear exterior", query: "rear exterior" },
  { key: "side", label: "Side exterior", query: "side profile" },
  { key: "front-three-quarter", label: "Front three-quarter", query: "front three quarter" },
  { key: "rear-three-quarter", label: "Rear three-quarter", query: "rear three quarter" },
  { key: "interior", label: "Interior and dashboard", query: "interior dashboard" },
];

const models: Model[] = [
  { name: "Model S", type: "Electric sedan", tag: "Long-range electric performance", status: "Current model", statusNote: "Configurations and availability vary by market.", intro: "Tesla's premium all-electric sedan pairs a low, aerodynamic profile with a spacious, software-led cabin. It is designed for comfortable everyday travel as well as responsive electric performance.", styling: "A clean sedan silhouette, sculpted bodywork and flush detailing give Model S its understated, aerodynamic character. Exterior equipment and finishes depend on configuration and region.", interior: "The cabin is deliberately minimal, with a large central touchscreen and a driver display. Seating, trim and controls vary with the current model year and configuration.", performance: "Dual-motor all-wheel-drive configurations are offered in some markets. Acceleration and top-speed figures depend on the exact variant; consult Tesla's live configurator for verified figures.", battery: "A high-voltage lithium-ion battery and regenerative braking support electric driving. EPA/WLTP range and charging rates vary with wheels, temperature, driving conditions and market; check Tesla's current regional specifications.", safety: "Active safety and driver-assistance features are delivered through Tesla's vehicle software. Feature availability and driver supervision requirements vary by region; these systems do not make the car autonomous.", technology: "The touchscreen supports vehicle controls, navigation, media and connected features. Equipment, software and connectivity services may vary by market and subscription.", specifications: "Body: five-door electric sedan. Drivetrain, seating details, dimensions, battery and range are configuration- and market-dependent. No unverified performance or pricing figures are shown here.", official: "https://www.tesla.com/models" },
  { name: "Model 3", type: "Electric sedan", tag: "Everyday electric driving", status: "Current model", statusNote: "Configurations and availability vary by market.", intro: "A compact all-electric sedan shaped around efficient everyday travel, a quiet cabin and over-the-air software. Model 3's exact equipment and specifications depend on the market and selected version.", styling: "The streamlined four-door form uses a smooth front profile and carefully managed airflow. Exterior details and available finishes can change across model years and regions.", interior: "A clean, open cabin centers on a touchscreen for vehicle controls and entertainment. Seating, materials, display arrangement and other details vary by configuration and model year.", performance: "Rear-wheel-drive and all-wheel-drive versions may be available depending on market. Acceleration and speed figures are variant-specific; use Tesla's official configurator for current data.", battery: "Battery-powered driving, regenerative braking and access to Tesla charging options are part of the ownership experience. Published range and charging performance depend on version, region and conditions.", safety: "Tesla describes a suite of active safety and driver-assistance functions. Availability is regional, and driver assistance requires active supervision; it is not a substitute for attentive driving.", technology: "A central touchscreen brings together navigation, media, climate and vehicle settings, with software updates delivered over the air when available. Connectivity and services vary by market.", specifications: "Body: four-door electric sedan. Exact dimensions, seating, drivetrain, battery, range and charging figures depend on current regional configuration. Confirm details directly with Tesla.", official: "https://www.tesla.com/model3" },
  { name: "Model X", type: "Electric SUV", tag: "Space, utility and electric drive", status: "Current model", statusNote: "Configurations and availability vary by market.", intro: "A spacious all-electric SUV that combines flexible passenger and cargo space with Tesla's connected vehicle technology. Seating configurations and equipment vary by region and build.", styling: "The tall SUV stance is paired with a smooth body profile and Model X's distinctive powered rear passenger doors. Door operation and exterior equipment should be confirmed for the selected vehicle.", interior: "A panoramic-feeling cabin is configured for passenger and cargo flexibility. A central display handles key functions; exact seating layout, display equipment and trim depend on configuration.", performance: "All-wheel-drive electric configurations are offered in some markets. Output and acceleration are variant-specific and can change; rely on current official Tesla figures rather than estimates.", battery: "The battery-electric powertrain uses regenerative braking and supports compatible charging. Range and charging figures depend on configuration, local test cycle and real-world conditions.", safety: "Active safety and driver-assistance features are available in supported regions. These require driver attention and do not make the vehicle self-driving; equipment may vary.", technology: "The touchscreen integrates vehicle settings, navigation and entertainment. Connected features, software capabilities and available services depend on market and subscription.", specifications: "Body: electric SUV. Seating, cargo capacity, drivetrain, dimensions, range and charging specifications vary by configuration and market. Consult the current Tesla listing.", official: "https://www.tesla.com/modelx" },
  { name: "Model Y", type: "Electric SUV", tag: "Versatile electric utility", status: "Current model", statusNote: "Configurations and availability vary by market.", intro: "An all-electric crossover designed to make daily driving practical, with a raised seating position and adaptable passenger and cargo space. Current versions differ across markets.", styling: "The compact SUV shape combines a gently sloping roofline with smooth, aerodynamic surfaces. Available wheels, paint and other exterior details are region-dependent.", interior: "A light, uncluttered cabin uses a touchscreen for most vehicle functions. Seating capacity, materials, storage and display details depend on the current configuration.", performance: "Rear-wheel-drive and all-wheel-drive options may be offered in selected markets. Acceleration and other performance figures are specific to the chosen variant.", battery: "A lithium-ion battery, regenerative braking and compatible charging support electric journeys. Official range and charging data varies by build, local test cycle and conditions.", safety: "Driver-assistance and active safety functions are available where supported. The driver must remain attentive and in control; feature names and availability vary regionally.", technology: "Navigation, media, climate controls and vehicle settings are accessible through the central display. Software, connectivity and entertainment features may change with updates and market.", specifications: "Body: electric crossover SUV. Seating, cargo volume, dimensions, powertrain, range and charging vary with model year and market. Verify the exact build with Tesla.", official: "https://www.tesla.com/modely" },
  { name: "Cybertruck", type: "Electric pickup", tag: "A distinctive electric pickup", status: "Market availability varies", statusNote: "Order and delivery availability are region-specific.", intro: "Tesla's electric pickup stands apart through its angular form and utility-focused design. Availability, configurations and specifications differ by country and may change over time.", styling: "A sharply faceted stainless-steel exterior gives Cybertruck a distinctive appearance. Surface care, accessories and equipment should be checked against Tesla's regional documentation.", interior: "The cabin combines a broad dashboard display with seating and storage intended for passenger and work use. Interior equipment and configuration may vary across versions.", performance: "Electric all-wheel-drive configurations are listed in some markets. Capability, towing and performance figures depend on the precise version and local homologation.", battery: "Battery, range and charging specifications are configuration- and market-dependent. Tesla's live regional product information is the authoritative source for current figures.", safety: "Safety features and driver assistance depend on software, hardware and regional rules. The driver remains responsible for safe operation and must supervise assistance systems.", technology: "A central display provides vehicle controls and connected functions. Software, connectivity, accessories and charging access vary by region and may be updated.", specifications: "Body: electric pickup. Dimensions, payload, towing, seating, battery, range and charging depend on the approved regional version. Confirm all figures and availability with Tesla.", official: "https://www.tesla.com/cybertruck" },
  { name: "Roadster", type: "Announced electric sports car", tag: "A future performance-focused sports car", status: "Upcoming / announced", statusNote: "Not presented as a currently available production vehicle.", intro: "Tesla has announced a future Roadster. Product timing, final design, specifications, pricing and market availability should be treated as unconfirmed until Tesla publishes current official details.", styling: "Images found in this gallery may depict previously shown prototypes or event displays, not a confirmed final production design. The production exterior may differ.", interior: "A final production interior and dashboard specification has not been confirmed here. Prototype imagery should not be interpreted as a complete production specification.", performance: "No performance figures are stated because final production specifications have not been verified. Treat any prototype or historical claim as unconfirmed unless Tesla currently confirms it.", battery: "Final battery technology, range and charging capabilities have not been confirmed for a production vehicle. Follow Tesla's official Roadster page for updates.", safety: "Production safety equipment and driver-assistance details have not been confirmed. These will depend on the final vehicle and regulations in each market.", technology: "Final displays, entertainment, connectivity and software features have not been confirmed. Prototype features may not carry over to production.", specifications: "Status: announced future vehicle. Production timing, final design, specifications, price and availability are unconfirmed. This showcase does not imply the vehicle is available to order.", official: "https://www.tesla.com/roadster" },
];

const energy = [
  { name: "Solar Panels", icon: Sun, copy: "Explore rooftop solar generation for homes. Installation suitability, system design, pricing and availability depend on your property and region." },
  { name: "Solar Roof", icon: Zap, copy: "An integrated solar roofing option where offered. Request a site-specific assessment and confirm current product availability with Tesla." },
  { name: "Powerwall", icon: BatteryCharging, copy: "Home battery storage can work alongside solar where available. Backup capability and system configuration depend on local requirements." },
];

const modelTokens = (name: string) => name === "Cybertruck" ? ["cybertruck"] : name === "Roadster" ? ["roadster"] : [name.toLowerCase().replace(" ", ""), name.toLowerCase()];
async function findLicensedPhoto(model: Model, angle: Angle, signal: AbortSignal): Promise<Photo | null> {
  const query = `Tesla ${model.name} ${angle.query}`;
  const params = new URLSearchParams({ action: "query", generator: "search", gsrsearch: query, gsrnamespace: "6", gsrlimit: "10", prop: "imageinfo", iiprop: "url|extmetadata", iiurlwidth: "1800", format: "json", origin: "*" });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { signal });
  if (!response.ok) throw new Error("Image catalogue unavailable");
  const data = await response.json();
  const pages = Object.values(data?.query?.pages ?? {}) as Array<{ title?: string; fullurl?: string; imageinfo?: Array<{ thumburl?: string; url?: string; descriptionurl?: string; extmetadata?: Record<string, { value?: string }> }> }>;
  const tokens = modelTokens(model.name);
  for (const page of pages) {
    const title = page.title ?? "";
    const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!normalized.includes("tesla") || !tokens.some(token => normalized.includes(token))) continue;
    const info = page.imageinfo?.[0];
    const metadata = info?.extmetadata ?? {};
    const license = metadata.LicenseShortName?.value?.replace(/<[^>]*>/g, "").trim() ?? "";
    if (!info?.thumburl || !/(CC|Creative Commons|Public domain)/i.test(license)) continue;
    return {
      title: title.replace(/^File:/, ""), url: info.thumburl, source: info.descriptionurl ?? page.fullurl ?? "https://commons.wikimedia.org/",
      license, artist: (metadata.Artist?.value ?? "Photographer not listed").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim(), angle: angle.label,
    };
  }
  return null;
}

function PhotoFrame({ photo, alt, className = "" }: { photo?: Photo; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photo?.url]);
  return <div className={`photo-frame ${className}`}>
    {photo && !failed ? <img src={photo.url} alt={alt} loading="lazy" onError={() => setFailed(true)} /> : <div className="photo-fallback"><span>TESLAVOLT</span><small>{photo ? "Image unavailable — no substitute shown" : "Searching licensed Tesla photography…"}</small></div>}
  </div>;
}

export default function App() {
  const [selected, setSelected] = useState<Model | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [slide, setSlide] = useState(0);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const [support, setSupport] = useState("");
  const [toast, setToast] = useState("");
  const [zoom, setZoom] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const filtered = useMemo(() => models.filter(model => `${model.name} ${model.type}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const currentPhoto = photos[slide];

  const go = useCallback((id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenu(false); }, []);
  const closeShowcase = useCallback(() => { setSelected(null); setPhotos([]); setSlide(0); setZoom(false); setFullscreen(false); }, []);
  const move = useCallback((direction: number) => setSlide(index => photos.length ? (index + direction + photos.length) % photos.length : 0), [photos.length]);
  const openModel = (model: Model) => { setSelected(model); setPhotos([]); setSlide(0); setZoom(false); };
  const message = (topic: string) => setSupport(`Hello TeslaVolt, I would like information about ${topic}. Please share verified details, availability and next steps.`);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    let cancelled = false;
    setPhotos([]); setSlide(0);
    Promise.all(angles.map(angle => findLicensedPhoto(selected, angle, controller.signal).catch(() => null)))
      .then(results => {
        if (cancelled) return;
        const seen = new Set<string>();
        setPhotos(results.map((photo, index) => {
          if (photo && seen.has(photo.url)) return null;
          if (photo) seen.add(photo.url);
          return photo ? { ...photo, angle: angles[index].label } : null;
        }).filter((photo): photo is Photo => photo !== null));
      });
    return () => { cancelled = true; controller.abort(); };
  }, [selected]);

  useEffect(() => {
    if (!selected && !support) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { closeShowcase(); setSupport(""); }
      if (selected && event.key === "ArrowRight") move(1);
      if (selected && event.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, support, closeShowcase, move]);

  const openChat = () => {
    const chaport = (window as Window & { chaport?: { q?: (...args: unknown[]) => void } }).chaport;
    if (chaport?.q) { chaport.q(["open"]); setToast("Opening Chaport live chat…"); }
    else setToast("Use the Chaport chat bubble to continue your enquiry.");
    window.setTimeout(() => setToast(""), 3500);
  };

  return <div className="app">
    <div className="topline"><span>INDEPENDENT ELECTRIC MOBILITY &amp; CLEAN-ENERGY SHOWCASE</span><span>INFORMATION • ENQUIRIES • DISCOVERY</span></div>
    <header><a className="brand" href="#home" onClick={event => { event.preventDefault(); go("home"); }}><b>T</b> TESLAVOLT<span>.</span></a>
      <nav className={menu ? "open" : ""}><button onClick={() => go("vehicles")}>Vehicles</button><button onClick={() => go("energy")}>Energy</button><button onClick={() => go("about")}>About</button><button onClick={() => go("faq")}>FAQ</button><button className="nav-cta" onClick={() => message("general information")}>Enquire <ArrowRight size={14}/></button></nav>
      <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label={menu ? "Close navigation" : "Open navigation"}>{menu ? <X/> : <Menu/>}</button>
    </header>
    <main>
      <section className="hero" id="home"><div className="heroimg"/><div className="shade"/><div className="herotxt"><small>— ELECTRIC MOBILITY. A NEW PERSPECTIVE.</small><h1>DRIVE<br/><i>THE FUTURE.</i></h1><p>A considered look at Tesla vehicles and clean-energy technology.</p><button className="redbtn" onClick={() => go("vehicles")}>Explore the collection <ArrowDown size={16}/></button></div><div className="hero-index">01 <span>—</span> 06 &nbsp; / &nbsp; TESLA COLLECTION</div></section>
      <section className="intro wrap"><div><small>01 / THE COLLECTION</small><h2>Electric icons.<br/><i>Distinctive engineering.</i></h2></div><p>Discover six Tesla vehicles, from current models to an announced future sports car. Select a vehicle for its showcase, licensed photography and verified product information.</p></section>
      <section className="wrap vehicles" id="vehicles"><div className="heading"><div><small>EXPLORE THE LINEUP</small><h2>Find your <i>drive.</i></h2></div><label className="search"><Search size={16}/><input placeholder="Search Tesla vehicles" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search Tesla vehicles"/>{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={15}/></button>}</label></div>
        <div className="grid">{filtered.map((model, index) => <button className={`vehicle-card ${model.name === "Roadster" ? "roadster-card" : ""}`} key={model.name} onClick={() => openModel(model)}><div className="card-image"><span className="card-index">0{index + 1}</span><span className="card-open"><ArrowRight size={18}/></span><div className="card-gradient"/><div className="card-title"><small>{model.type}</small><h3>{model.name}<span>.</span></h3><p>{model.tag}</p></div></div><div className="card-meta"><span>{model.status}</span><span>Discover <ArrowRight size={13}/></span></div></button>)}</div>
        {filtered.length === 0 && <p className="empty">No Tesla models match that search.</p>}
      </section>
      <section className="roadster"><div><small>— THE FUTURE OF PERFORMANCE</small><h2>ROADSTER<span>.</span></h2><p>An announced future vehicle, not a currently available production model. Final specifications and timing remain unconfirmed.</p><button className="text-btn" onClick={() => openModel(models[5])}>Explore the announcement <ArrowRight size={16}/></button></div><div className="roadster-art" aria-hidden="true"><span>R</span></div></section>
      <section className="wrap energy" id="energy"><div className="heading"><div><small>02 / ENERGY ECOSYSTEM</small><h2>Power a brighter <i>tomorrow.</i></h2></div><p className="muted">A dedicated look at Tesla energy products — separate from the vehicle collection.</p></div><div className="energy-grid">{energy.map(({ name, icon: Icon, copy }) => <article className="energy-card" key={name}><span className="energy-icon"><Icon size={20}/></span><small>TESLA ENERGY</small><h3>{name}</h3><p>{copy}</p><button onClick={() => message(`${name} information`)}>Enquire <ArrowRight size={14}/></button></article>)}</div></section>
      <section className="notice"><ShieldCheck size={25}/><div><small>INDEPENDENT SHOWCASE</small><h2>Make informed decisions.</h2><p>TeslaVolt is not affiliated with Tesla, Inc. Product details, availability and features change by region and over time. Always confirm current specifications directly with Tesla. This site does not offer financial investments or securities.</p></div></section>
      <section className="wrap about" id="about"><small>03 / ABOUT TESLAVOLT</small><h2>A place to explore<br/><i>what moves us forward.</i></h2><p>TeslaVolt is an independent informational showcase for Tesla electric vehicles and energy products. We link to official Tesla product pages for current regional information, and show openly licensed photography with source and license attribution.</p></section>
      <section className="wrap faq" id="faq"><small>04 / QUESTIONS</small><h2>Good to <i>know.</i></h2><details><summary>Is TeslaVolt the official Tesla website?</summary><p>No. TeslaVolt is an independent showcase and is not affiliated with Tesla, Inc.</p></details><details><summary>Where should I check current specifications?</summary><p>Use the official Tesla product link in each vehicle showcase. Specifications and availability vary by market and configuration.</p></details><details><summary>How are gallery images sourced?</summary><p>Images are looked up from Wikimedia Commons and only shown when the file is identified as the requested Tesla model and has a Creative Commons or public-domain license. Each image includes an attribution and source link. If no match is available, no substitute photograph is displayed.</p></details><details><summary>Is Roadster available to order?</summary><p>This showcase identifies Roadster as announced/upcoming. Timing, production specifications and availability are not confirmed here; check Tesla's official updates.</p></details><details><summary>How can I ask a question?</summary><p>Use the enquiry button or the Chaport live chat bubble to contact the TeslaVolt team.</p></details></section>
    </main>
    <footer><div className="foot"><a className="brand" href="#home" onClick={event => { event.preventDefault(); go("home"); }}><b>T</b> TESLAVOLT<span>.</span></a><p>Electric mobility. Clean energy. Informed choices.</p><button className="redbtn" onClick={() => message("general information")}>Start an enquiry <ArrowRight size={15}/></button></div><div className="copyright">© TESLAVOLT · INDEPENDENT SHOWCASE · NOT AFFILIATED WITH TESLA, INC.</div></footer>

    {selected && <div className={`backdrop ${fullscreen ? "gallery-fullscreen" : ""}`} onClick={closeShowcase}>
      <div className="modal showcase-modal" ref={modalRef} onClick={event => event.stopPropagation()}>
        <button className="close" onClick={closeShowcase} aria-label="Close vehicle showcase"><X/></button>
        <div className="showcase-head"><div><small>{selected.status.toUpperCase()} &nbsp; / &nbsp; {selected.type.toUpperCase()}</small><h2>{selected.name}<span>.</span></h2><p>{selected.tag}</p></div><a className="official-link" href={selected.official} target="_blank" rel="noreferrer">Official Tesla information <ExternalLink size={14}/></a></div>
        <div className="gallery" onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => { if (touchStart.current !== null && Math.abs(event.changedTouches[0].clientX - touchStart.current) > 45) move(event.changedTouches[0].clientX < touchStart.current ? 1 : -1); touchStart.current = null; }}>
          <div className="main-photo">{currentPhoto ? <PhotoFrame photo={currentPhoto} alt={`${selected.name} — ${currentPhoto.angle}`} className={zoom ? "zoomed" : ""}/> : <div className="photo-fallback"><span>TESLAVOLT</span><small>{photos.length ? "No licensed photo matched this angle — no substitute shown." : "Searching Wikimedia Commons for licensed Tesla photographs…"}</small></div>}
            {photos.length > 1 && <><button className="gallery-arrow prev" onClick={() => move(-1)} aria-label="Previous photograph"><ChevronLeft/></button><button className="gallery-arrow next" onClick={() => move(1)} aria-label="Next photograph"><ChevronRight/></button></>}
            <div className="gallery-tools"><button onClick={() => setZoom(!zoom)} aria-label={zoom ? "Zoom out" : "Zoom in"}>{zoom ? <ZoomOut/> : <ZoomIn/>}</button><button onClick={() => setFullscreen(!fullscreen)} aria-label={fullscreen ? "Exit fullscreen" : "View fullscreen"}><Maximize/></button></div>
            <span className="photo-count">{photos.length ? `${String(slide + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}` : "— / 06"}</span>
          </div>
          <div className="photo-caption"><span>{currentPhoto?.angle ?? "Tesla vehicle gallery"}</span>{currentPhoto && <span>Photo: {currentPhoto.artist} · {currentPhoto.license} · <a href={currentPhoto.source} target="_blank" rel="noreferrer">Source <ExternalLink size={11}/></a></span>}</div>
          <div className="thumbnails" aria-label="Vehicle photographs">{angles.map((angle, index) => <button className={currentPhoto?.angle === angle.label ? "active" : ""} key={angle.key} onClick={() => { const photoIndex = photos.findIndex(photo => photo.angle === angle.label); if (photoIndex >= 0) setSlide(photoIndex); }} aria-label={`View ${angle.label}`}><span>{String(index + 1).padStart(2, "0")}</span><small>{angle.label}</small>{photos.some(photo => photo.angle === angle.label) ? <Check size={13}/> : <span className="thumb-unavailable">—</span>}</button>)}</div>
        </div>
        <div className="showcase-body"><div className="showcase-intro"><small>VEHICLE OVERVIEW</small><p>{selected.intro}</p><p className="status-note">{selected.statusNote}</p></div><div className="detail-grid">{[["Exterior design", selected.styling], ["Interior & dashboard", selected.interior], ["Performance", selected.performance], ["Battery, range & charging", selected.battery], ["Safety & driver assistance", selected.safety], ["Entertainment & connectivity", selected.technology], ["Technical specifications", selected.specifications]].map(([title, copy]) => <section key={title}><small>{title.toUpperCase()}</small><p>{copy}</p></section>)}</div><div className="showcase-footer"><span>Figures and features vary by configuration and region. Confirm directly with Tesla.</span><button className="redbtn" onClick={() => message(`${selected.name} vehicle information`)}>Investment / Enquiry <ArrowRight size={15}/></button></div></div>
      </div>
    </div>}

    {support && <div className="backdrop" onClick={() => setSupport("")}><div className="supportmodal" onClick={event => event.stopPropagation()}><button className="close" onClick={() => setSupport("")} aria-label="Close enquiry"><X/></button><small>TESLAVOLT / ENQUIRY</small><h2>Start a conversation.</h2><p>Your enquiry is ready. Continue with the existing Chaport live chat integration to contact us.</p><div className="enquiry-copy">{support}</div><button className="redbtn" onClick={openChat}>Continue to live chat <MessageCircle size={16}/></button><button className="support-cancel" onClick={() => setSupport("")}>Not right now</button></div></div>}
    {toast && <div className="toast">{toast}</div>}<button className="float" onClick={() => message("general support")} aria-label="Open support enquiry"><MessageCircle/></button>
  </div>;
}
