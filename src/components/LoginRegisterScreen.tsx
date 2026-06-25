import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";

const LoginRegisterScreen = () => {
  const { login, signup: register } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: any) {
      setError(err?.message ?? "Falha ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d31212] p-4">
      <div className="relative w-full max-w-md bg-black border-4 border-black rotate-2 skew-x-6">
        {/* decorative cut‑out overlay */}
        <div className="absolute inset-0 pointer-events-none border-4 border-black -rotate-3 skew-y-3" />
        <div className="relative p-8 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl font-black text-white">DL</span>
            <Star className="h-6 w-6 text-white fill-white" />
          </div>
          <h1 className="text-center text-3xl font-black tracking-tighter text-white uppercase">
            Gerenciador de Tarefas
          </h1>
          <p className="text-center text-white/80">
            Acesse sua conta ou crie uma nova.
          </p>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 gap-2 bg-black border-4 border-white -rotate-2">
              <TabsTrigger
                value="login"
                className="bg-white text-black border-4 border-black rotate-1 hover:bg-white/80"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="bg-white text-black border-4 border-black -rotate-1 hover:bg-white/80"
              >
                Cadastrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {error && tab === "login" && (
                  <p className="rounded-md bg-red-900 text-red-200 p-2">{error}</p>
                )}
                <div>
                  <label className="block text-sm font-black text-white tracking-wider uppercase">
                    EmAiL
                  </label>
                  <Input
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-black text-white border-4 border-black -rotate-1 focus:border-white focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-white tracking-wider uppercase">
                    sEnHa
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-black text-white border-4 border-black rotate-1 focus:border-white focus:ring-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black border-4 border-black -rotate-2 hover:bg-white hover:text-black hover:translate-x-1 hover:translate-y-1 transition-all duration-100 ease-in-out"
                >
                  {loading ? "Aguarde..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {error && tab === "signup" && (
                  <p className="rounded-md bg-red-900 text-red-200 p-2">{error}</p>
                )}
                <div>
                  <label className="block text-sm font-black text-white tracking-wider uppercase">
                    EmAiL
                  </label>
                  <Input
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-black text-white border-4 border-black rotate-2 focus:border-white focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-white tracking-wider uppercase">
                    sEnHa
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-black text-white border-4 border-black -rotate-2 focus:border-white focus:ring-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black border-4 border-black rotate-2 hover:bg-white hover:text-black hover:translate-x-1 hover:translate-y-1 transition-all duration-100 ease-in-out"
                >
                  {loading ? "Aguarde..." : "Cadastrar"}
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