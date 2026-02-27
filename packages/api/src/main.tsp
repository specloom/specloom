import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";
import "./common.tsp";
import "./response.tsp";
import "./error.tsp";
import "./endpoints.tsp";

using Http;
using OpenAPI;

@service({
  title: "Specloom Admin API",
})
@server(
  "{baseUrl}/{prefix}",
  "Specloom Admin API Server",
  {
    baseUrl: url = "http://localhost:3000",
    prefix: string = "api",
  }
)
namespace SpecloomApi;
