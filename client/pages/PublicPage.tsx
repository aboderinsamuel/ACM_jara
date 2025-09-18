import { useParams } from "react-router-dom";
import Placeholder from "@/components/common/Placeholder";

export default function PublicPage() {
  const { slug } = useParams();
  return (
    <Placeholder
      title={`Public Page: ${slug}`}
      description="Renders arbitrary public content from GET /pages/:slug."
    />
  );
}
