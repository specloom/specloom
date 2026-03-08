export class LoaderError extends Error {
  override name = "LoaderError";
}

export class ResolverError extends Error {
  override name = "ResolverError";
}

export class EvaluatorError extends Error {
  override name = "EvaluatorError";
}
