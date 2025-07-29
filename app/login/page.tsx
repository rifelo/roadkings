"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("+57 ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem("sessionToken");

      if (!sessionToken) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/check-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionToken }),
        });

        if (response.ok) {
          // User is already authenticated, redirect to main page
          router.push("/");
        } else {
          // Clear invalid session token
          localStorage.removeItem("sessionToken");
          setIsCheckingAuth(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        localStorage.removeItem("sessionToken");
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phoneNumber.replace(/\s/g, "") }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store session token in localStorage
        localStorage.setItem("sessionToken", data.sessionToken);
        setSuccess("¡Inicio de sesión exitoso! Redirigiendo...");

        // Redirect to main page after a short delay
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Error de red. Por favor inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Ensure it starts with +57
    if (!value.startsWith("+57")) {
      value = "+57 " + value.replace(/^\+57\s*/, "");
    }

    // Limit to 14 characters (+57 + space + 10 digits)
    if (value.length <= 14) {
      setPhoneNumber(value);
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-[#D4B886] rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4B886] mx-auto mb-4"></div>
          <p className="text-[#D4B886]">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-[#D4B886] rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/roadkings.png"
            alt="Logo RoadKings"
            width={120}
            height={120}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenido a RoadKings
          </h1>
          <p className="text-[#D4B886]">
            Ingresa tu número de teléfono para continuar
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[#D4B886] mb-2"
            >
              Número de Teléfono
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="+57 XXXXXXXXX"
                className="w-full px-4 py-3 bg-zinc-800 border border-[#D4B886] rounded-lg focus:ring-2 focus:ring-[#D4B886] focus:border-[#D4B886] text-white placeholder-gray-400"
                disabled={loading}
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Formato: +57 XXXXXXXXX (10 dígitos después de +57)
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || phoneNumber.replace(/\s/g, "").length !== 13}
            className="w-full bg-[#D4B886] text-black py-3 px-4 rounded-lg font-medium hover:bg-[#D4B886]/90 focus:ring-2 focus:ring-[#D4B886] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
