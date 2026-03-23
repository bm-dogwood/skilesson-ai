"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: "student" | "instructor";

  // optional profile fields
  level?: string | null;
  sport?: string | null;

  // billing
  isSubscribed?: boolean;

  // trial
  trialEnd?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // auth actions
  login: (email: string, password: string) => Promise<void>;
  loginInstructor: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;

  // role helpers
  isInstructor: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const isLoading = status === "loading";

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: (session as any).userId, // ✅ IMPORTANT
        email: session.user.email,
        name: session.user.name,
        role: (session.user as any).role, // ✅ IMPORTANT
      });
    } else {
      setUser(null);
    }
  }, [session]);

  // 🧑‍🎓 Student login
  const login = async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      throw new Error("Invalid credentials");
    }
  };

  // 🧑‍🏫 Instructor login (separate flow)
  const loginInstructor = async (email: string, password: string) => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      isInstructorLogin: true, // 🔥 key flag
    });

    if (res?.error) {
      throw new Error("Invalid instructor credentials");
    }
  };

  // 🌐 Google login (students only for now)
  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  // 🚪 Logout
  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  // 🎯 Role helpers (VERY IMPORTANT)
  const isInstructor = user?.role === "instructor";
  const isStudent = user?.role === "student";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginInstructor,
        loginWithGoogle,
        logout,
        isInstructor,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
