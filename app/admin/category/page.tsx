"use client";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Category = {
  id: number;
  title: string;
  description: string;
};

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 sm:px-6 py-4 font-semibold">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </th>
              <th className="px-4 sm:px-6 py-4 font-semibold">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </th>
              <th className="px-4 sm:px-6 py-4 font-semibold text-right">
                <div className="h-4 bg-gray-300 rounded w-16 ml-auto"></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: 10 }).map((_, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-all duration-150">
                <td className="px-4 sm:px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </td>
                <td className="px-4 sm:px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-48 max-w-xs"></div>
                </td>
                <td className="px-4 sm:px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end flex-wrap">
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function CategoryPage() {
  const [categories, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategory(data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const deleteCategories = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Failed: " + (error.error || res.statusText));
        return;
      }

      setCategory((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Error deleting category");
      console.error(error);
    }
  };

  const [totalCategory, setTotalCategory] = useState<number>(0);

  useEffect(() => {
    const fetchTotalCategory = async () => {
      try {
        const res = await fetch("/api/categories/count");
        const data = await res.json();
        setTotalCategory(data?.total);
      } catch (err) {
        console.error("Failed to fetch total category", err);
      }
    };

    fetchTotalCategory();
  }, []);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen w-full  px-4 py-10 sm:px-10 md:px-20">
      <div className="max-w-7xl mx-auto bg-[#aaa] rounded-2xl px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-semibold text-white text-center sm:text-left">
            Categories List
          </h1>
          <div className=" flex gap-x-5">
            <h2 className="text-2xl font-black text-white">Total Categories</h2>
            {loading ? (
              <div className="h-8 w-8 bg-gray-300 rounded animate-pulse"></div>
            ) : (
              <p className="text-2xl  font-semibold text-white">{totalCategory}</p>
            )}
          </div>
          <Link
            href="/admin/category/new"
            className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 sm:px-7 sm:py-3 rounded-xl shadow-lg transition-all text-sm sm:text-base"
          >
            <PlusCircle size={20} />
            <span>Add New Category</span>
          </Link>
        </div>

        {/* Table or Skeleton */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 font-semibold">Name</th>
                    <th className="px-4 sm:px-6 py-4 font-semibold">Description</th>
                    <th className="px-4 sm:px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-all duration-150">
                      <td className="px-4 sm:px-6 py-4 text-gray-900 font-medium">{category.title}</td>
                      <td className="px-4 sm:px-6 py-4 text-gray-700 max-w-xs truncate">
                        {category.description}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end flex-wrap">
                          <Link
                            href={`/admin/category/edit/${category.id}`}
                            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-100 text-xs sm:text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteCategories(category.id)}
                            className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-100 text-xs sm:text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="bg-gray-200 rounded-lg mt-5 p-5 text-center">
            <p className="text-gray-600">No categories found. Create your first category!</p>
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md border ${currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 font-medium text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md border ${currentPage === totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-white hover:bg-gray-100"
                }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}