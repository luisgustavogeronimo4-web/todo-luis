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
import { Star } from "lucide-react";

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

      <main className="flex min-h-screen items-center justify-center bg-pattern p-4">
        <div className="flex flex-col items-center justify-center min-h-screen w-full mx-auto max-w-md md:max-w-xl p-4">
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
                className="w-full sm:w-auto border-4 border-black text-black font-black hover:bg-white hover:text-red-600 -rotate-2"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;