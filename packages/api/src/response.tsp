// ============================================================
// API Response Types
// ============================================================

import "./common.tsp";
import "./view_model.tsp";

namespace SpecloomApi;

model ListResponse {
  data: ListViewModel;
  pagination: Pagination;
  sort: Sort;
  meta: Meta;
}

model ShowResponse {
  data: ShowViewModel;
  meta: Meta;
}

model FormResponse {
  data: FormViewModel;
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
