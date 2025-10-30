interface Release {
  version: string;
  releaseTimestamp: Date;
}

class ElementHandler {
  readonly releases: Release[] = [];
  readonly #versionRegex = new RegExp(/^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/);

  text({ text }: { text: string }) {
    if (text.length === 10) {
      const releaseDate = this.#versionRegex.exec(text)?.groups;
      if (releaseDate && releaseDate.year && releaseDate.month && releaseDate.day) {
        const year = parseInt(releaseDate.year);
        const month = parseInt(releaseDate.month);
        const day = parseInt(releaseDate.day);

        this.releases.push({
          version: text,
          releaseTimestamp: new Date(Date.UTC(year, month - 1, day))
        });
      }
    }
  }
}

const sourceUrl = "https://rust-lang.github.io/rustup-components-history";
const homepage = "https://github.com/phi-ag/renovate-rust-nightly";

const fetchReleases = async (): Promise<Release[]> => {
  const res = await fetch(sourceUrl);
  const handler = new ElementHandler();
  await new HTMLRewriter().on("th", handler).transform(res).arrayBuffer();

  return handler.releases;
};

export default {
  async fetch(): Promise<Response> {
    const releases = await fetchReleases();

    return Response.json({
      releases,
      sourceUrl,
      homepage
    });
  }
} as ExportedHandler<Env>;
