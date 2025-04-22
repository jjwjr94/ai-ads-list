
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Database, Layers, ShieldCheck, HelpCircle } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface MobileNavMenuProps {
  session: Session | null;
  onLogout: () => void;
}

export default function MobileNavMenu({ session, onLogout }: MobileNavMenuProps) {
  return (
    <nav className="flex flex-col gap-1 p-4">
      {/* Auth button */}
      <div className="mb-2">
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
      </div>
      {/* Main nav links */}
      <Link to="/" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start gap-2"
        >
          <Home className="h-5 w-5 mr-2" /> Home
        </Button>
      </Link>
      <Link to="/database" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start gap-2"
        >
          <Database className="h-5 w-5 mr-2" /> Database
        </Button>
      </Link>
      <Link to="/explore" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start gap-2"
        >
          <Layers className="h-5 w-5 mr-2" /> Categories
        </Button>
      </Link>
      <Link to="/feedback" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start gap-2"
        >
          <HelpCircle className="h-5 w-5 mr-2" /> Feedback
        </Button>
      </Link>
    </nav>
  );
}
