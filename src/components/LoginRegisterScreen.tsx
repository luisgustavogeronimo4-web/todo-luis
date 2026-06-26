import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";

export const LoginRegisterScreen = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      alert(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      alert(err.message ?? "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border-4 border-black -rotate-1 shadow-[6px_6px_0px_0px_rgba(211,18,18,1)] p-6">
        {/* Chaotic title with mixed sizes and rotations */}
        <div className="mb-6 text-center">
          <span className="block text-3xl font-black text-red-600 -rotate-1">T</span>
          <span className="block text-2xl font-light text-white -rotate-2">O</span>
          <span className="block text-xl font-bold text-red-600 -rotate-1">D</span>
          <span className="block text-3xl font-black text-white -rotate-2">O</span>
          <span className="block text-2xl font-light text-red-600 -rotate-1">L</span>
          <span className="block text-xs font-bold text-white -rotate-2">U</span>
          <span className="block text-lg font-black text-red-600 -rotate-1">I</span>
          <span className="block text-2xl font-light text-white -rotate-2">S</span>
        </div>

        {/* Star background accents */}
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

        <div className="relative z-10 space-y-4">
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-red-600 -rotate-1">
              <TabsTrigger
                value="login"
                onValueChange={setActiveTab}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "login"
                    ? "text-white bg-red-800"
                    : "text-white/50 hover:text-white"
                } transition-colors`}
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                onValueChange={setActiveTab}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "register"
                    ? "text-white bg-red-800"
                    : "text-white/50 hover:text-white"
                } transition-colors`}
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 p-4 bg-zinc-900">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-red-600 mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full bg-zinc-800 border border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-red-600 mb-1">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-zinc-800 border border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-red-600 hover:bg-red-800 text-white font-bold -rotate-1 transition-colors ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 p-4 bg-zinc-900">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-red-600 mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full bg-zinc-800 border border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-red-600 mb-1">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-zinc-800 border border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-red-600 hover:bg-red-800 text-white font-bold -rotate-1 transition-colors ${
                    loading ? "opacity-50" : ""
                  }`}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterScreen;