import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Check onboardingDone from DB — not from JWT (JWT may be stale after onboarding)
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { onboardingDone: true, mode: true },
  });

  if (!user?.onboardingDone) redirect("/onboarding");

  return (
    <div className="flex min-h-screen bg-[var(--color-base)]">
      <DashboardNav session={session} />
      <main className="flex-1 ml-60 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
