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
      <div className="min-h-[400px] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Main Content Container */}
      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-xl">
                  <SparklesIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Package Manager
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Manage your subscription plans
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Package</span>
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
            },
            {
              label: "Active Plans",
              value: packages.filter((p) => p.isActive).length,
              icon: CheckIcon,
            },
            {
              label: "Avg Monthly Price",
              value: `$${(
                packages.reduce((sum, p) => sum + p.priceMonthly, 0) /
                  packages.length || 0
              ).toFixed(0)}`,
              icon: CurrencyDollarIcon,
            },
            {
              label: "Unique Tiers",
              value: new Set(packages.map((p) => p.tier)).size,
              icon: TagIcon,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
            >
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs md:text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-2 md:p-3">
                    <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Packages Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                      className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {packages.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <CubeIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                        </div>
                        <div className="ml-3 md:ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {p.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-700">
                        {p.tier}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${p.priceMonthly}
                      </div>
                      <div className="text-xs text-gray-500">per month</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${p.priceYearly}
                      </div>
                      <div className="text-xs text-gray-500">per year</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 md:px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                          p.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-gray-500 hover:text-gray-700 transition-colors duration-200 inline-flex items-center gap-1"
                        >
                          <PencilIcon className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="text-xs md:text-sm">Edit</span>
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          className="text-gray-500 hover:text-red-600 transition-colors duration-200 inline-flex items-center gap-1"
                        >
                          <TrashIcon className="h-3 w-3 md:h-4 md:w-4" />
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
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
              <CubeIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {modal === "edit" ? "Edit Package" : "Create Package"}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Name
                </label>
                <input
                  placeholder="e.g., Pro Plan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tier
                </label>
                <input
                  placeholder="e.g., premium"
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.priceMonthly}
                  onChange={(e) =>
                    setForm({ ...form, priceMonthly: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yearly Price ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.priceYearly}
                  onChange={(e) =>
                    setForm({ ...form, priceYearly: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={save}
                className="flex-1 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200"
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
