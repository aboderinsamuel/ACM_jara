import Placeholder from "@/components/common/Placeholder";

export default function Pages() {
  return (
    <Placeholder
      title="Pages"
      description="Lists your landing pages. Connect the API to populate from GET /landing-pages/creator/:creatorId."
    >
      <div className="overflow-x-auto rounded-lg ring-1 ring-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Title</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-white/10">
              <td className="px-4 py-3">Example Page</td>
              <td className="px-4 py-3">Draft</td>
              <td className="px-4 py-3">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Placeholder>
  );
}
