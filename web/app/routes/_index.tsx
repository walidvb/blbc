import type { Route } from "./+types/_index";
import { BaseHead } from "../components/BaseHead";
import { Footer } from "../components/Footer";
import { Header } from "../components/SiteChrome";
import { cacheHeaders } from "../lib/cache";
import { getArtists, getSite, mediaUrl } from "../lib/prismic";

export function headers() {
  return cacheHeaders();
}

export async function loader() {
  const [artists, site] = await Promise.all([getArtists(), getSite()]);
  return { artists, site };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { site } = loaderData;
  const title = site?.pageTitle ?? "";
  const description = site?.socialDescription ?? "";
  const image = site?.socialImage ? mediaUrl(site.socialImage, 1000) : "";

  return [
    { title },
    ...(site?.socialUrl
      ? [{ property: "og:url", content: site.socialUrl }]
      : []),
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:title", content: title },
    { property: "og:site_name", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
  ];
}

export const handle = { bodyClass: "home" };

export default function Home({ loaderData }: Route.ComponentProps) {
  const { artists, site } = loaderData;

  return (
    <>
      <BaseHead />
      <Header site={site} />
      <ul className="container artists-list" id="artists">
        {artists.map((artist) => (
          <li key={artist.documentId} className="artist-wrapper delayer">
            <a
              href={`/artists/${artist.slug}`}
              className="name-wrapper visit-trigger delayed fade-up"
            >
              <h2 className="artist-name">{artist.name}</h2>
            </a>
            <div className="photo up">
              <img src={`${mediaUrl(artist.photo, 800)}?w=800`} />
            </div>
          </li>
        ))}
      </ul>
      <Footer />
    </>
  );
}
