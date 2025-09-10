// import db from "@/lib/db";

// export default async function LeadsPage() {
//   const [leads] = await db.query<Lead[]>(
//     `SELECT id, name, email, visa_type,
//      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at
//      FROM leads ORDER BY created_at DESC LIMIT 50`
//   );

//   return (
//     <div
//       className="h-screen w-full p-20"
//       style={{
//         background:
//           "radial-gradient(circle, rgba(84, 55, 146, 1) 80%, rgba(0, 0, 0, 1) 100%)",
//       }}
//     >
//       <div className="max-w-7xl mx-auto px-4 py-10">
//         <div className="mb-10">
//           <h1 className="text-4xl font-semibold text-white">
//             Leads Management
//           </h1>
//           <p className="text-gray-600 mt-2">Recent visa inquiry submissions</p>
//         </div>

//         <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100 text-gray-600">
//                 <tr>
//                   <th className="px-6 py-3 text-left font-semibold">Name</th>
//                   <th className="px-6 py-3 text-left font-semibold">Email</th>
//                   <th className="px-6 py-3 text-left font-semibold">
//                     Visa Type
//                   </th>
//                   <th className="px-6 py-3 text-left font-semibold">
//                     Submission Date
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {leads.map((lead) => (
//                   <tr
//                     key={lead.id}
//                     className="hover:bg-gray-50 transition-all duration-200"
//                   >
//                     <td className="px-6 py-4">
//                       <div className="text-lg font-medium text-gray-900">
//                         {lead.name}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-gray-700">{lead.email}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {lead.visa_type}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-gray-500">{lead.created_at}</div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {leads.length === 0 && (
//           <div className="bg-gray-200 rounded-lg p-10 text-center mt-4">
//             <p className="text-gray-600">No leads found yet.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
