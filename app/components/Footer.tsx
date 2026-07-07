import { useEffect } from "react";

function appendScript(
  src: string,
  attributes: Record<string, string> = {},
  inline?: string,
) {
  if (src) {
    if (document.querySelector(`script[src="${src}"]`)) return;
  } else if (inline && document.getElementById("blbc-gtag")) {
    return;
  }

  const script = document.createElement("script");
  if (src) script.src = src;
  if (inline) {
    script.id = "blbc-gtag";
    script.textContent = inline;
  }
  for (const [key, value] of Object.entries(attributes)) {
    script.setAttribute(key, value);
  }
  document.body.appendChild(script);
}

export function Footer() {
  useEffect(() => {
    appendScript("/javascripts/site.js");
    appendScript("//instant.page/1.2.1", {
      type: "module",
      integrity:
        "sha384-/IkE5iZAM/RxPto8B0nvKlMzIyCWtYocF01PbGGp1qElJuxv9J4whdWBRtzZltWn",
    });
    appendScript("https://www.googletagmanager.com/gtag/js?id=UA-27024782-31", {
      async: "true",
    });
    appendScript(
      "",
      {},
      `window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-27024782-31');`,
    );
  }, []);

  return null;
}
