import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle2, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useGeolocation } from "../../hooks/useGeolocation";
import appConfig from "../../config/appConfig";
import { Button, Input } from "../../components/ui";
import PressureTrace from "../../components/ui/PressureTrace";

const DEFAULT_PREFERENCES = {
  flood: true,
  cyclone: true,
  heavyRain: true,
  heat: true,
  landslide: true,
};

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const STRENGTH_LABEL = ["Too weak", "Weak", "Okay", "Good", "Strong"];
const STRENGTH_COLOR = ["bg-danger-400", "bg-danger-400", "bg-signal-400", "bg-cyan-400", "bg-safe-400"];

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { requestLocation, loading: geoLoading, error: geoError } = useGeolocation();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [location, setLocation] = useState(null);
  const [manualCity, setManualCity] = useState("Colombo");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(password);

  const handleAllowLocation = async () => {
    setError("");
    try {
      const loc = await requestLocation();
      setLocation(loc);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        alertPreferences: preferences,
        location: location ? { ...location, city: manualCity } : undefined,
      });
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        "Registration failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const togglePref = (key) => setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-midnight-400 p-10 lg:flex">
        <div className="absolute inset-0 bg-grid-lines bg-grid opacity-30" />
        <Link to="/" className="relative font-display text-lg font-bold text-mist">{appConfig.shortName}</Link>
        <div className="relative">
          <PressureTrace className="h-32 w-full text-signal-400/60" />
          <h2 className="mt-8 max-w-sm font-display text-2xl font-semibold text-mist">
            Three minutes to set up early warnings for everywhere that matters to you.
          </h2>
        </div>
        <p className="relative font-mono text-xs text-mist/30">Free for every resident of Sri Lanka.</p>
      </div>

      <div className="flex items-center justify-center bg-mist px-4 py-16 dark:bg-midnight-300">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center gap-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
            {[1, 2, 3].map((s) => (
              <span key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? "bg-cyan-400" : "bg-midnight-400/10 dark:bg-white/10"}`} />
            ))}
          </div>

          {error && (
            <div role="alert" className="mb-5 rounded-lg border border-danger-400/30 bg-danger-50 px-4 py-2.5 font-body text-sm text-danger-500 dark:bg-danger-400/10">
              {error}
            </div>
          )}
          {geoError && step === 2 && (
            <div role="alert" className="mb-5 rounded-lg border border-danger-400/30 bg-danger-50 px-4 py-2.5 font-body text-sm text-danger-500 dark:bg-danger-400/10">
              {geoError}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                <h1 className="font-display text-2xl font-bold text-midnight-400 dark:text-mist">Create account</h1>
                <p className="mt-1.5 font-body text-sm text-midnight-400/60 dark:text-mist/60">
                  Join {appConfig.shortName} to get personalised disaster warnings.
                </p>
                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                >
                  <Input label="Full name" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  <Input label="Email" id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <div>
                    <Input
                      label="Password"
                      id="reg-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                    {password.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => (
                            <span key={i} className={`h-1 flex-1 rounded-full ${i < strength ? STRENGTH_COLOR[strength] : "bg-midnight-400/10 dark:bg-white/10"}`} />
                          ))}
                        </div>
                        <p className="mt-1 font-mono text-[11px] text-midnight-400/50 dark:text-mist/50">{STRENGTH_LABEL[strength]}</p>
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full" size="lg">Continue</Button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                <h1 className="font-display text-2xl font-bold text-midnight-400 dark:text-mist">Allow location</h1>
                <div className="mt-6 flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-50 text-cyan-500 dark:bg-cyan-400/10">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <p className="mt-4 font-body text-sm text-midnight-400/60 dark:text-mist/60">
                    We use your location only to send alerts relevant to your area. You can skip this and enter a city manually.
                  </p>
                  <Button type="button" variant="outline" onClick={handleAllowLocation} loading={geoLoading} className="mt-5 w-full">
                    {geoLoading ? "Detecting" : "Allow location access"}
                  </Button>
                  {location && (
                    <p className="mt-3 flex items-center gap-1.5 font-mono text-xs text-safe-500">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Location captured ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                    </p>
                  )}
                  <div className="mt-5 w-full text-left">
                    <Input label="Or enter your city" id="manual-city" value={manualCity} onChange={(e) => setManualCity(e.target.value)} placeholder="Colombo" />
                  </div>
                  <div className="mt-5 flex w-full gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                    <Button type="button" onClick={() => setStep(3)} className="flex-1">Continue</Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                <h1 className="font-display text-2xl font-bold text-midnight-400 dark:text-mist">Alert preferences</h1>
                <p className="mt-1.5 font-body text-sm text-midnight-400/60 dark:text-mist/60">
                  Choose which disaster types you want to be warned about.
                </p>
                <form className="mt-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.entries(preferences).map(([key, enabled]) => (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 font-body text-sm capitalize transition-colors ${
                          enabled
                            ? "border-cyan-400/40 bg-cyan-50 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300"
                            : "border-midnight-400/15 text-midnight-400/60 dark:border-white/15 dark:text-mist/60"
                        }`}
                      >
                        <input type="checkbox" checked={enabled} onChange={() => togglePref(key)} className="accent-cyan-400" />
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                    <Button type="submit" loading={loading} className="flex-1">
                      {loading ? "Creating account" : "Create account"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center font-body text-sm text-midnight-400/60 dark:text-mist/60">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-cyan-500 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
