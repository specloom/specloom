export { $lib } from "./lib.js";
export * from "./decorators.js";
export { $onEmit } from "./emitter.js";
export * from "./expression.js";

export const namespace = "Specloom.V2";

import {
  $computed,
  $createOnly,
  $disabledWhen,
  $entity,
  $field,
  $filter,
  $hidden,
  $index,
  $match,
  $namedFilter,
  $nested,
  $optionSource,
  $options,
  $pageAction,
  $readonlyWhen,
  $relation,
  $requiredWhen,
  $rowAction,
  $rule,
  $section,
  $visibleWhen,
} from "./decorators.js";

export const $decorators = {
  "Specloom.V2": {
    entity: $entity,
    field: $field,
    index: $index,
    filter: $filter,
    namedFilter: $namedFilter,
    relation: $relation,
    nested: $nested,
    section: $section,
    hidden: $hidden,
    computed: $computed,
    createOnly: $createOnly,
    options: $options,
    optionSource: $optionSource,
    pageAction: $pageAction,
    rowAction: $rowAction,
    visibleWhen: $visibleWhen,
    requiredWhen: $requiredWhen,
    readonlyWhen: $readonlyWhen,
    disabledWhen: $disabledWhen,
    match: $match,
    rule: $rule,
  },
};
