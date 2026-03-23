"use client";

import { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  CurrencyDollarIcon,
  TagIcon,
  CubeIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface Package {
  id: string;
  name: string;
  tier: string;
  priceMonthly: number;
  priceYearly: number;
  isActive: boolean;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Package | null>(null);
  const [form, setForm] = useState({
    name: "",
    tier: "",
    priceMonthly: 0,
    priceYearly: 0,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    const res = await fetch("/api/admin/packages");
    const data = await res.json();
    setPackages(data.packages);
    setLoading(false);
  }

  function openAdd() {
    setForm({ name: "", tier: "", priceMonthly: 0, priceYearly: 0 });
    setModal("add");
  }

  function openEdit(pkg: Package) {
    setSelected(pkg);
    setForm({
      name: pkg.name,
      tier: pkg.tier,
      priceMonthly: pkg.priceMonthly,
      priceYearly: pkg.priceYearly,
    });
    setModal("edit");
  }

  async function save() {
    const method = modal === "edit" ? "PUT" : "POST";
    const url =
      modal === "edit"
        ? `/api/admin/packages/${selected?.id}`
        : "/api/admin/packages";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      fetchPackages();
      setModal(null);
    }
  }

  async function remove(id: string) {
    if (confirm("Are you sure you want to delete this package?")) {
      await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      fetchPackages();
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139, 92, 246, 0.15) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Package Manager
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Manage your subscription plans with precision
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={openAdd}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden w-full sm:w-auto justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <PlusIcon className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Add Package</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            {
              label: "Total Packages",
              value: packages.length,
              icon: CubeIcon,
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-500/20 to-cyan-500/20",
            },
            {
              label: "Active Plans",
              value: packages.filter((p) => p.isActive).length,
              icon: CheckIcon,
              gradient: "from-green-500 to-emerald-500",
              bgGradient: "from-green-500/20 to-emerald-500/20",
            },
            {
              label: "Avg Monthly Price",
              value: `$${(
                packages.reduce((sum, p) => sum + p.priceMonthly, 0) /
                  packages.length || 0
              ).toFixed(0)}`,
              icon: CurrencyDollarIcon,
              gradient: "from-purple-500 to-pink-500",
              bgGradient: "from-purple-500/20 to-pink-500/20",
            },
            {
              label: "Unique Tiers",
              value: new Set(packages.map((p) => p.tier)).size,
              icon: TagIcon,
              gradient: "from-orange-500 to-red-500",
              bgGradient: "from-orange-500/20 to-red-500/20",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-white mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-2 md:p-3 shadow-lg`}
                  >
                    <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Packages Table */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-gray-800/80">
                <tr>
                  {[
                    "Package Name",
                    "Tier",
                    "Monthly Price",
                    "Yearly Price",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {packages.map((p) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-gray-700/30 transition-all duration-200"
                  >
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <CubeIcon className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
                        </div>
                        <div className="ml-3 md:ml-4">
                          <div className="text-sm font-semibold text-white">
                            {p.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30">
                        {p.tier}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        ${p.priceMonthly}
                      </div>
                      <div className="text-xs text-gray-500">per month</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        ${p.priceYearly}
                      </div>
                      <div className="text-xs text-gray-500">per year</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          p.isActive
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
                            : "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-gray-400 hover:text-purple-400 transition-all duration-200 inline-flex items-center gap-1 group/btn"
                        >
                          <PencilIcon className="h-3 w-3 md:h-4 md:w-4 group-hover/btn:scale-110 transition-transform" />
                          <span className="text-xs md:text-sm">Edit</span>
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          className="text-gray-400 hover:text-red-400 transition-all duration-200 inline-flex items-center gap-1 group/btn"
                        >
                          <TrashIcon className="h-3 w-3 md:h-4 md:w-4 group-hover/btn:scale-110 transition-transform" />
                          <span className="text-xs md:text-sm">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {packages.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-gray-800/50 rounded-full mb-4">
              <CubeIcon className="h-12 w-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No packages yet
            </h3>
            <p className="text-gray-500">
              Get started by creating your first package
            </p>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full transform transition-all border border-gray-700/50">
            <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {modal === "edit" ? "Edit Package" : "Create Package"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Package Name
                </label>
                <input
                  placeholder="e.g., Pro Plan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tier
                </label>
                <input
                  placeholder="e.g., premium"
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monthly Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.priceMonthly}
                  onChange={(e) =>
                    setForm({ ...form, priceMonthly: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Yearly Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.priceYearly}
                  onChange={(e) =>
                    setForm({ ...form, priceYearly: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-700/50 bg-gray-800/50 rounded-b-2xl">
              <button
                onClick={save}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
