/**
 * URLs for files served straight out of `public/`.
 *
 * Vite rewrites asset URLs it can see at build time, but a bare string literal
 * in JSX is invisible to it — so BASE_URL is applied by hand here. That keeps
 * the links correct when the site is deployed under a sub-path, e.g.
 * `VITE_BASE_URL=/portfolio/` for a GitHub Pages project site.
 */

/** BASE_URL always carries a trailing slash, so plain concatenation is safe. */
const fromPublic = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`

/** Requires the real PDF to be placed at `public/cv-phong-react-native.pdf`. */
export const CV_PDF_URL = fromPublic('public/Mobile_Developer_Nguyen_The_phong.pdf')
