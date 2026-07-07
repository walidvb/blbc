import type { Route } from "./+types/artists.$slug";
import { BaseHead } from "../components/BaseHead";
import { Footer } from "../components/Footer";
import { RssFeed } from "../components/RssFeed";
import { Header } from "../components/SiteChrome";
import { cacheHeaders } from "../lib/cache";
import {
  bookingMailto,
  getArtistBySlug,
  getSite,
  mediaUrl,
} from "../lib/strapi";

export function headers() {
  return cacheHeaders();
}

export async function loader({ params }: Route.LoaderArgs) {
  const [artist, site] = await Promise.all([
    getArtistBySlug(params.slug),
    getSite(),
  ]);

  if (!artist) {
    throw new Response("Not Found", { status: 404 });
  }

  return { artist, site };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { artist } = loaderData;
  return [
    { title: `BLBC | ${artist.name}` },
    { property: "og:title", content: `BLBC | ${artist.name}` },
    {
      property: "og:description",
      content: artist.socialDescription ?? "",
    },
    {
      property: "og:image",
      content: mediaUrl(artist.photoDetail, 1000),
    },
    { property: "og:site_name", content: artist.name },
  ];
}

export const handle = { bodyClass: "long" };

export default function ArtistPage({ loaderData }: Route.ComponentProps) {
  const { artist, site } = loaderData;
  const photoSrc = mediaUrl(artist.photoDetail, 1000);
  const pressKitUrl = mediaUrl(artist.pressKit);
  const social = artist.social;

  return (
    <>
      <BaseHead />
      <Header site={site} />
      <main id="artist" className="bio ">
        <div className="fade-up delayer">
          <div className="bio-content">
            <div>
              <div className="hidden-xs picture fade-up delayer">
                <img src={photoSrc} />
              </div>
              <h1 className="hidden-xs artist-name">{artist.name}</h1>
              {artist.biography ? (
                <div
                  style={{ display: "contents" }}
                  dangerouslySetInnerHTML={{ __html: artist.biography }}
                />
              ) : null}
              {artist.pressAndInterviews ? (
                <div className="press">
                  <div className="label mt-4">Press & Interviews</div>
                  <div
                    style={{ display: "contents" }}
                    dangerouslySetInnerHTML={{
                      __html: artist.pressAndInterviews,
                    }}
                  />
                </div>
              ) : null}
              {artist.mediaEmbed ? (
                <div
                  className="medias"
                  dangerouslySetInnerHTML={{ __html: artist.mediaEmbed }}
                />
              ) : null}
            </div>
            <div className="links">
              {artist.booker ? (
                <>
                  <div className="label">Agent</div>
                  <a href={`mailto:${artist.booker}`}>{artist.booker}</a>
                </>
              ) : null}
              {artist.performanceType ? (
                <>
                  <div className="label">Performance Type</div>
                  {artist.performanceType}
                </>
              ) : null}
              {artist.labels ? (
                <>
                  <div className="label">Labels</div>
                  {artist.labels}
                </>
              ) : null}
              {pressKitUrl ? (
                <div className="press-kit">
                  <a href={pressKitUrl}>PRESS KIT</a>
                </div>
              ) : null}
              <div className="label">Social</div>
              <ul className="social">
                {social?.website ? (
                  <li>
                    <a
                      href={social.website}
                      target="_blank"
                      className="socicon-internet"
                      title="homepage"
                    >
                      &nbsp;
                    </a>
                  </li>
                ) : null}
                {social?.facebook ? (
                  <li>
                    <a
                      href={social.facebook}
                      target="_blank"
                      className="socicon-facebook"
                      title="facebook"
                    />
                  </li>
                ) : null}
                {social?.soundcloud ? (
                  <li>
                    <a
                      href={social.soundcloud}
                      target="_blank"
                      className="socicon-soundcloud"
                    />
                  </li>
                ) : null}
                {social?.bandcamp ? (
                  <li>
                    <a
                      href={social.bandcamp}
                      target="_blank"
                      className="socicon-bandcamp"
                    />
                  </li>
                ) : null}
                {social?.twitter ? (
                  <li>
                    <a
                      href={social.twitter}
                      target="_blank"
                      className="socicon-twitter"
                    />
                  </li>
                ) : null}
                {social?.ra ? (
                  <li>
                    <a
                      href={social.ra}
                      target="_blank"
                      className="socicon-residentadvisor"
                    />
                  </li>
                ) : null}
                {social?.mixcloud ? (
                  <li>
                    <a
                      href={social.mixcloud}
                      target="_blank"
                      className="socicon-mixcloud"
                    />
                  </li>
                ) : null}
                {social?.instagram ? (
                  <li>
                    <a
                      href={social.instagram}
                      target="_blank"
                      className="socicon-instagram"
                    />
                  </li>
                ) : null}
              </ul>
              <div className="press-kit">
                <a href={bookingMailto(artist.name, artist.booker ?? "")}>
                  BOOK {artist.name}
                </a>
              </div>
              {artist.rssFeedUrl ? (
                <div className="gigs-container">
                  <div className="label" style={{ marginBottom: "1rem" }}>
                    Upcoming events
                  </div>
                  <RssFeed url={artist.rssFeedUrl} />
                </div>
              ) : null}
            </div>
            <h1 className="visible-xs">
              <span className="artist-name">{artist.name}</span>
            </h1>
            <div className="visible-xs picture fade-up delayer">
              <img src={photoSrc} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
