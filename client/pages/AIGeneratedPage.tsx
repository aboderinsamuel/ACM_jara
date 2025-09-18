import { useParams } from "react-router-dom";
import Placeholder from "@/components/common/Placeholder";

export default function AIGeneratedPage() {
  const { slug } = useParams();
  return (
    <Placeholder
      title={`AI Page: ${slug}`}
      description="Public render of a generated page using GET /landing-pages/slug/:slug."
    />
  );
}
