// ============================================================
// Error Types
// ============================================================

import "@typespec/http";
import "./common.tsp";

using Http;

namespace SpecloomApi;

model ErrorDetail {
  /** 表示用エラーメッセージ */
  message: string;

  /** エラー位置（JSON Path 形式: "title", "tags[0].name"） */
  field?: string;

  /** エラー種別（i18n / プログラム判定用） */
  code?: string;

  /** 制限値などのパラメータ（i18n 組み立て用） */
  params?: Record<unknown>;
}

model ErrorBody {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
  meta: Meta;
}

@error
model ValidationError {
  @statusCode statusCode: 422;
  ...ErrorBody;
}

@error
model NotFoundError {
  @statusCode statusCode: 404;
  ...ErrorBody;
}

@error
model ForbiddenError {
  @statusCode statusCode: 403;
  ...ErrorBody;
}

@error
model UnauthorizedError {
  @statusCode statusCode: 401;
  ...ErrorBody;
}

@error
model ConflictError {
  @statusCode statusCode: 409;
  ...ErrorBody;
}

@error
model InternalError {
  @statusCode statusCode: 500;
  ...ErrorBody;
}
