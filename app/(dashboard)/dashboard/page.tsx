import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { IndividualDashboard } from "@/components/dashboard/modes/individual";
import { FreelancerDashboard } from "@/components/dashboard/modes/freelancer";
import { BusinessDashboard } from "@/components/dashboard/modes/business";
import { StartupDashboard } from "@/components/dashboard/modes/startup";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { mode: true, name: true },
  });

  const mode = user?.mode ?? "INDIVIDUAL";
  const firstName = (user?.name ?? "there").split(" ")[0];

  return (
    <div>
      <div className="mb-7">
        <p className="text-subheading text-[var(--color-text-muted)] mb-1">Dashboard</p>
        <h1 className="text-display text-[var(--color-text-primary)]">Good morning, {firstName}</h1>
        <p className="text-caption text-[var(--color-text-secondary)] mt-1">
          {mode === "INDIVIDUAL" && "Your personal finance overview. Connect your accounts to get started."}
          {mode === "FREELANCER" && "Your freelance finance hub. Track income, invoices and taxes in one place."}
          {mode === "BUSINESS" && "Your business command centre. P&L, cash flow and compliance at a glance."}
          {mode === "STARTUP" && "Your startup finance cockpit. Burn, runway and investor metrics in one view."}
        </p>
      </div>
      {mode === "INDIVIDUAL" && <IndividualDashboard />}
      {mode === "FREELANCER" && <FreelancerDashboard />}
      {mode === "BUSINESS" && <BusinessDashboard />}
      {mode === "STARTUP" && <StartupDashboard />}
    </div>
  );
}
