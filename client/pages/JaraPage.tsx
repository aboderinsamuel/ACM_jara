import { useParams } from "react-router-dom";
import Placeholder from "@/components/common/Placeholder";

export default function JaraPage() {
  const { slug } = useParams();
  return (
    <Placeholder
      title={`Creator Page: ${slug}`}
      description="Public view rendered from GET /landing-pages/slug/:slug plus creator and published payment links."
    />
  );
}
