import { ReactNode } from "react";

export default function Placeholder({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="px-4 sm:px-8 max-w-6xl mx-auto py-12">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description ? (
        <p className="mt-2 text-muted-foreground max-w-3xl">{description}</p>
      ) : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </section>
  );
}
