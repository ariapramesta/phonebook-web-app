"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeContact, editContact } from "@/redux/contactsSlice";
import Avatar from "./Avatar";
import ConfirmDialog from "./ConfirmDialog";
import { Pencil, Trash, Save, XCircle, Hourglass } from "lucide-react";

export default function ContactItem({ item }) {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [contact, setContact] = useState({
    name: item.name,
    phone: item.phone,
  });
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const save = () => {
    dispatch(editContact({ id: item.id, contact }));
    setIsEdit(false);
  };

  if (isEdit) {
    return (
      <div className="shadow-inner bg-white rounded-2xl p-4 flex items-center gap-5 border border-gray-200">
        <div>
          <a href={`/edit-avatar?id=${item.id}`} title="Edit Avatar">
            <Avatar src={item.avatar || "/avatar.png"} />
          </a>
        </div>
        <div className="flex flex-col w-full gap-1">
          <input
            type="text"
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
            placeholder="Name"
          />
          <input
            type="text"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
            placeholder="Phone"
          />
          <div className="flex gap-3 mt-3">
            <button
              type="button"
              onClick={() => setIsEdit(false)}
              className="hover:cursor-pointer text-red-600 hover:text-red-700 transition"
            >
              <XCircle />
            </button>
            <button
              type="button"
              onClick={save}
              className="hover:cursor-pointer text-blue-600 hover:text-blue-700 transition"
            >
              <Save />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shadow-inner bg-white rounded-2xl p-4 flex items-center gap-5 border border-gray-200">
      <div>
        <a href={`/edit-avatar?id=${item.id}`} title="Edit Avatar">
          <Avatar src={item.avatar || "/avatar.png"} />
        </a>
      </div>
      <div className="flex flex-col w-full gap-1">
        <div className="font-semibold text-xl text-gray-900">{item.name}</div>
        <div className="text-gray-700 text-base">{item.phone}</div>
        <div className="flex gap-3 mt-3">
          <button
            type="button"
            onClick={() => setIsEdit(true)}
            className="hover:cursor-pointer text-yellow-600 hover:text-yellow-700 transition"
          >
            <Pencil />
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => setShowConfirm(true)}
            className={`hover:cursor-pointer text-red-600 hover:text-red-700 transition ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {deleting ? <Hourglass /> : <Trash />}
          </button>
          <ConfirmDialog
            open={showConfirm}
            title="Delete Confirmation"
            message={`Are you sure you want to delete \"${item.name}\" contact?`}
            onCancel={() => setShowConfirm(false)}
            onConfirm={async () => {
              setShowConfirm(false);
              setDeleting(true);
              await dispatch(removeContact(item.id));
              setDeleting(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
