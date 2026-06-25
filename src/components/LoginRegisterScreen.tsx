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
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="w-full max-w-md mx-auto space-y-6 bg-amber-100 border-2 border-zinc-900 p-6">
        {/* Header com ícone retro */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-4xl font-bold text-zinc-900">DL</span>
          <Star className="h-6 w-6 text-zinc-900 fill-zinc-900" />
        </div>
        <h1 className="text-center text-2xl font-extrabold text-zinc-900 mb-2">
          TO DO DO Luís
        </h1>
        <p className="text-center text-sm text-zinc-800 mb-6">
          Organize suas tarefas, domine sua rotina e alcance o pico da sua produtividade.
        </p>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2 gap-2 bg-amber-200 border-2 border-zinc-900 rounded-md p-1">
            <TabsTrigger
              value="login"
              className="rounded-md data-[state=active]:bg-amber-400 data-[state=active]:text-zinc-900 transition-colors"
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-md data-[state=active]:bg-amber-400 data-[state=active]:text-zinc-900 transition-colors"
            >
              Criar Conta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && tab === "login" && (
                <p className="rounded-md bg-red-200 text-red-800 p-2">{error}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-zinc-800 mb-1">
                  E‑mail
                </label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-amber-200 border-2 border-zinc-900 focus:border-zinc-900 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-800 mb-1">
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-amber-200 border-2 border-zinc-900 focus:border-zinc-900 rounded-md"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-300 border-2 border-zinc-900 text-zinc-900 hover:bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {loading ? "Aguarde..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && tab === "signup" && (
                <p className="rounded-md bg-red-200 text-red-800 p-2">{error}</p>
              )}
              <div>
                <label className="block text-sm font-medium text-zinc-800 mb-1">
                  E‑mail
                </label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-amber-200 border-2 border-zinc-900 focus:border-zinc-900 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-800 mb-1">
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-amber-200 border-2 border-zinc-900 focus:border-zinc-900 rounded-md"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-300 border-2 border-zinc-900 text-zinc-900 hover:bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {loading ? "Aguarde..." : "Criar Conta"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginRegisterScreen;