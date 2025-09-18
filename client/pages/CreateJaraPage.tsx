import Placeholder from "@/components/common/Placeholder";

export default function CreateJaraPage() {
  return (
    <Placeholder
      title="Create or Edit Page"
      description="Form to create/update your landing page. On submit call POST /landing-pages or PUT /landing-pages/:id."
    >
      <form className="grid gap-4 max-w-2xl">
        <input
          className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
          placeholder="Title"
        />
        <textarea
          className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
          placeholder="Description"
          rows={4}
        />
        <button className="justify-self-start rounded bg-primary px-5 py-3 font-semibold">
          Save
        </button>
      </form>
    </Placeholder>
  );
}
