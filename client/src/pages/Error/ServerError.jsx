import { Link } from "react-router-dom";
import { ServerCrash } from "lucide-react";
import { Button } from "../../components/ui";

export default function ServerError() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-mist px-4 text-center dark:bg-midnight-400">
      <span className="font-mono text-sm uppercase tracking-widest text-danger-400">Error 500</span>
      <ServerCrash className="my-6 h-12 w-12 text-midnight-400/30 dark:text-mist/30" />
      <h1 className="font-display text-2xl font-bold text-midnight-400 dark:text-mist">
        Something broke on our end.
      </h1>
      <p className="mt-2 max-w-sm font-body text-sm text-midnight-400/60 dark:text-mist/60">
        Our team has been notified. Your alert preferences are safe — try refreshing in a moment.
      </p>
      <Button as={Link} to="/" className="mt-6">Back to home</Button>
    </div>
  );
}
