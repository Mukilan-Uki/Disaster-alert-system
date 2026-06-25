import { WifiOff } from "lucide-react";
import { Button } from "../../components/ui";

export default function Offline() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-mist px-4 text-center dark:bg-midnight-400">
      <span className="font-mono text-sm uppercase tracking-widest text-signal-500">No connection</span>
      <WifiOff className="my-6 h-12 w-12 text-midnight-400/30 dark:text-mist/30" />
      <h1 className="font-display text-2xl font-bold text-midnight-400 dark:text-mist">You're offline.</h1>
      <p className="mt-2 max-w-sm font-body text-sm text-midnight-400/60 dark:text-mist/60">
        We can't reach our servers right now. Alerts already delivered to this device remain visible.
      </p>
      <Button onClick={() => window.location.reload()} className="mt-6">Try again</Button>
    </div>
  );
}
