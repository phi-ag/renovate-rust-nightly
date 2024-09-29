class ElementHandler {
  versions = new Set<string>();

  text({ text }: { text: string }) {
    if (text.length === 10 && text.match(/^\d{4}-\d{2}-\d{2}$/)) {
      this.versions.add(text);
    }
  }
}

const sourceUrl = "https://rust-lang.github.io/rustup-components-history";
const homepage = "https://github.com/phi-ag/renovate-rust-nightly";

const fetchVersions = async (): Promise<string[]> => {
  const res = await fetch(sourceUrl);
  const handler = new ElementHandler();
  await new HTMLRewriter().on("th", handler).transform(res).arrayBuffer();

  return Array.from(handler.versions);
};

export default {
  async fetch(): Promise<Response> {
    const versions = await fetchVersions();
    const releases = versions.map((version) => ({ version }));

    return Response.json({
      releases,
      sourceUrl,
      homepage
    });
  }
} satisfies ExportedHandler<Env>;
