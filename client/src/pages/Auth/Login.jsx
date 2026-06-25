import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, MapPinned, BellRing } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import appConfig from "../../config/appConfig";
import { Button, Input } from "../../components/ui";
import PressureTrace from "../../components/ui/PressureTrace";

const BENEFITS = [
  { icon: BellRing, text: "Personalised alerts for the locations you care about" },
  { icon: MapPinned, text: "Live risk map across every district" },
  { icon: ShieldCheck, text: "Preparedness guidance when it matters most" },
];

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-midnight-400 p-10 lg:flex">
        <div className="absolute inset-0 bg-grid-lines bg-grid opacity-30" />
        <Link to="/" className="relative font-display text-lg font-bold text-mist">{appConfig.shortName}</Link>
        <div className="relative">
          <PressureTrace className="h-32 w-full text-cyan-400/60" />
          <h2 className="mt-8 max-w-sm font-display text-2xl font-semibold text-mist">
            Continuous monitoring, so you don't have to watch the sky yourself.
          </h2>
          <ul className="mt-6 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b.text} className="flex items-center gap-3 font-body text-sm text-mist/70">
                <b.icon className="h-4 w-4 shrink-0 text-cyan-400" /> {b.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative font-mono text-xs text-mist/30">{appConfig.description}</p>
      </div>

      <div className="flex items-center justify-center bg-mist px-4 py-16 dark:bg-midnight-300">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <h1 className="font-display text-2xl font-bold text-midnight-400 dark:text-mist">Welcome back</h1>
          <p className="mt-1.5 font-body text-sm text-midnight-400/60 dark:text-mist/60">
            Sign in to see personalised alerts for your location.
          </p>

          {error && (
            <div role="alert" className="mt-5 rounded-lg border border-danger-400/30 bg-danger-50 px-4 py-2.5 font-body text-sm text-danger-500 dark:bg-danger-400/10">
              {error}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? "Signing in" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-midnight-400/60 dark:text-mist/60">
            No account?{" "}
            <Link to="/register" className="font-medium text-cyan-500 hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
