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
    <div className="min-h-screen bg-white">
      {/* Decorative stars and shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Star className="absolute top-4 left-4 w-8 h-8 fill-current text-black opacity-20 rotate-12" />
        <Star className="absolute top-1/3 right-8 w-6 h-6 fill-current text-black opacity-20 -rotate-45" />
        <Star className="absolute bottom-12 left-1/4 w-10 h-10 fill-current text-black opacity-20 rotate-6" />
        <Star className="absolute bottom-4 right-4 w-5 h-5 fill-current text-black opacity-20 -rotate-12" />
        <Star className="absolute top-1/2 left-1/2 w-12 h-12 fill-current text-black opacity-20 rotate-45" />
        {/* Additional geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-red-500 opacity-30 -rotate-30 transform" />
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-red-500 opacity-30 -rotate-15 transform" />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md bg-white border-4 border-black -rotate-1 shadow-md p-6">
          {/* Chaotic title */}
          <div className="mb-6 text-center">
            <span className="block text-3xl font-bold text-red-600 -rotate-1">T</span>
            <span className="block text-2xl font-light text-white -rotate-2">O</span>
            <span className="block text-xl font-bold text-red-600 -rotate-1">D</span>
            <span className="block text-3xl font-bold text-white -rotate-2">O</span>
            <span className="block text-2xl font-light text-red-600 -rotate-1">L</span>
            <span className="block text-xs font-bold text-white -rotate-2">U</span>
            <span className="block text-lg font-bold text-red-600 -rotate-1">I</span>
            <span className="block text-2xl font-light text-white -rotate-2">S</span>
          </div>

          {/* Tabs */}
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-red-600 -rotate-1">
              <TabsTrigger
                value="login"
                onValueChange={() => setActiveTab("login")}
                className="px-4 py-2 text-sm font-medium text-white bg-red-800 hover:bg-red-900 transition-colors"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                onValueChange={() => setActiveTab("register")}
                className="px-4 py-2 text-sm font-medium text-white bg-red-800 hover:bg-red-900 transition-colors"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 p-4 bg-white">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full bg-zinc-800 border-2 border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0 -rotate-1"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-zinc-800 border-2 border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0 -rotate-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-red-600 hover:bg-red-800 text-white font-bold -rotate-1 transition-colors"
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 p-4 bg-white">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full bg-zinc-800 border-2 border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0 -rotate-1"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-zinc-800 border-2 border-red-600 text-white placeholder-white/50 focus:border-red-400 focus:ring-0 -rotate-1"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-red-600 hover:bg-red-800 text-white font-bold -rotate-1 transition-colors"
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