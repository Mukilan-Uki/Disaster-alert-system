import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "../../components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-mist px-4 text-center dark:bg-midnight-400">
      <span className="font-mono text-sm uppercase tracking-widest text-cyan-400">Error 404</span>
      <Compass className="my-6 h-12 w-12 text-midnight-400/30 dark:text-mist/30" />
      <h1 className="font-display text-2xl font-bold text-midnight-400 dark:text-mist">
        This page drifted off the map.
      </h1>
      <p className="mt-2 max-w-sm font-body text-sm text-midnight-400/60 dark:text-mist/60">
        The page you're looking for doesn't exist or may have moved. Let's get you back to safety.
      </p>
      <Button as={Link} to="/" className="mt-6">Back to home</Button>
    </div>
  );
}
