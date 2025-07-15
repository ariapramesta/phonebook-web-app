"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getContacts } from "@/redux/contactsSlice";
import ContactItem from "./ContactItem";
import { ArrowUpAZ, ArrowDownAZ, PlusCircle } from "lucide-react";

export default function ContactList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.contacts);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    filtered.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return sortAsc ? -1 : 1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return sortAsc ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [items, search, sortAsc]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div>
      <div className="w-full flex justify-between gap-3">
        <button
          className="px-4 py-2 bg-black text-white rounded-lg transition"
          onClick={() => setSortAsc((prev) => !prev)}
        >
          {sortAsc ? <ArrowUpAZ /> : <ArrowDownAZ />}
        </button>
        <input
          type="search"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-screen px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2"
        />
        <a
          href="/add-contact"
          className="px-4 py-2 bg-black text-white rounded-lg transition"
        >
          <PlusCircle />
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
        {filteredAndSortedItems.map((item) => (
          <ContactItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
