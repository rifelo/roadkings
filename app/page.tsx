"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import Image from "next/image";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
}

export default function Home() {
  const [userPhone, setUserPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "income" | "expenses"
  >("all");

  useEffect(() => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      // Get user info from session
      fetch("/api/auth/check-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUserPhone(data.phoneNumber);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("sessionToken");
    window.location.href = "/login";
  };

  // Calculate summary metrics
  const totalCollected = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const currentBalance = totalCollected - totalExpenses;

  // Filter transactions based on active filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "income") return transaction.type === "income";
    if (activeFilter === "expenses") return transaction.type === "expense";
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-zinc-900 border border-[#D4B886] rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4B886] mx-auto mb-4"></div>
          <p className="text-[#D4B886]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-stone-900 border-b border-[#D4B886] p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/roadkings.png"
                  alt="RoadKings Logo"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-[#D4B886]"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">ROADKINGS</h1>
                  <p className="text-sm text-[#D4B886]">PORTAL FINANCIERO</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <span>Cerrar Sesión</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            {/* Current Balance */}
            <div className="bg-zinc-900 border border-[#D4B886] rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#D4B886] text-sm font-medium">
                    SALDO ACTUAL
                  </p>
                  <p className="text-[#D4B886] text-3xl font-bold">
                    $
                    {currentBalance.toLocaleString("es-CO", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="w-8 h-8 bg-[#D4B886] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-[#D4B886] text-black"
                  : "bg-zinc-900 border border-[#D4B886] text-[#D4B886] hover:bg-[#D4B886] hover:text-black"
              }`}
            >
              Todas las Transacciones
            </button>
            <button
              onClick={() => setActiveFilter("income")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeFilter === "income"
                  ? "bg-[#D4B886] text-black"
                  : "bg-zinc-900 border border-[#D4B886] text-[#D4B886] hover:bg-[#D4B886] hover:text-black"
              }`}
            >
              Solo Ingresos
            </button>
            <button
              onClick={() => setActiveFilter("expenses")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeFilter === "expenses"
                  ? "bg-[#D4B886] text-black"
                  : "bg-zinc-900 border border-[#D4B886] text-[#D4B886] hover:bg-[#D4B886] hover:text-black"
              }`}
            >
              Solo Gastos
            </button>
          </div>

          {/* Transaction History */}
          <div className="bg-zinc-900 border border-[#D4B886] rounded-lg">
            <div className="p-6 border-b border-[#D4B886]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-[#D4B886] rounded flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">
                  Historial de Transacciones
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800 border-b border-[#D4B886]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#D4B886]">
                      FECHA
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#D4B886]">
                      DESCRIPCIÓN
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#D4B886]">
                      MONTO
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4B886]">
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-zinc-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-[#D4B886]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-white">{transaction.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">
                        {transaction.description}
                      </td>
                      <td
                        className={`px-6 py-4 font-medium ${
                          transaction.type === "income"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}$
                        {Math.abs(transaction.amount).toLocaleString("es-CO", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
