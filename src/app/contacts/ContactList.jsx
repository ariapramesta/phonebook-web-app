"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getContacts } from "@/redux/contactsSlice";
import ContactItem from "./ContactItem";

export default function ContactList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.contacts);

  useEffect(() => {
    dispatch(getContacts());
  }, [dispatch]);

  console.log(items);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
      {items.map((item) => (
        <ContactItem key={item.id} item={item} />
      ))}
    </div>
  );
}
