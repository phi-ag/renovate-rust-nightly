class ElementHandler {
  versions = new Set();

  text({ text }: { text: string }) {
    if (text.length === 10 && text.match(/\d{4}-\d{2}-\d{2}/)) {
      this.versions.add(text);
    }
  }
}

const sourceUrl = "https://rust-lang.github.io/rustup-components-history";
const homepage = "https://github.com/phi-ag/renovate-rust-nightly";

export default {
  async fetch(): Promise<Response> {
    const res = await fetch(sourceUrl);

    const handler = new ElementHandler();
    await new HTMLRewriter().on("th", handler).transform(res).arrayBuffer();

    return Response.json({
      releases: Array.from(handler.versions).map((version) => ({ version })),
      sourceUrl,
      homepage
    });
  }
} satisfies ExportedHandler<Env>;
