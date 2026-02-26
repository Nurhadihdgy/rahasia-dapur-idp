const DataTable = ({ headers, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
        <tr>
          {headers.map((head) => (
            <th key={head} className="px-6 py-4">{head}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {children}
      </tbody>
    </table>
  </div>
);
export default DataTable;