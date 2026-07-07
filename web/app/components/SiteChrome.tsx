import type { Site } from "../lib/prismic";
import { mediaUrl } from "../lib/prismic";

type HeaderProps = {
  site: Site | null;
};

export function Header({ site }: HeaderProps) {
  return (
    <div className="slogan">
      <div className="logo">
        <a href="/">
          <img
            src={site?.logo ? mediaUrl(site.logo, 300) : ""}
            className="logo"
          />
        </a>
      </div>
      <div className="slogan-hack">
        <div className="container">
          <ul className="social social--header">
            {site?.facebookPage ? (
              <li>
                <a
                  className="socicon-facebook"
                  href={site.facebookPage}
                  target="_blank"
                />
              </li>
            ) : null}
            {site?.instagramPage ? (
              <li>
                <a
                  className="socicon-instagram"
                  href={site.instagramPage}
                  target="_blank"
                />
              </li>
            ) : null}
            {site?.soundcloudPage ? (
              <li>
                <a
                  className="socicon-soundcloud"
                  href={site.soundcloudPage}
                  target="_blank"
                />
              </li>
            ) : null}
          </ul>
          <div className="menu-links">
            <a href="/" className="visit-trigger">
              artists
            </a>
            <a href="/about" className="visit-trigger">
              about
            </a>
            <a href={`mailto:${site?.contact ?? ""}`}>contact</a>
          </div>
        </div>
      </div>
      {site?.headerAbout ? (
        <div
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: site.headerAbout }}
        />
      ) : null}
    </div>
  );
}
