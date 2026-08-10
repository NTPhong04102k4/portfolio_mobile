import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

/**
 * Rendered when a route (or the layout itself) throws. Sits outside
 * `RootLayout`, so it must not depend on any app provider — an error inside
 * `ThemeProvider`/`I18nProvider` would otherwise re-throw here.
 */
export function RouteErrorPage() {
  const error = useRouteError();

  let detail = 'Unknown error';
  if (isRouteErrorResponse(error)) {
    detail = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <div className="route-fallback route-fallback--standalone">
      <p className="route-fallback__code">!</p>
      <h2 className="route-fallback__title">Something went wrong</h2>
      <code className="route-fallback__path">{detail}</code>
      <a href="/" className="route-fallback__link">
        ← Back to home
      </a>
    </div>
  );
}
