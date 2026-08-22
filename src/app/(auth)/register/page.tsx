"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, UserPlus, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    flatNumber: "",
    towerBlock: "Tower A",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register");
      }

      router.push("/resident");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-6 px-4">
      {/* Header Branding */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-warm-primary/10 border border-warm-primary/20 text-warm-primary mb-3">
          <Building2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-warm-dark tracking-tight">
          Resident Registration
        </h1>
        <p className="text-sm text-warm-muted mt-1 font-medium">
          Create an account to raise maintenance requests and track repairs
        </p>
      </div>

      <div className="w-full max-w-lg space-y-6">
        <Card className="shadow-warm-lg border-warm-border">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Apartment & Resident Details</CardTitle>
            <CardDescription>
              Please enter your full name and apartment unit number.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3.5 bg-warm-crimson-light border border-warm-crimson-border rounded-xl text-warm-crimson-text text-xs font-semibold animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name"
                required
                placeholder="e.g. Ananya Sharma"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Tower / Wing"
                  options={[
                    { label: "Tower A (Sunrise)", value: "Tower A" },
                    { label: "Tower B (Park View)", value: "Tower B" },
                    { label: "Tower C (Clubside)", value: "Tower C" },
                    { label: "Tower D (East Wing)", value: "Tower D" },
                  ]}
                  value={formData.towerBlock}
                  onChange={(e) =>
                    setFormData({ ...formData, towerBlock: e.target.value })
                  }
                />

                <Input
                  label="Flat / Unit Number"
                  required
                  placeholder="e.g. 402"
                  value={formData.flatNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, flatNumber: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="ananya@greenview.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 98123 45678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <Input
                label="Password (min 6 characters)"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              <Button
                type="submit"
                className="w-full font-bold mt-2"
                isLoading={isLoading}
              >
                <UserPlus className="w-4 h-4" />
                Register Resident Account
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-warm-muted pt-4 border-t border-warm-border/80">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-warm-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
