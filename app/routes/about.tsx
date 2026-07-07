import type { Route } from "./+types/about";
import { BaseHead } from "../components/BaseHead";
import { Header } from "../components/SiteChrome";
import { cacheHeaders } from "../lib/cache";
import { getSite } from "../lib/prismic";

export function headers() {
  return cacheHeaders();
}

export async function loader() {
  const site = await getSite();
  return { site };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const title = loaderData.site?.pageTitle ?? "";
  return [
    { title },
    ...(loaderData.site?.socialUrl
      ? [
          {
            property: 'og:url',
            content: loaderData.site.socialUrl || process.env.NEXT_PUBLIC_URL,
          },
        ]
      : []),
  ]
}

export const handle = { bodyClass: "long" };

export default function AboutPage({ loaderData }: Route.ComponentProps) {
  const { site } = loaderData;

  return (
    <>
      <BaseHead />
      <Header site={site} />
      <main className="fade-up">
        <div className="body-container">
          {site?.content ? (
            <div
              style={{ display: 'contents' }}
              dangerouslySetInnerHTML={{ __html: site.content }}
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
  )
}
