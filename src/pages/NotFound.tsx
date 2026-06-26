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
      {/* Halftone background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none z-0" />
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Star className="absolute top-4 left-4 w-8 h-8 fill-current text-white opacity-20 rotate-12" />
        <Star className="absolute top-1/3 right-8 w-6 h-6 fill-current text-white opacity-20 -rotate-45" />
        <Star className="absolute bottom-12 left-1/4 w-10 h-10 fill-current text-white opacity-20 rotate-6" />
        <Star className="absolute bottom-4 right-4 w-5 h-5 fill-current text-white opacity-20 -rotate-12" />
        <Star className="absolute top-1/2 left-1/2 w-12 h-12 fill-current text-white opacity-20 rotate-45" />
      </div>

      <div className="w-full max-w-md bg-zinc-900 border-4 border-black -rotate-1 shadow-[6px_6px_0px_0px_rgba(211,18,18,1)] p-8 text-center relative z-10">
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
  );
};

export default NotFound;