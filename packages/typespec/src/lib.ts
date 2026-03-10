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
    entity: { description: "State for @entity decorator" },
    field: { description: "State for @field decorator" },
    listView: { description: "State for @listView decorator" },
    showView: { description: "State for @showView decorator" },
    formView: { description: "State for @formView decorator" },
    relation: { description: "State for @relation decorator" },
    nested: { description: "State for @nested decorator" },
    section: { description: "State for @section decorator" },
    hidden: { description: "State for @hidden decorator" },
    computed: { description: "State for @computed decorator" },
    createOnly: { description: "State for @createOnly decorator" },
    options: { description: "State for @options decorator" },
    optionSource: { description: "State for @optionSource decorator" },
    action: { description: "State for @action decorator" },
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
