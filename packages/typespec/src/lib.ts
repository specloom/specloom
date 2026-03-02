import { createTypeSpecLibrary, type JSONSchemaType } from "@typespec/compiler";

export interface SpecloomEmitterOptions {
  "output-file"?: string;
  "output-dir"?: string;
}

const EmitterOptionsSchema: JSONSchemaType<SpecloomEmitterOptions> = {
  type: "object",
  additionalProperties: false,
  properties: {
    "output-file": { type: "string", nullable: true },
    "output-dir": { type: "string", nullable: true },
  },
  required: [],
};

export const $lib = createTypeSpecLibrary({
  name: "@specloom/typespec",
  diagnostics: {},
  emitter: {
    options: EmitterOptionsSchema,
  },
  state: {
    resource: { description: "State for @resource decorator" },
    requiredOneOf: { description: "State for @requiredOneOf decorator" },
    label: { description: "State for @label decorator" },
    kind: { description: "State for @kind decorator" },
    options: { description: "State for @options decorator" },
    relation: { description: "State for @relation decorator" },
    nested: { description: "State for @nested decorator" },
    cardinality: { description: "State for @cardinality decorator" },
    ui: { description: "State for @ui decorator" },
    readonly: { description: "State for @readonly decorator" },
    computed: { description: "State for @computed decorator" },
    createOnly: { description: "State for @createOnly decorator" },
    filter: { description: "State for @filter decorator" },
    view: { description: "State for @view decorator" },
    columns: { description: "State for @columns decorator" },
    fields: { description: "State for @fields decorator" },
    searchable: { description: "State for @searchable decorator" },
    sortable: { description: "State for @sortable decorator" },
    defaultSort: { description: "State for @defaultSort decorator" },
    clickAction: { description: "State for @clickAction decorator" },
    selection: { description: "State for @selection decorator" },
    namedFilters: { description: "State for @namedFilters decorator" },
    viewActions: { description: "State for @action decorator (Model target)" },
    viewRowActions: { description: "State for @rowAction decorator (Model target)" },
    visibleWhen: { description: "State for @visibleWhen decorator" },
    requiredWhen: { description: "State for @requiredWhen decorator" },
    match: { description: "State for @match decorator" },
    // Validation decorators
    required: { description: "State for @required decorator" },
    min: { description: "State for @min decorator" },
    max: { description: "State for @max decorator" },
    minLength: { description: "State for @minLength decorator" },
    maxLength: { description: "State for @maxLength decorator" },
    pattern: { description: "State for @pattern decorator" },
    minItems: { description: "State for @minItems decorator" },
    maxItems: { description: "State for @maxItems decorator" },
  },
});

export const {
  reportDiagnostic,
  createDiagnostic,
  stateKeys: StateKeys,
} = $lib;
