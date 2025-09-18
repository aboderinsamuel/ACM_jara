import Placeholder from "@/components/common/Placeholder";

export default function AIGenerator() {
  return (
    <Placeholder
      title="AI Generator"
      description="POST /ai/generate with prompt and options to create a page and suggested payment links."
    >
      <form className="grid gap-4 max-w-2xl">
        <textarea
          className="rounded bg-white/5 px-4 py-3 ring-1 ring-white/10"
          placeholder="Describe your page..."
          rows={6}
        />
        <button className="justify-self-start rounded bg-primary px-5 py-3 font-semibold">
          Generate
        </button>
      </form>
    </Placeholder>
  );
}
