export type StrapiImageFormat = {
  url: string;
  width: number;
  height: number;
};

export type StrapiMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
};

export type SocialLinks = {
  website?: string | null;
  facebook?: string | null;
  soundcloud?: string | null;
  bandcamp?: string | null;
  twitter?: string | null;
  ra?: string | null;
  mixcloud?: string | null;
  instagram?: string | null;
};

export type Artist = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  photo?: StrapiMedia | null;
  photoDetail?: StrapiMedia | null;
  socialDescription?: string | null;
  biography?: string | null;
  pressAndInterviews?: string | null;
  mediaEmbed?: string | null;
  booker?: string | null;
  performanceType?: string | null;
  labels?: string | null;
  pressKit?: StrapiMedia | null;
  social?: SocialLinks | null;
  rssFeedUrl?: string | null;
};

export type About = {
  content?: string | null;
};

export type Site = {
  logo?: StrapiMedia | null;
  contact?: string | null;
  facebookPage?: string | null;
  instagramPage?: string | null;
  soundcloudPage?: string | null;
  pageTitle?: string | null;
  socialDescription?: string | null;
  socialImage?: StrapiMedia | null;
  socialUrl?: string | null;
  headerAbout?: string | null;
};

type StrapiListResponse<T> = {
  data: T[];
};

type StrapiSingleResponse<T> = {
  data: T | null;
};

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = process.env.STRAPI_API_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function strapiFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${STRAPI_URL}${path}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      console.warn(`Strapi request failed: ${response.status} ${path}`);
      return null;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.warn(`Strapi unavailable for ${path}`, error);
    return null;
  }
}

const artistPopulate =
  "populate[photo]=true&populate[photoDetail]=true&populate[pressKit]=true&populate[social]=true&sort[0]=name:asc";

export async function getArtists(): Promise<Artist[]> {
  const result = await strapiFetch<StrapiListResponse<Artist>>(
    `/api/artists?${artistPopulate}&pagination[pageSize]=100`,
  );
  return result?.data ?? [];
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const result = await strapiFetch<StrapiListResponse<Artist>>(
    `/api/artists?filters[slug][$eq]=${encodeURIComponent(slug)}&${artistPopulate}`,
  );
  return result?.data[0] ?? null;
}

export async function getAbout(): Promise<About | null> {
  const result = await strapiFetch<StrapiSingleResponse<About>>("/api/about");
  return result?.data ?? null;
}

export async function getSite(): Promise<Site | null> {
  const result = await strapiFetch<StrapiSingleResponse<Site>>(
    "/api/site?populate[logo]=true&populate[socialImage]=true",
  );
  return result?.data ?? null;
}

export function mediaUrl(
  media?: StrapiMedia | null,
  preferredWidth = 800,
): string {
  if (!media?.url) return "";

  const absolute = media.url.startsWith("http")
    ? media.url
    : `${STRAPI_URL}${media.url}`;

  const formats = media.formats;
  if (!formats) return absolute;

  if (preferredWidth <= 500 && formats.small?.url) {
    return formats.small.url.startsWith("http")
      ? formats.small.url
      : `${STRAPI_URL}${formats.small.url}`;
  }

  if (preferredWidth <= 800 && formats.medium?.url) {
    return formats.medium.url.startsWith("http")
      ? formats.medium.url
      : `${STRAPI_URL}${formats.medium.url}`;
  }

  if (formats.large?.url) {
    return formats.large.url.startsWith("http")
      ? formats.large.url
      : `${STRAPI_URL}${formats.large.url}`;
  }

  return absolute;
}

export function bookingMailto(name: string, booker: string): string {
  const subject = `${name} Booking Request`;
  const body = `Thanks for your interest in booking our artist. For a speedy reply, please fill in the complete form below.
Looking forward to your offer!

Booking Offer:

artist: ${name}
name of event:
event website:
past guests:
venue name:
venue address:
venue a website:
date:
proposed line-up and billing:
floors/capacity:
sound/monitoring:
fee offer :
withholding tax Y/N:
entry price:
event sponsors:
set time:
dj before
dj after:
hotel name and address:
`;

  return `mailto:${booker}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
