"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { StickyNote, LogOut, User, LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <StickyNote className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              NoteBook
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-20 h-8 bg-gray-800 animate-pulse rounded"></div>
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    pathname === "/dashboard"
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link
                  href="/profile"
                  className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    pathname === "/profile"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                  }`}
                >
                  <User size={18} />
                  <span className="max-w-[150px] truncate">{user.name}</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    pathname === "/login"
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <LogIn size={18} />
                  <span className="hidden sm:inline">Login</span>
                </Link>

                <Link
                  href="/signup"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    pathname === "/signup"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
