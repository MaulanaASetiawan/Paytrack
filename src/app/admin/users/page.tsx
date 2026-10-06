import { getUsersList } from "@/lib/actions/admin";
import UserListTable from "./UserListTable";

export const metadata = {
  title: "Admin - Users | Paytrack",
};

export default async function AdminUsersPage() {
  const users = await getUsersList();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Daftar Pengguna</h1>
        <p className="text-sm text-gray-400">
          Melihat daftar pengguna yang terdaftar di platform Paytrack beserta status terakhir aktif.
        </p>
      </div>

      <div className="rounded-xl border border-blue-900/50 bg-blue-900/10 p-4 mb-6">
        <p className="text-sm text-blue-400">
          <strong>Perhatian:</strong> Untuk dapat melihat aktivitas pengguna secara real-time dan menghapus pengguna, pastikan migration untuk `last_active_at` sudah dijalankan di database Anda dan `SUPABASE_SERVICE_ROLE_KEY` telah disetel di `.env.local`.
        </p>
      </div>

      <UserListTable users={users} />
    </div>
  );
}
