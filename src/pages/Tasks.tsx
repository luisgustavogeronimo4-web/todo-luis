import { Link, useNavigate } from "react-router-dom";
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

export const Tasks = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Tarefas</CardTitle>
          <CardDescription>
            Estrutura inicial da área de tarefas.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A criação, listagem, edição, conclusão e exclusão de tarefas serão
            implementadas na próxima fase.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full" variant="outline">
              Voltar ao início
            </Button>
          </Link>

          <Button
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Tasks;