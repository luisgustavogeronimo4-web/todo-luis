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
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left panel – identidade visual */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-slate-900 to-blue-950 text-center p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-5xl font-extrabold text-white">DL</span>
          <Star className="h-8 w-8 text-blue-400 fill-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">TO DO DO Luís</h1>
        <p className="text-lg text-zinc-200">
          Organize suas tarefas, domine sua rotina e alcance o pico da sua produtividade.
        </p>
      </div>

      {/* Right panel – formulário */}
      <div className="flex items-center justify-center bg-zinc-950 p-8">
        <div className="w-full max-w-md space-y-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 gap-2 bg-zinc-800 rounded-full p-1">
              <TabsTrigger
                value="login"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-colors"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-colors"
              >
                Criar Conta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && tab === "login" && (
                  <p className="rounded-md bg-destructive/10 p-2 text-destructive">{error}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">E‑mail</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-800 border-zinc-700 focus:border-blue-500 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-zinc-800 border-zinc-700 focus:border-blue-500 rounded-md"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  {loading ? "Aguarde..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && tab === "signup" && (
                  <p className="rounded-md bg-destructive/10 p-2 text-destructive">{error}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">E‑mail</label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-zinc-800 border-zinc-700 focus:border-blue-500 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Senha</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-zinc-800 border-zinc-700 focus:border-blue-5
                    00 rounded-md"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  {loading ? "Aguarde..." : "Criar Conta"}
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