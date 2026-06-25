import { Link } from "react-router-dom";
import { Megaphone, Phone } from "lucide-react";
import appConfig from "../../config/appConfig";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/#features" },
      { label: "Safety tips", to: "/#safety-tips" },
      { label: "Emergency contacts", to: "/#emergency-contacts" },
      { label: "FAQ", to: "/#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", to: "/login" },
      { label: "Create account", to: "/register" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/#contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight-500">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-mist">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-400">
                <Megaphone className="h-[18px] w-[18px]" />
              </span>
              {appConfig.shortName}
            </div>
            <p className="mt-3 max-w-xs font-body text-sm text-mist/50">{appConfig.description}</p>
            <a
              href={`tel:${appConfig.emergency.hotline}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-danger-400/15 px-4 py-2 font-mono text-xs font-semibold text-danger-400"
            >
              <Phone className="h-3.5 w-3.5" /> Emergency: {appConfig.emergency.hotline}
            </a>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs font-medium uppercase tracking-wide text-mist/40">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="font-body text-sm text-mist/60 hover:text-mist">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="font-body text-xs text-mist/40">
            &copy; {new Date().getFullYear()} {appConfig.company.name}. Demonstration project — for real
            emergencies, always contact {appConfig.emergency.hotline}.
          </p>
          <p className="font-mono text-xs text-mist/30">{appConfig.company.supportEmail}</p>
        </div>
      </div>
    </footer>
  );
}
