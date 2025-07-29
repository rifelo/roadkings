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
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-[#D4B886] rounded-2xl shadow-xl p-8 text-center max-w-sm w-full md:max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4B886] mx-auto mb-4"></div>
          <p className="text-[#D4B886] text-sm md:text-base">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-stone-900 border-b border-[#D4B886] p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Image
                src="/roadkings.png"
                alt="RoadKings Logo"
                width={40}
                height={40}
                className="rounded-full border-2 border-[#D4B886] md:w-12 md:h-12"
              />
              <div>
                <h1 className="text-lg font-bold text-white md:text-xl">
                  ROADKINGS MC
                </h1>
                <p className="text-xs text-[#D4B886] md:text-sm">
                  PORTAL FINANCIERO
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 transition-colors md:px-4 md:py-2 md:text-base"
            >
              <span className="hidden sm:inline">Cerrar</span>
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
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

        <div className="p-4 max-w-4xl mx-auto h-screen flex flex-col">
          {/* Summary Cards */}
          <div className="mb-6 flex-shrink-0">
            {/* Current Balance */}
            <div className="bg-zinc-900 border border-[#D4B886] rounded-xl p-4 md:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#D4B886] text-xs font-medium mb-1 md:text-sm">
                    SALDO ACTUAL
                  </p>
                  <p className="text-[#D4B886] text-2xl font-bold md:text-3xl">
                    $
                    {currentBalance.toLocaleString("es-CO", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="w-8 h-8 bg-[#D4B886] rounded-lg flex items-center justify-center md:w-10 md:h-10">
                  <svg
                    className="w-4 h-4 text-black md:w-5 md:h-5"
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
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 md:gap-4 md:overflow-visible flex-shrink-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors md:px-6 md:py-3 md:text-base ${
                activeFilter === "all"
                  ? "bg-[#D4B886] text-black"
                  : "bg-zinc-900 border border-[#D4B886] text-[#D4B886] hover:bg-[#D4B886] hover:text-black"
              }`}
            >
              Todas ({transactions.length})
            </button>
            <button
              onClick={() => setActiveFilter("income")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors md:px-6 md:py-3 md:text-base ${
                activeFilter === "income"
                  ? "bg-[#D4B886] text-black"
                  : "bg-zinc-900 border border-[#D4B886] text-[#D4B886] hover:bg-[#D4B886] hover:text-black"
              }`}
            >
              Ingresos ({transactions.filter((t) => t.type === "income").length}
              )
            </button>
            <button
              onClick={() => setActiveFilter("expenses")}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors md:px-6 md:py-3 md:text-base ${
                activeFilter === "expenses"
                  ? "bg-[#D4B886] text-black"
                  : "bg-zinc-900 border border-[#D4B886] text-[#D4B886] hover:bg-[#D4B886] hover:text-black"
              }`}
            >
              Gastos ({transactions.filter((t) => t.type === "expense").length})
            </button>
          </div>

          {/* Transaction History */}
          <div className="bg-zinc-900 border border-[#D4B886] rounded-xl flex flex-col flex-1 min-h-0">
            <div className="p-4 border-b border-[#D4B886] md:p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-5 h-5 bg-[#D4B886] rounded flex items-center justify-center md:w-6 md:h-6">
                    <svg
                      className="w-3 h-3 text-black md:w-4 md:h-4"
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
                  <h2 className="text-lg font-bold text-white md:text-xl">
                    Transacciones
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-[#D4B886] text-xs font-medium md:text-sm">
                    Mostrando {filteredTransactions.length} de{" "}
                    {transactions.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredTransactions.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-400 text-sm md:text-base">
                    No hay transacciones
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#D4B886]">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-4 hover:bg-zinc-800/50 transition-colors md:p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <svg
                              className="w-3 h-3 text-[#D4B886] flex-shrink-0 md:w-4 md:h-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-white text-xs md:text-sm">
                              {transaction.date}
                            </span>
                          </div>
                          <p className="text-white text-sm truncate md:text-base">
                            {transaction.description}
                          </p>
                        </div>
                        <div
                          className={`ml-3 text-right ${
                            transaction.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          <p className="text-sm font-medium md:text-base">
                            {transaction.type === "income" ? "+" : "-"}$
                            {Math.abs(transaction.amount).toLocaleString(
                              "es-CO",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
