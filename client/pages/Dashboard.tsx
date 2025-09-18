import Placeholder from "@/components/common/Placeholder";

export default function Dashboard() {
  return (
    <Placeholder
      title="Dashboard"
      description="Shows revenue, latest transactions, and quick links. Auth required; requests include Authorization: Bearer <supabase_access_token>."
    >
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-white/5 p-5 ring-1 ring-white/10">
          <div className="text-white/70 text-sm">Revenue (30d)</div>
          <div className="text-3xl font-bold mt-2">$0</div>
        </div>
        <div className="rounded-lg bg-white/5 p-5 ring-1 ring-white/10">
          <div className="text-white/70 text-sm">Transactions</div>
          <div className="text-3xl font-bold mt-2">0</div>
        </div>
        <div className="rounded-lg bg-white/5 p-5 ring-1 ring-white/10">
          <div className="text-white/70 text-sm">Quick Links</div>
          <div className="mt-2 text-white/80">
            Create Page • New Payment Link
          </div>
        </div>
      </div>
    </Placeholder>
  );
}
