"use client";
import { useState } from "react";

export default function AddCountry() {
  const [formData, setFormData] = useState({
    name: "",
    flag: "",
    image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/country", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ text: "Country added successfully!", type: "success" });
        setFormData({ name: "", flag: "", image: "" });
        window.location.href = "/admin/country";
      } else {
        const error = await response.json();
        setMessage({
          text: `Failed to add country: ${error.error}`,
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: `An error occurred: ${error.message}`,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex justify-center h-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(84, 55, 146, 1) 80%, rgba(0, 0, 0, 1) 100%)",
      }}
    >
      <div className="max-w-md mx-auto p-20 bg-white rounded-xl shadow-lg absolute top-[20vh]">
        <h2 className="text-2xl font-semibold mb-6 text-center text-black">
          Add New Country
        </h2>

        {message.text && (
          <div
            className={`p-3 mb-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-800"
            >
              Country Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded text-[#333]"
              placeholder="Enter country name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="flag"
              className="block text-sm font-medium text-gray-800"
            >
              Country Flag URL
            </label>
            <input
              id="flag"
              name="flag"
              type="text"
              value={formData.flag}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded text-[#333]"
              placeholder="Enter flag URL"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-800"
            >
              Country Image URL
            </label>
            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              className="mt-2 p-2 w-full border border-gray-300 rounded text-[#333]"
              placeholder="Enter country image URL"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-70"
            >
              {isSubmitting ? "Adding..." : "Add Country"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
