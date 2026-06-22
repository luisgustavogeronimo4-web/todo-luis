import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export const Auth = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // success / info messages

  // shared form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/tasks", { replace: true });
    } catch (err: any) {
      // Supabase returns a 400 for wrong credentials
      const msg = err?.message?.toLowerCase?.() ?? "";
      if (msg.includes("invalid") || msg.includes("incorrect")) {
        setError("E‑mail ou senha inválidos. Se ainda não tem conta, use a aba de Cadastro.");
      } else {
        setError(err.message ?? "Falha ao entrar");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await signup(email, password);
      // Sign‑up succeeded – Supabase usually sends a confirmation e‑mail
      setInfo("Cadastro realizado! Verifique seu e‑mail para confirmar a conta antes de fazer o login.");
      // Optionally, you could auto‑login after confirmation, but we keep the flow simple.
    } catch (err: any) {
      const msg = err?.message?.toLowerCase?.() ?? "";
      if (msg.includes("already")) {
        setError("Este e‑mail já está cadastrado. Tente fazer login ou recupere a senha.");
      } else {
        setError(err.message ?? "Falha ao cadastrar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Gerenciador de Tarefas</CardTitle>
          <CardDescription className="text-center">
            Acesse sua conta ou crie uma nova.
          </CardDescription>
        </CardHeader>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>

          {/* ---------- Sign In ---------- */}
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                {error && (
                  <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}
                {info && (
                  <p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
                    {info}
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          {/* ---------- Sign Up ---------- */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                {error && (
                  <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}
                {info && (
                  <p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
                    {info}
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="usuario@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Senha</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Cadastrar"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </main>
  );
};

export default Auth;