export { $lib } from "./lib.js";
export * from "./decorators.js";
export { $onEmit } from "./emitter.js";
export * from "./expression.js";

export const namespace = "Specloom";

import {
  $action,
  $computed,
  $createOnly,
  $disabledWhen,
  $entity,
  $field,
  $formView,
  $hidden,
  $listView,
  $match,
  $nested,
  $optionSource,
  $options,
  $readonlyWhen,
  $relation,
  $requiredWhen,
  $rule,
  $section,
  $showView,
  $visibleWhen,
} from "./decorators.js";

export const $decorators = {
  Specloom: {
    entity: $entity,
    field: $field,
    listView: $listView,
    showView: $showView,
    formView: $formView,
    relation: $relation,
    nested: $nested,
    section: $section,
    hidden: $hidden,
    computed: $computed,
    createOnly: $createOnly,
    options: $options,
    optionSource: $optionSource,
    action: $action,
    visibleWhen: $visibleWhen,
    requiredWhen: $requiredWhen,
    readonlyWhen: $readonlyWhen,
    disabledWhen: $disabledWhen,
    match: $match,
    rule: $rule,
  },
};
