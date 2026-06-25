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
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
      {/* Main container with thick red border and hard shadow */}
      <div className="relative w-full max-w-md bg-white border-4 border-red-600 shadow-[6px_6px_0px_0px_rgba(211,18,18,1)] rotate-2 skew-x-3">
        {/* Decorative overlay for extra geometric cut‑out */}
        <div className="absolute inset-0 pointer-events-none border-4 border-red-600 -rotate-3 skew-y-3" />
        <div className="relative p-8 space-y-6">
          {/* Header with stylized title */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-4xl font-black text-red-600">DL</span>
            <Star className="h-6 w-6 text-red-600 fill-red-600" />
          </div>
          <h1 className="text-center text-3xl font-black tracking-tighter uppercase text-red-600">
            Gerenciador de Tarefas
          </h1>
          <p className="text-center text-red-800/80">
            Acesse sua conta ou crie uma nova.
          </p>

          {/* Diagonal ribbon‑style tabs */}
          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 gap-2 bg-white border-4 border-red-600 -rotate-2">
              <TabsTrigger
                value="login"
                className="bg-white text-red-600 border-4 border-red-600 rotate-1 hover:bg-red-600 hover:text-white"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="bg-white text-red-600 border-4 border-red-600 -rotate-1 hover:bg-red-600 hover:text-white"
              >
                Cadastrar
              </TabsTrigger>
            </TabsList>

            {/* Login form */}
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {error && tab === "login" && (
                  <p className="rounded-md bg-red-900 text-red-200 p-2">{error}</p>
                )}
                <div>
                  <label className="block text-sm font-black text-red-600 tracking-wider uppercase">
                    EmAiL
                  </label>
                  <Input
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-white text-black border-4 border-red-600 -rotate-1 focus:border-red-600 focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-red-600 tracking-wider uppercase">
                    sEnHa
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-white text-black border-4 border-red-600 rotate-1 focus:border-red-600 focus:ring-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white border-4 border-red-800 rotate-2 hover:bg-red-700 transition-all"
                >
                  {loading ? "Aguarde..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>

            {/* Signup form */}
            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {error && tab === "signup" && (
                  <p className="rounded-md bg-red-900 text-red-200 p-2">{error}</p>
                )}
                <div>
                  <label className="block text-sm font-black text-red-600 tracking-wider uppercase">
                    EmAiL
                  </label>
                  <Input
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-white text-black border-4 border-red-600 rotate-2 focus:border-red-600 focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-red-600 tracking-wider uppercase">
                    sEnHa
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="bg-white text-black border-4 border-red-600 -rotate-2 focus:border-red-600 focus:ring-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white border-4 border-red-800 rotate-2 hover:bg-red-700 transition-all"
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