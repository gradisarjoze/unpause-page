/**
 * Normalize a pathname to the public clean URL.
 * Strips `.html` / `index.html` and trailing slashes (except `/`).
 *
 * Drop this into the live Astro layout as:
 *   const canonical = publicUrl(Astro.site, Astro.url.pathname);
 * alongside:
 *   site: 'https://getunpause.com'
 *   trailingSlash: 'never'
 *   build.format: 'directory'  // optional; helper is correct even if files stay `*.html`
 */
export function publicUrl(site, pathname = "/") {
  const origin = typeof site === "string" ? site : site?.href ?? site?.origin;
  if (!origin) {
    throw new Error("publicUrl requires a site origin");
  }

  let path = String(pathname || "/");
  try {
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)) {
      path = new URL(path).pathname;
    }
  } catch {
    // keep path as given
  }

  path = path.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");
  if (!path.startsWith("/")) path = `/${path}`;
  if (path === "/index") path = "/";
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

  const base = origin.endsWith("/") ? origin : `${origin}/`;
  return new URL(path === "/" ? "/" : path.replace(/^\//, ""), base).href;
}
