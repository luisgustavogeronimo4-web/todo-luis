import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border-4 border-black -rotate-1 shadow-[6px_6px_0px_0px_rgba(211,18,18,1)] p-8 text-center">
        {/* Star accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 opacity-10">
            <Star className="h-6 w-6 text-red-600" />
          </div>
          <div className="absolute bottom-2 right-2 opacity-10">
            <Star className="h-6 w-6 text-red-600" />
          </div>
          <div className="absolute top-2 right-2 opacity-10">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div className="absolute bottom-2 left-2 opacity-10">
            <Star className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-6xl font-black mb-4">
            <span className="block text-red-600 -rotate-2">4</span>
            <span className="block text-white rotate-1">0</span>
            <span className="block text-red-600 -rotate-2">4</span>
          </h1>
          <p className="text-xl text-white/80 mb-6 -rotate-1">Oops! Page not found</p>
          <p className="text-sm text-white/50 mb-6">The page you're looking for doesn't exist or has been moved.</p>
          <Link to="/">
            <Button className="bg-red-600 hover:bg-red-800 text-white font-bold -rotate-1 transition-colors">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;