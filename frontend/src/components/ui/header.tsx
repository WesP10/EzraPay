import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet } from "lucide-react";

type HeaderProps = {
  name: string;
  photo: string | null;
  onLogout: () => void;
  onWalletClick?: () => void;
};

export function Header({ name, photo, onLogout, onWalletClick }: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-cornell-red via-cornell-red to-cornell-dark-red rounded-b-2xl px-6 py-6 text-white shadow-2xl relative overflow-hidden">
      <div className="relative z-10">
        {/* Modern card-based layout */}
        <div className="backdrop-blur-sm rounded-xl p-4">
          {/* Top row - Welcome message and sign out */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-semibold text-lg">Welcome Back, Big Red! 🐻</div>
              <div className="text-sm text-white/80">Cornell University Student</div>
            </div>
            <Button
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium transition-all duration-200 text-sm px-3 py-1.5 rounded-lg shadow-md"
              type="button"
              onClick={onLogout}
            >
              Sign Out
            </Button>
          </div>

          {/* Profile section with modern card design */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-white/20 rounded-full p-1 backdrop-blur-sm border border-white/30 shadow-lg">
                  <Avatar className="w-14 h-14 overflow-hidden">
                    {photo ? (
                      <img
                        src={`http://localhost:3000/photo/${photo}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarFallback className="flex items-center justify-center w-full h-full bg-white/30 text-white text-base font-semibold backdrop-blur-sm">
                        {name.split(" ").map((n) => n[0]).join("").toUpperCase() || "?"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div>
                <div className="text-xl font-bold tracking-wide">{name}</div>
                <div className="text-sm text-white/70">Online now</div>
              </div>
            </div>

            <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium shadow-lg transition-all duration-200 rounded-lg py-2 px-4 text-sm"
              onClick={onWalletClick}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
