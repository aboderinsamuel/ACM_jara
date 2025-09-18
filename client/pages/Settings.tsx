import Placeholder from "@/components/common/Placeholder";

export default function Settings() {
  return (
    <Placeholder
      title="Settings"
      description="Update creator profile via GET/PUT /creators/:creatorId. Image uploads POST /images/upload."
    >
      <form className="grid gap-4 max-w-2xl">
        <input
          className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
          placeholder="Display name"
        />
        <input
          className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
          placeholder="Website"
        />
        <textarea
          className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
          placeholder="Bio"
          rows={4}
        />
        <button className="justify-self-start rounded bg-primary px-5 py-3 font-semibold">
          Save
        </button>
      </form>
    </Placeholder>
  );
}
