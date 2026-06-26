import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-pattern p-4">
        <Card className="w-full max-w-lg -rotate-2 bg-gradient-to-br from-red-600 to-red-800 border-4 border-black shadow-[6px_6px_0px_0px_rgba(211,18,18,1)]">
          <CardHeader>
            <CardTitle className="text-4xl font-black text-white tracking-widest -rotate-1">
              Bem‑vindo
            </CardTitle>
            <CardDescription className="text-white -rotate-2">
              Você está autenticado como {user?.email}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/80">
              Área inicial protegida do sistema.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Link to="/tasks">
              <Button className="w-full bg-red-700 hover:bg-red-900 text-white -rotate-1">
                Ir para tarefas
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-red-600 -rotate-2"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default Home;