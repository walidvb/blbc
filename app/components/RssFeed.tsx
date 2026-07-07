import { useEffect } from "react";

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

type RssItem = {
  link?: string;
  "ev:startdate"?: string;
  "ev:location"?: string;
  "ev:country"?: string;
  "ev:name"?: string;
};

function formatDate(date: string) {
  const dd = new Date(date);
  const day = dd.toLocaleDateString("en-UK", { weekday: "long" });
  return `${day}, ${dd.getDate()}.${dd.getMonth() + 1}.${dd.getFullYear()}`;
}

function entryAsHtml(item: RssItem) {
  return `
    <div class="gig">
      <div class="gig-date">${formatDate(item["ev:startdate"] ?? "")}</div>
      <div class="gig-name"><a href="${item.link}" target="_blank">${item["ev:name"]}</a></div>
      <div class="gig-location">${item["ev:location"]}, ${item["ev:country"]}</div>
    </div>
  `;
}

export function RssFeed({ url }: { url: string }) {
  useEffect(() => {
    const container = document.querySelector<HTMLElement>("[data-rss]");
    if (!container) return;

    import("rss-parser-browser").then(({ default: Parser }) => {
      const parser = new Parser({
        customFields: {
          item: ["ev:startdate", "ev:location", "ev:country", "ev:name"],
        },
      });

      parser.parseURL(CORS_PROXY + url, {}, (err, parsed) => {
        if (err) {
          console.log(err);
          return;
        }

        const entries = (parsed as { feed: { entries: RssItem[] } }).feed
          .entries;
        container.innerHTML = entries
          .slice()
          .reverse()
          .map(entryAsHtml)
          .join("");
      });
    });
  }, [url]);

  return <div data-rss={url}>LOADING...</div>;
}
