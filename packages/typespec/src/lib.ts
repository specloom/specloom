import { createTypeSpecLibrary, type JSONSchemaType } from "@typespec/compiler";

export interface SpecloomEmitterOptions {
  "output-file"?: string;
}

const EmitterOptionsSchema: JSONSchemaType<SpecloomEmitterOptions> = {
  type: "object",
  additionalProperties: false,
  properties: {
    "output-file": { type: "string", nullable: true },
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
    label: { description: "State for @label decorator" },
    kind: { description: "State for @kind decorator" },
    options: { description: "State for @options decorator" },
    relation: { description: "State for @relation decorator" },
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
    action: { description: "State for @action decorator" },
    rowAction: { description: "State for @rowAction decorator" },
    requiresSelection: {
      description: "State for @requiresSelection decorator",
    },
    allowedWhen: { description: "State for @allowedWhen decorator" },
    confirm: { description: "State for @confirm decorator" },
    dialog: { description: "State for @dialog decorator" },
    api: { description: "State for @api decorator" },
    match: { description: "State for @match decorator" },
    // Validation decorators
    required: { description: "State for @required decorator" },
    minLength: { description: "State for @minLength decorator" },
    maxLength: { description: "State for @maxLength decorator" },
    min: { description: "State for @min decorator" },
    max: { description: "State for @max decorator" },
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
