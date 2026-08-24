"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, LogIn, Shield, User, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/resident");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-6 px-4">
      {/* Header Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-warm-primary/10 border border-warm-primary/20 text-warm-primary mb-3">
          <Building2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-warm-dark tracking-tight">
          Greenview Heights
        </h1>
        <p className="text-sm text-warm-muted mt-1 font-medium">
          Apartment Society Maintenance & Complaint Portal
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-warm-lg border-warm-border bg-warm-card">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Sign In to Your Account</CardTitle>
            <CardDescription>
              Enter your credentials or use the 1-click reviewer demo profiles below.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3.5 bg-warm-crimson-light border border-warm-crimson-border rounded-xl text-warm-crimson-text text-xs font-semibold animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="name@greenview.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                className="w-full font-bold"
                isLoading={isLoading}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            </form>

            {/* Quick Demo Reviewer Box */}
            <div className="mt-6 pt-5 border-t border-warm-border/80 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-warm-muted text-center">
                Reviewer 1-Click Demo Profiles
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemo("admin@greenview.com", "admin123")
                  }
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-warm-dark transition-all text-xs font-bold text-center active:scale-95"
                >
                  <Shield className="w-4 h-4 text-amber-500 mb-1" />
                  <span>Admin Demo</span>
                  <span className="text-[10px] font-normal text-amber-500">admin123</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickDemo("resident@greenview.com", "resident123")
                  }
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-warm-border bg-warm-surface hover:bg-warm-surface/80 text-warm-dark transition-all text-xs font-bold text-center active:scale-95"
                >
                  <User className="w-4 h-4 text-warm-muted mb-1" />
                  <span>Resident Demo</span>
                  <span className="text-[10px] font-normal text-warm-muted">Flat 402</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-warm-muted">
              New resident in the society?{" "}
              <Link
                href="/register"
                className="font-bold text-warm-primary hover:underline inline-flex items-center gap-0.5"
              >
                Register your flat <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
