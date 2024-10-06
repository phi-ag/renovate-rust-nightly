class ElementHandler {
  readonly versions = new Set<string>();
  readonly #versionRegex = new RegExp(/^\d{4}-\d{2}-\d{2}$/);

  text({ text }: { text: string }) {
    if (text.length === 10 && this.#versionRegex.test(text)) {
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
} as ExportedHandler<Env>;
