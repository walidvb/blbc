import * as prismic from "@prismicio/client";
import type {
  EmbedField,
  GroupField,
  ImageField,
  LinkField,
  RichTextField,
} from "@prismicio/client";

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
  id: string;
  documentId: string;
  name: string;
  slug: string;
  photo?: ImageField | null;
  photoDetail?: ImageField | null;
  socialDescription?: string | null;
  biography?: string | null;
  pressAndInterviews?: string | null;
  media: string[];
  booker?: string | null;
  performanceType?: string | null;
  labels?: string | null;
  pressKit?: LinkField | null;
  social?: SocialLinks | null;
  rssFeedUrl?: string | null;
};

export type About = {
  content?: string | null;
};

export type Site = {
  logo?: ImageField | null;
  contact?: string | null;
  facebookPage?: string | null;
  instagramPage?: string | null;
  soundcloudPage?: string | null;
  pageTitle?: string | null;
  socialDescription?: string | null;
  socialImage?: ImageField | null;
  socialUrl?: string | null;
  headerAbout?: string | null;
};

type ArtistDocument = prismic.PrismicDocumentWithUID<{
  name: prismic.KeyTextField;
  photo: ImageField;
  photo_detail: ImageField;
  social_description: prismic.KeyTextField;
  biography: RichTextField;
  press_and_interviews: RichTextField;
  media1: GroupField<{
    media_embed: EmbedField;
  }>;
  booker: prismic.KeyTextField;
  performance_type: prismic.KeyTextField;
  labels: prismic.KeyTextField;
  press_kit: LinkField;
  rss_feed_url: prismic.KeyTextField;
  website: LinkField;
  facebook: LinkField;
  soundcloud: LinkField;
  bandcamp: LinkField;
  twitter: LinkField;
  ra: LinkField;
  mixcloud: LinkField;
  instagram: LinkField;
}>;

type AboutDocument = prismic.PrismicDocument<{
  content: RichTextField;
}>;

type SiteDocument = prismic.PrismicDocument<{
  logo: ImageField;
  contact: prismic.KeyTextField;
  facebook_page: LinkField;
  instagram_page: LinkField;
  soundcloud_page: LinkField;
  page_title: prismic.KeyTextField;
  social_description: prismic.KeyTextField;
  social_image: ImageField;
  social_url: LinkField;
  header_about: RichTextField;
}>;

const repository = process.env.PRISMIC_REPOSITORY ?? "";

let client: ReturnType<typeof prismic.createClient> | null = null;

function getClient() {
  if (!repository) return null;
  if (!client) {
    client = prismic.createClient(repository, {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    });
  }
  return client;
}

function linkUrl(link?: LinkField | null): string | null {
  return prismic.isFilled.link(link) ? (link.url ?? null) : null;
}

function richTextHtml(field?: RichTextField | null): string | null {
  if (!prismic.isFilled.richText(field)) return null;
  return prismic.asHTML(field) || null;
}

function mapMediaEmbeds(
  items?: GroupField<{
    media_embed: EmbedField;
  }>,
): string[] {
  if (!prismic.isFilled.group(items)) return [];

  return items.flatMap((item) => {
    if (!prismic.isFilled.embed(item.media_embed) || !item.media_embed.html) {
      return [];
    }
    return [item.media_embed.html];
  });
}

function mapArtist(doc: ArtistDocument): Artist {
  const data = doc.data;

  return {
    id: doc.id,
    documentId: doc.id,
    name: data.name ?? "",
    slug: doc.uid ?? "",
    photo: data.photo,
    photoDetail: data.photo_detail,
    socialDescription: data.social_description,
    biography: richTextHtml(data.biography),
    pressAndInterviews: richTextHtml(data.press_and_interviews),
    media: mapMediaEmbeds(data.media1),
    booker: data.booker,
    performanceType: data.performance_type,
    labels: data.labels,
    pressKit: data.press_kit,
    social: {
      website: data.website ?? null,
      facebook: data.facebook ?? null,
      soundcloud: data.soundcloud ?? null,
      bandcamp: data.bandcamp ?? null,
      twitter: data.twitter ?? null,
      ra: data.ra ?? null,
      mixcloud: data.mixcloud ?? null,
      instagram: data.instagram ?? null,
    },
    rssFeedUrl: data.rss_feed_url,
  };
}

function mapAbout(doc: AboutDocument): About {
  return {
    content: richTextHtml(doc.data.content),
  };
}

function mapSite(doc: SiteDocument): Site {
  const data = doc.data;

  return {
    logo: data.logo,
    contact: data.contact,
    facebookPage: linkUrl(data.facebook_page),
    instagramPage: linkUrl(data.instagram_page),
    soundcloudPage: linkUrl(data.soundcloud_page),
    pageTitle: data.page_title,
    socialDescription: data.social_description,
    socialImage: data.social_image,
    socialUrl: linkUrl(data.social_url),
    headerAbout: richTextHtml(data.header_about),
  };
}

export async function getArtists(): Promise<Artist[]> {
  const prismicClient = getClient();
  if (!prismicClient) return [];

  try {
    const docs = await prismicClient.getAllByType("artist", {
      orderings: [{ field: "my.artist.name", direction: "asc" }],
    });
    return docs.map((doc) => mapArtist(doc as ArtistDocument));
  } catch (error) {
    console.warn("Prismic unavailable for artists", error);
    return [];
  }
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const prismicClient = getClient();
  if (!prismicClient) return null;

  try {
    const doc = await prismicClient.getByUID("artist", slug);
    return mapArtist(doc as ArtistDocument);
  } catch (error) {
    if (error instanceof prismic.NotFoundError) return null;
    console.warn(`Prismic unavailable for artist ${slug}`, error);
    return null;
  }
}

export async function getAbout(): Promise<About | null> {
  const prismicClient = getClient();
  if (!prismicClient) return null;

  try {
    const doc = await prismicClient.getSingle("about");
    return mapAbout(doc as AboutDocument);
  } catch (error) {
    if (error instanceof prismic.NotFoundError) return null;
    console.warn("Prismic unavailable for about", error);
    return null;
  }
}

export async function getSite(): Promise<Site | null> {
  const prismicClient = getClient();
  if (!prismicClient) return null;

  try {
    const doc = await prismicClient.getSingle("site");
    return mapSite(doc as SiteDocument);
  } catch (error) {
    if (error instanceof prismic.NotFoundError) return null;
    console.warn("Prismic unavailable for site", error);
    return null;
  }
}

export function mediaUrl(
  media?: ImageField | LinkField | null,
  preferredWidth = 800,
): string {
  if (!media) return "";

  if ("link_type" in media) {
    if (prismic.isFilled.link(media) && media.link_type === "Media") {
      return media.url;
    }
    return "";
  }

  if (prismic.isFilled.image(media)) {
    const url = new URL(media.url);
    url.searchParams.set("w", String(preferredWidth));
    return url.toString();
  }

  return "";
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
