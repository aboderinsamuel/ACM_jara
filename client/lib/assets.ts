// Discover local poster images in /moviePosters without using placeholders
export async function discoverLocalPosters(max = 32): Promise<string[]> {
  const exts = ["webp", "jpg", "jpeg", "png", "avif"] as const;
  const base = "/moviePosters/";
  const found: string[] = [];

  const test = (url: string) =>
    new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });

  // Try p{n}.{ext}
  for (let i = 1; i <= 80 && found.length < max; i++) {
    for (const ext of exts) {
      const url = `${base}p${i}.${ext}`;
      // eslint-disable-next-line no-await-in-loop
      if (await test(url)) {
        found.push(url);
        break;
      }
    }
  }

  // Try image{n}.{ext}
  for (let i = 1; i <= 80 && found.length < max; i++) {
    for (const ext of exts) {
      const url = `${base}image${i}.${ext}`;
      // eslint-disable-next-line no-await-in-loop
      if (await test(url)) {
        found.push(url);
        break;
      }
    }
  }

  return Array.from(new Set(found)).slice(0, max);
}

export function preloadLink(href: string, as: string, type?: string) {
  try {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = as as any;
    link.href = href;
    if (type) link.type = type;
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch {}
    };
  } catch {
    return () => {};
  }
}
