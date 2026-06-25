import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Star } from "lucide-react";

const LoginRegisterScreen = () => {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState("login");

  const handleTabChange = (value) => {
    setTab(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="max-w-md w-full space-y-8">
        <Tabs defaultValue={tab} onChange={handleTabChange}>
          <TabsList className="grid grid-cols-2 gap-4">
            <TabsTrigger value="login">
              <Star className="h-6 w-6 text-zinc-500" />
              Login
            </TabsTrigger>
            <TabsTrigger value="signup">
              <Star className="h-6 w-6 text-zinc-500" />
              Cadastrar
            </TabsTrigger>
          </TabsList>

          <TabsContent>
            {/* Login Tab */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Entrar</h2>
              <form className="space-y-4">
                <div>
                  <Input 
                    placeholder="E-mail"
                    type="email"
                    required
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Senha"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </form>
            </div>

            {/* Signup Tab */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Cadastrar</h2>
              <form className="space-y-4">
                <div>
                  <Input 
                    placeholder="E-mail"
                    type="email"
                    required
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Senha"
                    type="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Cadastrar
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LoginRegisterScreen;