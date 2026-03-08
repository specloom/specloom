import { describe, expect, it } from "vitest";
import userSpec from "./fixtures/user-spec.json";
import {
  parseExpression,
  resolveFieldState,
  validateField,
  validateForm,
  validateSpec,
  type CompiledField,
  type CompiledSpecV2,
} from "../src/index.js";

describe("validation", () => {
  it("evaluates requiredWhen against current values", () => {
    const spec = createSpec();
    addField(
      spec,
      createScalarField("publishUrl", "Publish URL", {
        rules: {
          requiredWhen: parseExpression("status == 'published'"),
        },
      }),
    );

    expect(
      validateField({
        resource: spec.resources.User,
        fieldName: "publishUrl",
        values: { status: "draft" },
      }),
    ).toEqual([]);

    expect(
      validateField({
        resource: spec.resources.User,
        fieldName: "publishUrl",
        values: { status: "published" },
      }),
    ).toEqual(["Publish URL is required"]);

    expect(
      resolveFieldState({
        field: spec.resources.User.fields.publishUrl,
        values: { status: "published" },
      }).required,
    ).toBe(true);
  });

  it("skips hidden fields during validation", () => {
    const spec = createSpec();
    addField(
      spec,
      createScalarField("internalCode", "Internal Code", {
        type: {
          kind: "scalar",
          name: "string",
          nullable: false,
          array: false,
        },
        ui: {
          visibleIn: {
            list: false,
            show: false,
            form: false,
          },
        },
      }),
    );

    const result = validateForm({
      resource: spec.resources.User,
      values: {},
    });

    expect(result.errors.internalCode).toBeUndefined();
    expect(result.fieldStates.internalCode).toMatchObject({
      visible: false,
      required: true,
    });
  });

  it("skips disabled fields during validation", () => {
    const spec = createSpec();
    addField(
      spec,
      createScalarField("archivedNote", "Archived Note", {
        type: {
          kind: "scalar",
          name: "string",
          nullable: false,
          array: false,
        },
        rules: {
          disabledWhen: parseExpression("status == 'archived'"),
        },
      }),
    );

    const result = validateForm({
      resource: spec.resources.User,
      values: { status: "archived" },
    });

    expect(result.errors.archivedNote).toBeUndefined();
    expect(result.fieldStates.archivedNote).toMatchObject({
      visible: true,
      disabled: true,
      required: true,
    });
  });

  it("treats createOnly fields as readonly in edit mode", () => {
    const spec = createSpec();
    addField(
      spec,
      createScalarField("inviteCode", "Invite Code", {
        type: {
          kind: "scalar",
          name: "string",
          nullable: false,
          array: false,
        },
        createOnly: true,
      }),
    );

    const createResult = validateForm({
      resource: spec.resources.User,
      values: {},
      mode: "create",
    });
    const editResult = validateForm({
      resource: spec.resources.User,
      values: {},
      mode: "edit",
    });

    expect(createResult.errors.inviteCode).toEqual(["Invite Code is required"]);
    expect(editResult.errors.inviteCode).toBeUndefined();
    expect(editResult.fieldStates.inviteCode).toMatchObject({
      visible: true,
      readonly: true,
      required: true,
    });
  });

  it("validates array minItems and maxItems", () => {
    const spec = createSpec();
    addField(
      spec,
      createScalarField("tags", "Tags", {
        type: {
          kind: "scalar",
          name: "string",
          nullable: true,
          array: true,
        },
        validation: {
          minItems: 1,
          maxItems: 2,
        },
      }),
    );

    expect(
      validateField({
        resource: spec.resources.User,
        fieldName: "tags",
        values: { tags: [] },
      }),
    ).toEqual(["Select at least 1 items"]);

    expect(
      validateField({
        resource: spec.resources.User,
        fieldName: "tags",
        values: { tags: ["a", "b", "c"] },
      }),
    ).toEqual(["Select at most 2 items"]);
  });

  it("validates pattern and match rules", () => {
    const spec = createSpec();
    addField(
      spec,
      createScalarField("contactEmail", "Contact Email", {
        validation: {
          pattern: "email",
        },
      }),
    );
    addField(
      spec,
      createScalarField("password", "Password", {
        type: {
          kind: "scalar",
          name: "string",
          nullable: false,
          array: false,
        },
      }),
    );
    addField(
      spec,
      createScalarField("passwordConfirm", "Password Confirm", {
        validation: {
          match: "password",
        },
      }),
    );

    expect(
      validateField({
        resource: spec.resources.User,
        fieldName: "contactEmail",
        values: { contactEmail: "invalid-email" },
      }),
    ).toEqual(["Invalid email address"]);

    expect(
      validateField({
        resource: spec.resources.User,
        fieldName: "passwordConfirm",
        values: {
          password: "secret-1",
          passwordConfirm: "secret-2",
        },
      }),
    ).toEqual(["Must match Password"]);
  });
});

function createSpec(): CompiledSpecV2 {
  return validateSpec(structuredClone(userSpec));
}

function addField(spec: CompiledSpecV2, field: CompiledField): void {
  spec.resources.User.fields[field.name] = field;
}

function createScalarField(
  name: string,
  label: string,
  overrides: FieldOverrides = {},
): CompiledField {
  return {
    name,
    type:
      overrides.type ?? {
        kind: "scalar",
        name: "string",
        nullable: true,
        array: false,
      },
    hidden: overrides.hidden,
    computed: overrides.computed,
    createOnly: overrides.createOnly,
    ui: {
      label,
      visibleIn: {
        list: false,
        show: false,
        form: true,
      },
      ...overrides.ui,
    },
    validation: overrides.validation,
    rules: overrides.rules,
    options: overrides.options,
    optionsSource: overrides.optionsSource,
    filter: overrides.filter,
    relation: overrides.relation,
    nested: overrides.nested,
    submit: overrides.submit ?? {
      field: name,
      shape: "self",
    },
  };
}

type FieldOverrides = Omit<
  Partial<CompiledField>,
  "name" | "type" | "ui" | "submit"
> & {
  type?: CompiledField["type"];
  ui?: Partial<CompiledField["ui"]>;
  submit?: CompiledField["submit"];
};
