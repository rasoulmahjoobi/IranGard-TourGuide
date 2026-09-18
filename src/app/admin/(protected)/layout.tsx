import { AdminHeader } from "@/src/components/admin/AdminHeader";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </>
  );
}