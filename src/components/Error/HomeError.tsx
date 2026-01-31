import { useRouteError, isRouteErrorResponse } from "react-router";

export function HomeError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Error {error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    );
  }

  if (error instanceof Error) {
    return <p>{error.message}</p>;
  }

  return <p>Unknown error</p>;
}
