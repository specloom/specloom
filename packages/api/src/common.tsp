// ============================================================
// Common Types
// ============================================================

namespace SpecloomApi;

model Pagination {
  page: int32;
  per_page: int32;
  total: int32;
  total_pages: int32;
}

model Sort {
  field: string;
  order: "asc" | "desc";
}

model Meta {
  timestamp: utcDateTime;
}

model Option {
  value: string;
  label: string;
}

model FieldUI {
  hint?: string;
  input_hint?: string;
  searchable?: boolean;
}

model ActionUI {
  icon?: string;
  variant?: string;
}

model Validation {
  required?: boolean;
  min_length?: int32;
  max_length?: int32;
  min?: float64;
  max?: float64;
  pattern?: string;
  min_items?: int32;
  max_items?: int32;
}
