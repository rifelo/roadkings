"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
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
      // Validate phone number format
      let formattedPhone = phoneNumber;

      // Remove any non-digit characters except +
      const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");

      // If it doesn't start with +57, add it
      if (!cleanNumber.startsWith("+57")) {
        formattedPhone = `+57${cleanNumber}`;
      } else {
        formattedPhone = cleanNumber;
      }

      // Validate the final format
      if (formattedPhone.length !== 13 || !formattedPhone.startsWith("+57")) {
        setError("Formato inválido. Debe ser 10 dígitos (ej: 3101234567)");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: formattedPhone }),
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
    const value = e.target.value;

    // Allow only numbers and + symbol
    const cleanValue = value.replace(/[^\d+]/g, "");

    // Limit to reasonable length (10 digits + optional +57)
    if (cleanValue.length <= 13) {
      setPhoneNumber(cleanValue);
    }
  };

  // Validate if button should be enabled
  const isValidPhoneNumber = () => {
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
    if (cleanNumber.startsWith("+57")) {
      return cleanNumber.length === 13;
    } else {
      return cleanNumber.length === 10;
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-[#D4B886] rounded-2xl shadow-xl p-6 text-center max-w-sm w-full md:max-w-md">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4B886] mx-auto mb-3 md:h-12 md:w-12 md:mb-4"></div>
          <p className="text-[#D4B886] text-sm md:text-base">
            Verificando autenticación...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-[#D4B886] rounded-2xl shadow-xl p-6 w-full max-w-sm md:max-w-md md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <Image
            src="/roadkings.png"
            alt="Logo RoadKings"
            width={80}
            height={80}
            className="mx-auto mb-4 md:w-24 md:h-24"
          />
          <h1 className="text-2xl font-bold text-white mb-2 md:text-3xl">
            Bienvenido
          </h1>
          <p className="text-[#D4B886] text-sm md:text-base">
            Ingresa tu número de teléfono
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-3 py-2 rounded-lg mb-4 text-sm md:px-4 md:py-3 md:text-base">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-500 text-green-400 px-3 py-2 rounded-lg mb-4 text-sm md:px-4 md:py-3 md:text-base">
            {success}
          </div>
        )}

        <div className="space-y-4 md:space-y-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-[#D4B886] mb-2 md:text-base"
            >
              Número de Teléfono
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Ej: 3101234567"
                className="w-full px-3 py-3 bg-zinc-800 border border-[#D4B886] rounded-lg focus:ring-2 focus:ring-[#D4B886] focus:border-[#D4B886] text-white placeholder-gray-400 text-sm md:px-4 md:py-4 md:text-base"
                style={{ fontSize: "16px" }}
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 md:text-sm">
              Formato: 3101234567 o +573101234567
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !isValidPhoneNumber()}
            className="w-full bg-[#D4B886] text-black py-3 px-4 rounded-lg font-medium hover:bg-[#D4B886]/90 focus:ring-2 focus:ring-[#D4B886] focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm md:py-4 md:text-base"
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
