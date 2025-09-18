import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Home } from "lucide-react";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken: string = (location.state as any)?.message || "67889jara";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accessToken);
      toast.success("Access code copied");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = accessToken;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success("Access code copied");
    }
  };

  return (
    <div className="min-h-[60vh] grid place-items-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Movie Rental Successful!</h1>
          <p className="text-white/80 mb-4">
            Your movie rental is confirmed! Use this access code to watch:
          </p>
          <div className="bg-white/5 p-4 rounded mb-6">
            <div className="flex items-center justify-center gap-3">
              <code className="bg-black/40 px-4 py-2 rounded border border-white/10 font-mono text-lg font-bold">
                {accessToken}
              </code>
              <Button onClick={handleCopy} variant="outline" size="sm">
                <Copy className="w-4 h-4" /> Copy
              </Button>
            </div>
          </div>
          <Button onClick={() => navigate("/")} className="w-full">
            <Home className="w-4 h-4 mr-2" /> Return Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
