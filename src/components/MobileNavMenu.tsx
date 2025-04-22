
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, HelpCircle } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface MobileNavMenuProps {
  session: Session | null;
  onLogout: () => void;
}

export default function MobileNavMenu({ session, onLogout }: MobileNavMenuProps) {
  return (
    <nav className="flex flex-col gap-2 p-4">
      {session ? (
        <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onLogout}>
          Logout
        </Button>
      ) : (
        <Link to="/auth" className="w-full">
          <Button variant="ghost" size="sm" className="w-full flex items-center justify-start gap-2">
            <ShieldCheck className="h-5 w-5 mr-2" /> Login
          </Button>
        </Link>
      )}
      <Link to="/feedback" className="w-full">
        <Button variant="ghost" size="sm" className="w-full flex items-center justify-start gap-2">
          <HelpCircle className="h-5 w-5 mr-2" /> Feedback
        </Button>
      </Link>
    </nav>
  );
}
