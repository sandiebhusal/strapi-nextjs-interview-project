"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

const Filter = ({ initialSearch }) => {
  const [search, setSearch] = useState(initialSearch || "");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`?search=${search}`);
  };

  return (
    <form onSubmit={handleSearch} className="filter-form">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title..."
        className="filter-input"
      />
      <button type="submit" className="filter-button">
        Search
      </button>
    </form>
  );
};

export default Filter;

