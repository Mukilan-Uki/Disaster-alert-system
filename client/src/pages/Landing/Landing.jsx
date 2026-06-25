import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck, Radio, CloudLightning, MapPinned, BellRing, Users,
  ChevronDown, Phone, Quote, ArrowRight, Activity, Siren,
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import useFetchWeather from "../../hooks/useFetchWeather";
import { getWeatherIcon } from "../../services/weatherService";
import appConfig from "../../config/appConfig";
import { Button, Card, Badge } from "../../components/ui";
import PressureTrace from "../../components/ui/PressureTrace";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

function SectionLabel({ children }) {
  return (
    <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.18em] text-cyan-400">
      {children}
    </p>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-midnight-400 pb-20 pt-16 sm:pt-24">
      <div className="absolute inset-0 bg-grid-lines bg-grid opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <Badge tone="info" icon={Activity}>Live across 25 districts</Badge>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-mist sm:text-5xl lg:text-6xl">
            Know the storm before it reaches your door.
          </h1>
          <p className="mt-5 max-w-lg font-body text-lg text-mist/70">
            {appConfig.description} Real-time weather intelligence, personalised
            disaster alerts, and a direct line to emergency services — built for
            every district in Sri Lanka.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button as={Link} to="/register" size="lg">
              Get protected free <ArrowRight className="h-4 w-4" />
            </Button>
            <Button as={Link} to="/login" variant="ghost" size="lg">
              Sign in
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm text-mist/50">
            <div><span className="text-xl font-semibold text-mist">25</span> districts monitored</div>
            <div><span className="text-xl font-semibold text-mist">&lt;5min</span> alert latency</div>
            <div><span className="text-xl font-semibold text-mist">24/7</span> automated watch</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <Card glass className="relative overflow-hidden p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wide text-mist/50">Pressure trace — live</span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-safe-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safe-400" /> monitoring
              </span>
            </div>
            <PressureTrace className="mt-4 h-28 w-full text-cyan-400" />
            <div className="mt-2 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 font-mono text-xs text-mist/50">
              <div>COLOMBO <br /><span className="text-safe-400">SAFE</span></div>
              <div>GALLE <br /><span className="text-signal-400">WATCH</span></div>
              <div>RATNAPURA <br /><span className="text-danger-400">ALERT</span></div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function LiveAlertPreview() {
  const mockAlerts = [
    { city: "Ratnapura", type: "Flood Warning", level: "danger", time: "12 min ago" },
    { city: "Galle", type: "Heavy Rainfall", level: "warning", time: "38 min ago" },
    { city: "Kandy", type: "Landslide Risk", level: "warning", time: "1 hr ago" },
  ];
  const tone = { danger: "danger", warning: "warning" };
  return (
    <section className="bg-mist py-20 dark:bg-midnight-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionLabel>Live alert feed</SectionLabel>
            <h2 className="font-display text-3xl font-bold text-midnight-400 dark:text-mist">
              Alerts the moment risk crosses the line.
            </h2>
            <p className="mt-4 max-w-md font-body text-midnight-400/70 dark:text-mist/70">
              Every district is scored continuously against rainfall, wind, and flood
              thresholds. The moment a reading crosses a safe limit, an alert goes out —
              to the app, to email, and to push notifications.
            </p>
            <Button as={Link} to="/alerts" variant="outline" className="mt-6">
              View alert history <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {mockAlerts.map((a, i) => (
              <motion.div key={a.city} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
                <Card className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <Siren className={`h-5 w-5 ${a.level === "danger" ? "text-danger-400" : "text-signal-400"}`} />
                    <div>
                      <p className="font-body text-sm font-semibold text-midnight-400 dark:text-mist">{a.type}</p>
                      <p className="font-body text-xs text-midnight-400/50 dark:text-mist/50">{a.city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge tone={tone[a.level]}>{a.level === "danger" ? "Alert" : "Watch"}</Badge>
                    <p className="mt-1 font-mono text-[11px] text-midnight-400/40 dark:text-mist/40">{a.time}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WeatherIntelligencePreview() {
  const { data, loading } = useFetchWeather(appConfig.weather.defaultCity);
  return (
    <section className="bg-white py-20 dark:bg-midnight-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 max-w-xl">
          <SectionLabel>Weather intelligence</SectionLabel>
          <h2 className="font-display text-3xl font-bold text-midnight-400 dark:text-mist">
            One forecast platform, every district.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            {loading || !data ? (
              <div className="h-24 animate-pulse rounded-lg bg-midnight-400/5 dark:bg-white/5" />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="font-body text-sm font-medium text-midnight-400 dark:text-mist">{data.city}</p>
                  <img src={getWeatherIcon(data.icon)} alt="" className="h-8 w-8" />
                </div>
                <p className="mt-2 font-display text-3xl font-bold text-midnight-400 dark:text-mist">{data.temperature}°C</p>
                <p className="font-body text-xs capitalize text-midnight-400/50 dark:text-mist/50">{data.description}</p>
              </>
            )}
          </Card>
          {[
            { label: "Rainfall risk", value: "Moderate", icon: CloudLightning, tone: "warning" },
            { label: "Coastal advisory", value: "None active", icon: ShieldCheck, tone: "safe" },
            { label: "Districts on watch", value: "3 of 25", icon: MapPinned, tone: "info" },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <s.icon className="h-5 w-5 text-cyan-400" />
              <p className="mt-3 font-body text-sm text-midnight-400/60 dark:text-mist/60">{s.label}</p>
              <p className="mt-1 font-display text-xl font-semibold text-midnight-400 dark:text-mist">{s.value}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: Radio, title: "Real-time monitoring", desc: "Automated checks against live OpenWeatherMap data, every few minutes, for every saved location." },
  { icon: BellRing, title: "Personalised alerts", desc: "Push, email, and in-app notifications scoped to the districts you actually care about." },
  { icon: MapPinned, title: "Interactive risk map", desc: "See flood, landslide, and storm risk overlaid on a live map of Sri Lanka." },
  { icon: ShieldCheck, title: "Preparedness guidance", desc: "District-specific safety guidance, written with the Disaster Management Centre's protocols in mind." },
  { icon: Users, title: "Built for households", desc: "Save multiple locations — home, work, family — and track risk across all of them at once." },
  { icon: Activity, title: "Risk scoring engine", desc: "A transparent scoring model turns raw weather data into a clear safe / watch / alert signal." },
];

function Features() {
  return (
    <section id="features" className="bg-mist py-20 dark:bg-midnight-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 max-w-xl">
          <SectionLabel>Features</SectionLabel>
          <h2 className="font-display text-3xl font-bold text-midnight-400 dark:text-mist">
            Everything you need to stay ahead of the weather.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}>
              <Card className="h-full p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-500 dark:bg-cyan-400/10">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-midnight-400 dark:text-mist">{f.title}</h3>
                <p className="mt-2 font-body text-sm text-midnight-400/60 dark:text-mist/60">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapPreview() {
  return (
    <section className="bg-white py-20 dark:bg-midnight-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionLabel>Interactive map</SectionLabel>
            <h2 className="font-display text-3xl font-bold text-midnight-400 dark:text-mist">
              Risk, mapped to where you live.
            </h2>
            <p className="mt-4 max-w-md font-body text-midnight-400/70 dark:text-mist/70">
              Zoom into any district to see live weather conditions and current risk
              level, sourced from the same data feeding your alerts.
            </p>
            <Button as={Link} to="/location/colombo" variant="outline" className="mt-6">
              Explore the map <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <Card className="flex h-72 items-center justify-center overflow-hidden p-0">
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-cyan-50 to-mist text-midnight-400/40 dark:from-midnight-200 dark:to-midnight-300 dark:text-mist/30">
              <MapPinned className="h-10 w-10" />
              <p className="font-mono text-xs uppercase tracking-wide">Full map inside the dashboard</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

const SAFETY_TIPS = [
  { title: "Before a flood", items: ["Move valuables and documents to higher ground", "Know your district's evacuation route", "Keep a charged power bank ready"] },
  { title: "During heavy rain", items: ["Avoid crossing flooded roads or bridges", "Stay updated through the app or radio", "Switch off mains electricity if water enters your home"] },
  { title: "After the event", items: ["Avoid drinking flood-affected water", "Check structural damage before re-entering buildings", "Report hazards to the DMC hotline"] },
];

function SafetyPreparedness() {
  return (
    <section id="safety-tips" className="bg-mist py-20 dark:bg-midnight-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 max-w-xl">
          <SectionLabel>Safety preparedness</SectionLabel>
          <h2 className="font-display text-3xl font-bold text-midnight-400 dark:text-mist">Prepared, not panicked.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {SAFETY_TIPS.map((group) => (
            <Card key={group.title} className="p-6">
              <h3 className="font-display text-base font-semibold text-midnight-400 dark:text-mist">{group.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.items.map((it) => (
                  <li key={it} className="flex gap-2 font-body text-sm text-midnight-400/70 dark:text-mist/70">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400" /> {it}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const CONTACTS = [
  { name: "Disaster Management Centre", number: "1990" },
  { name: "Police Emergency", number: "119" },
  { name: "Ambulance", number: "1990" },
  { name: "Fire & Rescue", number: "110" },
];

function EmergencyContacts() {
  return (
    <section id="emergency-contacts" className="bg-midnight-400 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 max-w-xl">
          <SectionLabel>Emergency contacts</SectionLabel>
          <h2 className="font-display text-3xl font-bold text-mist">Help is one call away.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACTS.map((c) => (
            <a
              key={c.name}
              href={`tel:${c.number}`}
              className="group flex items-center justify-between rounded-card border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-danger-400/40 hover:bg-danger-400/5"
            >
              <div>
                <p className="font-body text-sm text-mist/70">{c.name}</p>
                <p className="mt-1 font-mono text-xl font-semibold text-mist">{c.number}</p>
              </div>
              <Phone className="h-5 w-5 text-mist/30 group-hover:text-danger-400" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Nimal P.", role: "Resident, Ratnapura", quote: "I got the flood warning a full hour before the water reached our street. That margin mattered." },
  { name: "Dilani W.", role: "Shop owner, Galle", quote: "Saving multiple locations means I can watch over my home and my shop from one screen." },
  { name: "Ashan F.", role: "Volunteer, DMC outreach", quote: "We point new residents to this for plain-language safety guidance ahead of monsoon season." },
];

function Testimonials() {
  return (
    <section className="bg-white py-20 dark:bg-midnight-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 max-w-xl">
          <SectionLabel>From the community</SectionLabel>
          <h2 className="font-display text-3xl font-bold text-midnight-400 dark:text-mist">Trusted by people who need it most.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="p-6">
              <Quote className="h-5 w-5 text-cyan-400/50" />
              <p className="mt-4 font-body text-sm text-midnight-400/80 dark:text-mist/80">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-5 font-body text-sm font-semibold text-midnight-400 dark:text-mist">{t.name}</p>
              <p className="font-body text-xs text-midnight-400/50 dark:text-mist/50">{t.role}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "Is AlertLanka free to use?", a: "Yes. Creating an account, saving locations, and receiving alerts is free for all residents." },
  { q: "How fast are alerts sent?", a: "Conditions are checked continuously and alerts are typically issued within minutes of a threshold being crossed." },
  { q: "Does this replace official DMC warnings?", a: "No — always follow Disaster Management Centre and government guidance. AlertLanka is a supplementary early-warning tool." },
  { q: "Can I track more than one location?", a: "Yes, you can save multiple locations — for example home, work, and a relative's address — from your dashboard." },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section id="faq" className="bg-mist py-20 dark:bg-midnight-300">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="font-display text-3xl font-bold text-midnight-400 dark:text-mist">Questions, answered.</h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <Card key={item.q} className="overflow-hidden p-0">
              <button
                className="flex w-full items-center justify-between p-5 text-left"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                aria-expanded={openIdx === i}
              >
                <span className="font-body text-sm font-medium text-midnight-400 dark:text-mist">{item.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-midnight-400/50 transition-transform dark:text-mist/50 ${openIdx === i ? "rotate-180" : ""}`} />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 font-body text-sm text-midnight-400/70 dark:text-mist/70">{item.a}</div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden bg-midnight-400 py-20">
      <PressureTrace className="absolute inset-x-0 bottom-0 h-32 w-full text-cyan-400/10" animate={false} />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold text-mist sm:text-4xl">
          Don't wait for the warning siren.
        </h2>
        <p className="mt-4 font-body text-mist/60">
          Set up your locations in under two minutes and get ahead of the next monsoon.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button as={Link} to="/register" size="lg">Create your free account</Button>
          <Button as={Link} to="/about" variant="ghost" size="lg">Learn more</Button>
        </div>
        <p className="mt-6 font-body text-xs text-mist/40">
          Questions? Reach us at{" "}
          <a href={`mailto:${appConfig.company.contactEmail}`} className="text-cyan-400 underline-offset-2 hover:underline">
            {appConfig.company.contactEmail}
          </a>
        </p>
      </div>
    </section>
  );
}

function Landing() {
  const { t } = useLanguage();
  void t;
  return (
    <div className="landing">
      <Hero />
      <LiveAlertPreview />
      <WeatherIntelligencePreview />
      <Features />
      <MapPreview />
      <SafetyPreparedness />
      <EmergencyContacts />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </div>
  );
}

export default Landing;
