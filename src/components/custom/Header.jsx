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

  // ✅ Google Login
  const Login = useGoogleLogin({
    onSuccess: (response) => {
      GetUserProfile(response);
    },
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo?.access_token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        window.location.reload(); // ✅ refresh to show logged-in state
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ✅ logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/"; // instant redirect
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center px-5">
      {/* Logo */}
      <img src="/logo1.svg" alt="Logo" className="w-[150px]" />

      {/* Right Side */}
      <div className="flex items-center">
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
            <Button variant="outline" className="rounded-full">
              Create Trip +
            </Button></a>
            <a href="/my-trip">
            
            <Button variant="outline" className="rounded-full">
              My Trips
            </Button></a>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src={user?.picture}
                  alt="profile"
                  className="w-12 h-12 rounded-full border cursor-pointer"
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
            <Button onClick={() => setOpenDialog(true)} className="bg-blue-600 text-white">
              Sign In
            </Button>

            {/* Signin Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Signin with Google</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col items-center text-center">
                      <img src="/logo1.svg" alt="logo" className="mb-3" />

                      <h2 className="font-bold text-lg">Signin with Google</h2>
                      <p className="text-gray-600">Signin with Google authentication securely</p>

                      <Button
                        onClick={Login}
                        className="w-full mt-5 bg-black text-white flex gap-5 items-center"
                      >
                        <FcGoogle className="h-7 w-7" />
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
