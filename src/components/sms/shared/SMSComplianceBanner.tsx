import { Shield, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SMSComplianceBannerProps {
  variant?: "default" | "warning";
}

export function SMSComplianceBanner({ variant = "default" }: SMSComplianceBannerProps) {
  return (
    <Alert className={variant === "warning" ? "border-yellow-500/50 bg-yellow-500/10" : ""}>
      <Shield className={`h-4 w-4 ${variant === "warning" ? "text-yellow-500" : ""}`} />
      <AlertDescription className="flex items-center justify-between">
        <span>
          Only contacts with valid consent will be messaged. Quiet hours + frequency caps apply.
        </span>
        <Button variant="link" size="sm" className="gap-1 h-auto p-0">
          Review Compliance Center
          <ExternalLink className="h-3 w-3" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
