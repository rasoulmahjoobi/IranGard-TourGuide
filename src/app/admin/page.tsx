import { redirect } from "next/navigation";
import { ROUTES } from "@/src/lib/constants";

export default function AdminIndexPage() {
  redirect(ROUTES.adminLogin);
}