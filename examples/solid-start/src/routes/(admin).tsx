import { RouteSectionProps } from "@solidjs/router";
import { AdminLayout } from "~/components/AdminLayout";

export default function AdminLayoutRoute(props: RouteSectionProps) {
  return <AdminLayout>{props.children}</AdminLayout>;
}
