import { TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";

export const Disconnected = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <TriangleAlert
            className="h-12 w-12 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Bad Gateway</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Sorry, something went wrong!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            Go back
          </Button>
        </div>
      </div>
    </>
  );
};
