import Placeholder from "@/components/common/Placeholder";

export default function PaymentLinks() {
  return (
    <Placeholder
      title="Payment Links"
      description="Create, edit, publish/unpublish payment links. Backed by /payment-links and /creators/:id/payment-links."
    >
      <div className="grid gap-3 max-w-3xl">
        <div className="rounded bg-white/5 p-4 ring-1 ring-white/10">
          Link A — Draft
        </div>
        <div className="rounded bg-white/5 p-4 ring-1 ring-white/10">
          Link B — Published
        </div>
      </div>
    </Placeholder>
  );
}
