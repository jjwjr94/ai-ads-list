
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, HelpCircle, ChevronDown } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface CategoryLink {
  title: string;
  path: string;
}

interface MobileNavMenuProps {
  session: Session | null;
  onLogout: () => void;
  categoryLinks: CategoryLink[];
}

export default function MobileNavMenu({ session, onLogout, categoryLinks }: MobileNavMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // Auto-close submenu when navigating
  useEffect(() => {
    setCategoriesOpen(false);
  }, [location.pathname]);

  return (
    <nav className="flex flex-col gap-1 p-4 h-full overflow-y-auto">
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
      <Link to="/" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start gap-2"
        >
          Home
        </Button>
      </Link>
      <Link to="/database" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center justify-start gap-2"
        >
          Database
        </Button>
      </Link>
      
      {/* Categories dropdown */}
      <DropdownMenu open={categoriesOpen} onOpenChange={setCategoriesOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-between gap-2"
            aria-expanded={categoriesOpen}
          >
            Categories
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[9999] mt-1 bg-white w-[95%] max-h-[60vh] overflow-y-auto border shadow-lg">
          {categoryLinks.map((item) => (
            <DropdownMenuItem
              key={item.path}
              className="cursor-pointer font-normal"
              onClick={() => {
                navigate(item.path);
                setCategoriesOpen(false);
              }}
            >
              {item.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

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
