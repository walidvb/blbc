import type { Route } from "./+types/about";
import { BaseHead } from "../components/BaseHead";
import { Header } from "../components/SiteChrome";
import { cacheHeaders } from "../lib/cache";
import { getAbout, getSite } from "../lib/strapi";

export function headers() {
  return cacheHeaders();
}

export async function loader() {
  const [about, site] = await Promise.all([getAbout(), getSite()]);
  return { about, site };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData.site?.pageTitle ?? "";
  return [
    { title },
    ...(loaderData.site?.socialUrl
      ? [{ property: "og:url", content: loaderData.site.socialUrl }]
      : []),
  ];
}

export const handle = { bodyClass: "long" };

export default function AboutPage({ loaderData }: Route.ComponentProps) {
  const { about, site } = loaderData;

  return (
    <>
      <BaseHead />
      <Header site={site} />
      <main className="fade-up">
        <div className="body-container">
          {about?.content ? (
            <div
              style={{ display: "contents" }}
              dangerouslySetInnerHTML={{ __html: about.content }}
            />
          ) : null}
        </div>
      </main>
      <div className="container mx-auto">
        <div className="credits">
          website: <a href="http://walidvb.com">walidvb</a>
        </div>
      </div>
    </>
  );
}
