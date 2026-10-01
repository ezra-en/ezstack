import { httpRouter } from "convex/server";
import { authComponent, createAuth, getAllowedOrigins } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth, {
  cors: {
    allowedOrigins: getAllowedOrigins(),
  },
});

export default http;
