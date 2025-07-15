"use client";

import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getContacts } from "@/redux/contactsSlice";
import ContactItem from "./ContactItem";
import { ArrowUpAZ, ArrowDownAZ, PlusCircle } from "lucide-react";

export default function ContactList() {
  const dispatch = useDispatch();
  const { items, loading, error, page = 1, pages = 1 } = useSelector((state) => state.contacts);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Ref for the sentinel div
  const loadMoreRef = useRef(null);

  // Debounced search
  const searchRef = useRef(search);
  useEffect(() => { searchRef.current = search; }, [search]);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchRef.current === search) {
        dispatch(getContacts({ page: 1, search, sortAsc }));
      }
    }, 400); // debounce ms
    return () => clearTimeout(handler);
  }, [dispatch, search, sortAsc]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading || loadingMore) return;
    if (page >= pages) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && page < pages) {
          setLoadingMore(true);
          dispatch(getContacts({ page: page + 1, search, sortAsc, append: true }))
            .finally(() => setLoadingMore(false));
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [dispatch, page, pages, loading, loadingMore, search, sortAsc]);

  if (loading && page === 1) return <p>Loading...</p>;
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
        {items.map((item) => (
          <ContactItem key={item.id} item={item} />
        ))}
      </div>
      <div ref={loadMoreRef} style={{ height: 1 }} />
      {loadingMore && (
        <div className="flex justify-center my-4">
          <span className="px-4 py-2 bg-gray-200 rounded">Loading more...</span>
        </div>
      )}
    </div>
  );
}
