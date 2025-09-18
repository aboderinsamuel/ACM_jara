import { useParams } from "react-router-dom";
import Placeholder from "@/components/common/Placeholder";

export default function PaymentPage() {
  const { slug } = useParams();
  return (
    <Placeholder
      title={`Pay: ${slug}`}
      description="Fetch GET /payments/link/:slug, then POST /payments/initiate or /crypto/create-payment."
    />
  );
}
