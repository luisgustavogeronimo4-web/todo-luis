import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
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

      <main className="min-h-screen bg-pattern flex items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center min-h-screen w-full mx-auto max-w-md md:max-w-xl p-4">
          <div className="w-full max-w-md bg-zinc-900 border-4 border-black -rotate-1 shadow-[6px_6px_0px_0px_rgba(211,18,18,1)] p-6">
            {/* Chaotic title */}
            <div className="mb-6 text-center">
              <span className="block text-3xl font-black text-red-600 -rotate-1">P</span>
              <span className="block text-2xl font-light text-white -rotate-2">R</span>
              <span className="block text-xl font-bold text-red-600 -rotate-1">O</span>
              <span className="block text-3xl font-black text-white -rotate-2">F</span>
              <span className="block text-2xl font-light text-red-600 -rotate-1">I</span>
              <span className="block text-xs font-bold text-white -rotate-2">L</span>
              <span className="block text-lg font-black text-red-600 -rotate-1">E</span>
            </div>

            <div className="relative z-10 space-y-6">
              <Card className="bg-white border-red-600 -rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-2xl text-red-600 -rotate-1">User Profile</CardTitle>
                  <CardDescription className="text-red-600 -rotate-2">
                    Your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-red-600 flex items-center justify-center rounded-full -rotate-1">
                          <Star className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-red-600">{user.email}</p>
                          <p className="text-sm text-gray-600">User ID: {user.id}</p>
                        </div>
                      </div>
                      <div className="border-t border-red-200 pt-4">
                        <p className="text-sm text-gray-600">
                          Account created: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-red-600">Loading user data...</p>
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={handleLogout}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-800 text-white font-black -rotate-1 transition-colors"
              >
                {loading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;