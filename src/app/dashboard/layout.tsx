import DashboardNav from "@/components/dashboard/DashboardNav";
import { createClient, getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserActivityTracker from "@/components/UserActivityTracker";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await getUser();

  if (!user) {
    redirect("/?auth=login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <aside className="sticky top-0 z-40 bg-[#0a0a0a] pt-4 pb-2 mb-6 lg:bg-transparent lg:pt-0 lg:pb-0 lg:mb-0 lg:w-64 lg:shrink-0 lg:top-8 h-fit shadow-md lg:shadow-none -mx-4 px-4 sm:mx-0 sm:px-0 w-[100vw] sm:w-full overflow-hidden lg:overflow-visible">
          <DashboardNav />
        </aside>
        <main className="flex-1">
          <UserActivityTracker />
          {children}
        </main>
      </div>
    </div>
  );
}
