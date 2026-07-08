import { useEffect, useState } from "react";
import "./App.css";
import useUsers from "./hooks/useUsers";

function App() {
  const { users, loading, error, fetchAll, debouncedSearch } = useUsers();
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const onChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val.trim());
  };

  return (
    <div className="w-full p-6">
      <input
        placeholder="Search by id"
        className="w-full p-2 mb-4 border rounded"
        value={query}
        onChange={onChange}
      />

      {loading && <div className="mb-2">Loading…</div>}
      {error && <div className="mb-2 text-red-600">{error}</div>}

      <div>
        {users && users.length > 0 ? (
          users.map((u) => (
            <div key={u.id} className="p-4 m-2 border border-gray-400">
              <h1 className="text-xl font-bold">{u.name}</h1>
              <p>ID: {u.id}</p>
            </div>
          ))
        ) : (
          <div>No users to display</div>
        )}
      </div>
    </div>
  );
}

export default App;
