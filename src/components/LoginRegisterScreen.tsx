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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 bg-gray-800 border border-gray-700 rounded-lg p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-4xl font-bold text-white">DL</span>
          <Star className="h-6 w-6 text-white fill-white" />
        </div>
        <h1 className="text-center text-2xl font-extrabold text-white mb-2">
          Gerenciador de Tarefas
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Acesse sua conta ou crie uma nova.
        </p>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
          <TabsList className="grid w-full grid-cols-2 gap-2 bg-gray-700 rounded-md p-1">
            <TabsTrigger
              value="login"
              className="rounded-md data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-colors"
            >
              Entrar
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-md data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-colors"
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
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-gray-700 border-gray-600 focus:border-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-gray-700 border-gray-600 focus:border-gray-500"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white"
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
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="usuario@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-gray-700 border-gray-600 focus:border-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Senha
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-gray-700 border-gray-600 focus:border-gray-500"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-600 hover:bg-gray-500 text-white"
              >
                {loading ? "Aguarde..." : "Cadastrar"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginRegisterScreen;