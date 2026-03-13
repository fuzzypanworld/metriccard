function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

export async function exportNodeAsPng(
  node: HTMLElement,
  filename: string
): Promise<void> {
  await nextFrame();
  await nextFrame();
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
