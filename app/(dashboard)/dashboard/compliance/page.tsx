"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ShieldCheck } from "lucide-react";

export default function CompliancePage() {
  return (
    <div>
      <PageHeader
        title="Compliance"
        description="Never miss a tax deadline again. Track GST filings, TDS deposits, ITR due dates, advance tax instalments and ROC filings in one calendar view."
        icon={<ShieldCheck size={20} />}
      />
      <EmptyState
        icon={<ShieldCheck size={28} />}
        title="Set up your compliance calendar"
        description="Tell Finantalyst your entity type and turnover. It will automatically populate your compliance calendar with all relevant deadlines for the financial year."
        steps={[
          { step: 1, title: "Select your entity type", description: "Individual, Proprietorship, Private Ltd, LLP or Partnership — each has different obligations." },
          { step: 2, title: "Enter basic details", description: "GST registration, TAN, CIN — only what's needed to calculate your deadlines." },
          { step: 3, title: "Get your calendar", description: "All deadlines for the year, colour-coded by urgency, with 7-day and 1-day reminders." },
          { step: 4, title: "Approve before any filing", description: "Finantalyst drafts and alerts. Nothing is filed without your explicit approval." },
        ]}
        ctaLabel="Set up compliance calendar"
        onCta={() => alert("Compliance setup — coming in the next phase.")}
      />
    </div>
  );
}
