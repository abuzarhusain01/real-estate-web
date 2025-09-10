import db from "@/lib/db";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function CountryPage() {
  const [countries] = await db.query<Country[]>(
    `SELECT id, name, flag
     FROM countries ORDER BY name ASC LIMIT 50`
  );

  return (
    <div
      className=" h-screen w-full  p-20"
      style={{
        background:
          "radial-gradient(circle, rgba(84, 55, 146, 1) 80%, rgba(0, 0, 0, 1) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-semibold text-white">
            Country Management
          </h1>
          <Link
            href={`/admin/country/new`}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all"
          >
            Add New Country
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Name</th>
                  <th className="px-6 py-3 text-left font-semibold">Flag</th>
                  <th className="px-6 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {countries.map((country) => (
                  <tr
                    key={country.id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="text-lg font-medium text-gray-900">
                        {country.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">{country.flag}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-4 justify-end">
                        <Link
                          href={`/admin/country/edit/${country.id}`}
                          className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </Link>
                        <button className="text-red-600 hover:text-red-800 px-4 py-2 rounded-md hover:bg-red-100 transition-colors">
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

        {countries.length === 0 && (
          <div className="bg-gray-200 rounded-lg p-10 text-center">
            <p className="text-gray-600">
              No countries found. Create your first country!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
