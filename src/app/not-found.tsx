import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="w-full max-w-md p-6 border rounded-lg bg-card text-card-foreground shadow-sm">
        <p className="text-center mb-4">
          Let's get you back on track.
        </p>
        <Link href="/" className="block">
          <Button className="w-full flex items-center justify-center gap-2">
            <HomeIcon className="size-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}