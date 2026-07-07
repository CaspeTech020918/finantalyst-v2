"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FileText, AlertTriangle } from "lucide-react";

export default function TaxPage() {
  return (
    <div>
      <PageHeader
        title="Tax Planning"
        description="Estimate your income tax under the New and Old regime, track deductions (80C, 80D, HRA), calculate advance tax instalments and prepare for ITR filing."
        icon={<FileText size={20} />}
      />

      {/* Regulated notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-[var(--color-red-dim)] border border-[var(--color-red)]/25 mb-6">
        <AlertTriangle size={15} className="text-[var(--color-red)] mt-0.5 shrink-0" />
        <p className="text-xs text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-red)]">Important:</span> Tax estimates here are for planning only — not a substitute for professional CA advice. Actual ITR filing requires a licensed tax practitioner or authorised e-filing portal.
        </p>
      </div>

      <EmptyState
        icon={<FileText size={28} />}
        title="Set up your tax profile"
        description="Tell Finantalyst about your income sources and deductions. It will calculate your estimated tax liability under both regimes and tell you which one saves you more."
        steps={[
          { step: 1, title: "Enter your income sources", description: "Salary, freelance income, rental income, capital gains — add all sources." },
          { step: 2, title: "Log your deductions", description: "80C (PPF, ELSS, LIC), 80D (health insurance), HRA, home loan interest." },
          { step: 3, title: "Compare New vs Old regime", description: "See side-by-side tax liability under both regimes instantly." },
          { step: 4, title: "Track advance tax", description: "Know exactly how much to pay in June, Sept, Dec and March instalments." },
        ]}
        ctaLabel="Set up tax profile"
        onCta={() => alert("Tax profile setup — coming in the next phase.")}
      />
    </div>
  );
}
