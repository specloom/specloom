// ============================================================
// API Response Types
// ============================================================

import "./common.tsp";

namespace SpecloomApi;

model ListResponse {
  data: Record<unknown>[];
  pagination: Pagination;
  sort: Sort;
  meta: Meta;
}

model ShowResponse {
  data: Record<unknown>;
  meta: Meta;
}

model SaveResponse {
  data: {
    id: string;
    ...Record<unknown>;
  };
  meta: Meta;
}

model ActionResponse {
  data: {
    success: boolean;
    message?: string;
  };
  meta: Meta;
}

model BulkActionResult {
  id: string;
  success: boolean;
  error?: string;
}

model BulkActionResponse {
  data: {
    success_count: int32;
    failure_count: int32;
    results: BulkActionResult[];
  };
  meta: Meta;
}
