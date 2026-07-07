import { redirectDocument } from "react-router";

const PRISMIC_ARTIST_BUILDER =
  "https://blbc.prismic.io/builder/working?customTypes=artist";

export function loader() {
  return redirectDocument(PRISMIC_ARTIST_BUILDER);
}

export default function AdminRedirect() {
  return null;
}
