import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Darkmode from "@/Darkmode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">LearnX</h1>
          </Link>
        </div>

        <div className="flex items-center gap-8">
  {user && (
    <Link to="/discussion">
      <Button variant="outline:default">Discussion</Button>
    </Link>
  )}

  {user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage
            src={user?.photoUrl || "https://github.com/shadcn.png"}
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/my-learning">My Classes</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logoutHandler}>LogOut</DropdownMenuItem>
        </DropdownMenuGroup>
        {user?.role === "instructor" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/teacher/dashboard">Dashboard</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center gap-2 justify-center">
      <Button variant="outline" onClick={() => navigate("/login")}>
        Login
      </Button>
      <Button onClick={() => navigate("/login")}>Signup</Button>
    </div>
  )}

  <Darkmode />
</div>

      </div>

      {/* Mobile Device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl">LearnX</h1>
        {user && <MobileNavbar user={user} />}
      </div>
    </div>
  );
};

export default Navbar;

// ----------------------
// MobileNavbar Component
// ----------------------

const MobileNavbar = ({ user }) => {
  const role = user?.role;
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between">
        <div>
          <SheetHeader className="flex flex-row items-center justify-between mt-2">
            <SheetTitle>LearnX</SheetTitle>
            <Darkmode />
          </SheetHeader>
          <Separator className="mr-2 my-4" />
          <nav className="flex flex-col space-y-4">
            <Link to="/profile">Profile</Link>
            <Link to="/my-learning">My Classes</Link>
            <Link to="/discussion">Discussion</Link>
          </nav>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={logoutHandler}
          >
            LogOut
          </Button>

          {role === "instructor" && (
            <SheetFooter>
              <SheetClose asChild>
                <Button className="w-full" type="submit">
                  Dashboard
                </Button>
              </SheetClose>
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
