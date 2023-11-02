import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 401) {
    return (
      <div>
        <h1>{error.status}</h1>
        <h2>{error.data.message}</h2>
      </div>
    );
  }
  return (
    <div>
      <h1>Ada Kendala Sistem!</h1>
      <h2>Mohon maaf sedang ada kendala dengan sistem kami</h2>
    </div>
  );
};

export default Error;
