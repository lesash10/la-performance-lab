import { Link } from "react-router-dom";
import { LayoutDashboard, LogOut, UserRound } from "lucide-react";

import { homePathForRole, useAuth } from "@/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  profileDisplayName,
  profileInitials,
  useAvatarUrl,
} from "@/lib/profile-display";
import { cn } from "@/lib/utils";

type UserAccountMenuProps = {
  className?: string;
  align?: "start" | "center" | "end";
};

export function UserAccountMenu({ className, align = "end" }: UserAccountMenuProps) {
  const { user, profile, signOut } = useAuth();
  const avatarUrl = useAvatarUrl(profile?.avatar_storage_path);
  const initials = profileInitials(profile, user?.email);
  const label = profileDisplayName(profile, user?.email);
  const dashboardPath = homePathForRole(profile?.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "h-10 w-10 rounded-full p-0 ring-offset-background hover:bg-surface/80 focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
          aria-label={`Account menu for ${label}`}
        >
          <Avatar className="size-9 border border-border/70">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-flame/15 font-display text-xs font-semibold text-flame">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="min-w-[11rem] border-border/70 bg-popover/95 backdrop-blur-xl"
      >
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/profile">
            <UserRound className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to={dashboardPath}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => {
            void signOut();
          }}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
