"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteUserByAdmin } from "@/lib/actions/users";

interface UserData {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
  last_active_at: string | null;
}

interface UserListTableProps {
  users: UserData[];
}

export default function UserListTable({ users }: UserListTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus pengguna "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setDeletingId(userId);
    const loadingToast = toast.loading("Menghapus pengguna...");
    
    startTransition(async () => {
      try {
        const result = await deleteUserByAdmin(userId);
        if (result.error) {
          toast.error(result.error, { id: loadingToast });
        } else {
          toast.success("Pengguna berhasil dihapus", { id: loadingToast });
        }
      } catch (_e) {
        toast.error("Terjadi kesalahan.", { id: loadingToast });
      } finally {
        setDeletingId(null);
      }
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/50">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-800 bg-neutral-800/50 text-xs uppercase text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium">Nama / ID</th>
            <th scope="col" className="px-6 py-4 font-medium">Role</th>
            <th scope="col" className="px-6 py-4 font-medium">Bergabung Pada</th>
            <th scope="col" className="px-6 py-4 font-medium">Terakhir Aktif</th>
            <th scope="col" className="px-6 py-4 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {users.map((user) => {
            const isDeleting = deletingId === user.id;
            return (
              <tr key={user.id} className="transition-colors hover:bg-neutral-800/30">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{user.full_name || "Tanpa Nama"}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{user.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                  {formatDate(user.created_at)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-300">
                  {formatDate(user.last_active_at)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleDelete(user.id, user.full_name || "Tanpa Nama")}
                      disabled={isDeleting || isPending}
                      title="Hapus Pengguna"
                      className="rounded p-1.5 text-gray-400 hover:bg-neutral-800 hover:text-red-500 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          Belum ada pengguna terdaftar.
        </div>
      )}
    </div>
  );
}
