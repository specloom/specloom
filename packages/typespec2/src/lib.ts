import { createTypeSpecLibrary, type JSONSchemaType } from "@typespec/compiler";

export interface SpecloomV2EmitterOptions {
  "output-file"?: string;
}

const EmitterOptionsSchema: JSONSchemaType<SpecloomV2EmitterOptions> = {
  type: "object",
  additionalProperties: false,
  properties: {
    "output-file": { type: "string", nullable: true },
  },
  required: [],
};

export const $lib = createTypeSpecLibrary({
  name: "@specloom/typespec2",
  diagnostics: {},
  emitter: {
    options: EmitterOptionsSchema,
  },
  state: {
    entity: { description: "State for @entity decorator" },
    field: { description: "State for @field decorator" },
    index: { description: "State for @index decorator" },
    filter: { description: "State for @filter decorator" },
    namedFilter: { description: "State for @namedFilter decorator" },
    relation: { description: "State for @relation decorator" },
    nested: { description: "State for @nested decorator" },
    section: { description: "State for @section decorator" },
    hidden: { description: "State for @hidden decorator" },
    computed: { description: "State for @computed decorator" },
    createOnly: { description: "State for @createOnly decorator" },
    options: { description: "State for @options decorator" },
    optionSource: { description: "State for @optionSource decorator" },
    pageAction: { description: "State for @pageAction decorator" },
    rowAction: { description: "State for @rowAction decorator" },
    visibleWhen: { description: "State for @visibleWhen decorator" },
    requiredWhen: { description: "State for @requiredWhen decorator" },
    readonlyWhen: { description: "State for @readonlyWhen decorator" },
    disabledWhen: { description: "State for @disabledWhen decorator" },
    match: { description: "State for @match decorator" },
    rule: { description: "State for @rule decorator" },
  },
});

export const {
  reportDiagnostic,
  createDiagnostic,
  stateKeys: StateKeys,
} = $lib;
