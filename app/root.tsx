import { useMatches } from "react-router";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";

import "../stylesheets/global.css";

type RouteHandle = {
  bodyClass?: string;
};

export const links: Route.LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const bodyClass =
    [...matches]
      .reverse()
      .map((match) => (match.handle as RouteHandle | undefined)?.bodyClass)
      .find(Boolean) ?? "";

  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body className={bodyClass}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "404";
  let details = "The requested page could not be found.";

  if (isRouteErrorResponse(error) && error.status !== 404) {
    message = "Error";
    details = error.statusText || details;
  }

  return (
    <main className="fade-up">
      <div className="body-container">
        <h1>{message}</h1>
        <p>{details}</p>
      </div>
    </main>
  );
}
