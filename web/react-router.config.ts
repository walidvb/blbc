import { vercelPreset } from "@vercel/react-router/vite";
import type { Config } from "@react-router/dev/config";
import { getArtists } from "./app/lib/prismic";

export default {
  ssr: true,
  presets: [vercelPreset()],
  async prerender({ getStaticPaths }) {
    try {
      const artists = await getArtists();
      return [
        ...getStaticPaths(),
        ...artists.map((artist) => `/artists/${artist.slug}`),
      ];
    } catch {
      return getStaticPaths();
    }
  },
} satisfies Config;
