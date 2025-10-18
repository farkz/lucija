import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function AdminLogin() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-light" style={{ fontFamily: 'var(--font-serif)' }}>
            Admin Login
          </CardTitle>
          <CardDescription>
            Sign in with your Replit account to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleLogin} 
            className="w-full"
            data-testid="button-login"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Replit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
