import React from "react";

export default function TableResponse({ table }) {
  if (!table) return null;
  const { columns = [], rows = [] } = table;

  return (
    <div className="overflow-auto border border-gray-200 dark:border-gray-800 rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 text-left font-medium">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-950">
              {r.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-2">{String(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
