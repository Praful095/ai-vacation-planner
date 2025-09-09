import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  // Google Login
  const Login = useGoogleLogin({
    onSuccess: (response) => {
      GetUserProfile(response);
    },
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="p-3 shadow-sm flex flex-wrap md:flex-nowrap justify-between items-center px-5 gap-3">
      {/* Logo */}
      <img
        src="/logo1.svg"
        alt="Logo"
        className="w-32 md:w-36 lg:w-40 object-contain"
      />

      {/* Right Side */}
      <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
        {user ? (
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
            <a href="/create-trip" className="w-full md:w-auto">
              <Button variant="outline" className="rounded-full w-full md:w-auto">
                Create Trip +
              </Button>
            </a>
            <a href="/my-trip" className="w-full md:w-auto">
              <Button variant="outline" className="rounded-full w-full md:w-auto">
                My Trips
              </Button>
            </a>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src={user?.picture}
                  alt="profile"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <>
            {/* Signin Button */}
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-blue-600 text-white w-full sm:w-auto"
            >
              Sign In
            </Button>

            {/* Signin Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Signin with Google</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col items-center text-center">
                      <img src="/logo1.svg" alt="logo" className="mb-3 w-20" />
                      <h2 className="font-bold text-lg sm:text-xl">
                        Signin with Google
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Signin with Google authentication securely
                      </p>

                      <Button
                        onClick={Login}
                        className="w-full mt-5 bg-black text-white flex gap-5 items-center justify-center"
                      >
                        <FcGoogle className="h-6 w-6 sm:h-7 sm:w-7" />
                        Signin with Google
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
