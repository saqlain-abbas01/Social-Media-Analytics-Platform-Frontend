import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BarChart3, FileText, TrendingUp, Menu, Home } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { LogOut } from "@/api/userService";
import toast from "react-hot-toast";

export function NavigationHeader() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: LogOut,
    mutationKey: ["logout"],
    onSuccess: () => {
      toast.success("Logout sucessfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Error while logging out");
    },
  });

  const navItems = [
    { label: "Dashboard", href: "/", icon: Home },
    { label: "Posts", href: "/posts", icon: FileText },
    { label: "Analytics", href: "/analytics", icon: TrendingUp },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <header className="border-b border-border bg-background sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">
            SocialMetrics
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div>
          <Button variant="ghost" className="ml-2" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
