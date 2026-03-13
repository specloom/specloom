import { describe, expect, it } from "vitest";
import userSpec from "./fixtures/user-spec.json";
import {
  createFormVM,
  createListVM,
  createUiResolver,
  getResource,
  resolveFieldPresentation,
  validateSpec,
  type CompiledSpec,
  type FormFieldVM,
  type ListFieldVM,
  type UiConfig,
} from "../src/index.js";

describe("ui resolver", () => {
  it("uses field.ui.widget when present", () => {
    const spec = createSpec();
    spec.resources.User.fields.email.ui.widget = "email-field";

    const field = getFormField(spec, "email");
    const presentation = resolveFieldPresentation({
      resource: spec.resources.User,
      field,
      view: "form",
    });

    expect(presentation.renderer).toBe("email-field");
    expect(presentation.source.renderer).toBe("field-ui.widget");
  });

  it("prefers view and resource overrides over spec widget", () => {
    const spec = createSpec();
    spec.resources.User.fields.email.ui.widget = "email-field";

    const ui = createUiResolver({
      resources: {
        User: {
          fields: {
            email: {
              renderer: "resource-email",
              props: {
                size: "md",
                tone: "resource",
              },
            },
          },
          views: {
            form: {
              fields: {
                email: {
                  renderer: "view-email",
                  props: {
                    tone: "view",
                  },
                },
              },
            },
          },
        },
      },
    });

    const presentation = ui.field({
      resource: spec.resources.User,
      field: getFormField(spec, "email"),
      view: "form",
    });

    expect(presentation.renderer).toBe("view-email");
    expect(presentation.source.renderer).toBe("view-config");
    expect(presentation.props).toEqual({
      size: "md",
      tone: "view",
    });
  });

  it("supports global and semantic field defaults", () => {
    const spec = createSpec();
    const field = getFormField(spec, "departmentId");

    const globalPresentation = resolveFieldPresentation({
      resource: spec.resources.User,
      field,
      view: "form",
      ui: {
        defaults: {
          fieldRenderers: {
            "relation:one": "global-relation-picker",
          },
        },
      },
    });

    expect(globalPresentation.renderer).toBe("global-relation-picker");
    expect(globalPresentation.source.renderer).toBe("global-default");

    const semanticPresentation = resolveFieldPresentation({
      resource: spec.resources.User,
      field,
      view: "form",
    });

    expect(semanticPresentation.renderer).toBe("relation-picker");
    expect(semanticPresentation.source.renderer).toBe("semantic-default");
  });

  it("merges resource, view, field, relation, and patch client metadata", () => {
    const spec = createSpec();
    spec.resources.User.meta.client = {
      fromMeta: true,
      shared: "meta",
    };
    spec.resources.User.fields.departmentId.ui.client = {
      fromField: true,
      shared: "field",
    };
    spec.resources.User.fields.departmentId.relation = {
      ...spec.resources.User.fields.departmentId.relation!,
      client: {
        fromRelation: true,
        shared: "relation",
      },
    };

    const ui: UiConfig = {
      resources: {
        User: {
          client: {
            fromResourceConfig: true,
            shared: "resource-config",
          },
          fields: {
            departmentId: {
              client: {
                fromResourcePatch: true,
                shared: "resource-patch",
              },
            },
          },
          views: {
            form: {
              client: {
                fromViewConfig: true,
                shared: "view-config",
              },
              fields: {
                departmentId: {
                  client: {
                    fromViewPatch: true,
                    shared: "view-patch",
                  },
                },
              },
            },
          },
        },
      },
    };

    const presentation = resolveFieldPresentation({
      resource: spec.resources.User,
      field: getFormField(spec, "departmentId"),
      view: "form",
      ui,
    });

    expect(presentation.client).toMatchObject({
      fromMeta: true,
      fromResourceConfig: true,
      fromViewConfig: true,
      fromField: true,
      fromRelation: true,
      fromResourcePatch: true,
      fromViewPatch: true,
    });
    expect(presentation.client.shared).toBe("view-patch");
  });

  it("resolves action, section, and column presentations through the same config", () => {
    const spec = createSpec();
    spec.resources.User.meta.client = {
      theme: "warm",
    };
    spec.resources.User.views.list.rowActions[0]!.client = {
      source: "spec-action",
    };

    const ui = createUiResolver({
      defaults: {
        sectionRenderer: "default-section",
        columnRenderer: "default-column",
      },
      resources: {
        User: {
          actions: {
            suspend: {
              renderer: "resource-action",
              client: {
                actionScope: "resource",
              },
            },
          },
          views: {
            list: {
              actions: {
                suspend: {
                  renderer: "view-action",
                  props: {
                    compact: true,
                  },
                },
              },
              columns: {
                name: {
                  renderer: "name-column",
                  placement: "primary",
                },
              },
            },
            form: {
              sections: {
                basic: {
                  renderer: "card-section",
                  layout: {
                    columns: 2,
                  },
                },
              },
            },
          },
        },
      },
    });

    const listVm = createListVM(getResource(spec, "User"), {
      context: {},
      data: [
        {
          id: "user-1",
          name: "Alice",
          email: "alice@example.com",
          departmentId: "dep-1",
          status: "active",
        },
      ],
    });
    const formVm = createFormVM(getResource(spec, "User"), {
      context: {},
      mode: "create",
    });

    const actionPresentation = ui.action({
      resource: spec.resources.User,
      action: listVm.rows[0]!.actions[0]!,
      view: "list",
    });
    const sectionPresentation = ui.section({
      resource: spec.resources.User,
      section: formVm.sections[0]!,
      view: "form",
    });
    const columnPresentation = ui.column({
      resource: spec.resources.User,
      field: getListColumn(listVm.fields, "name"),
    });

    expect(actionPresentation.renderer).toBe("view-action");
    expect(actionPresentation.props).toEqual({ compact: true });
    expect(actionPresentation.client).toMatchObject({
      theme: "warm",
      source: "spec-action",
      actionScope: "resource",
    });

    expect(sectionPresentation.renderer).toBe("card-section");
    expect(sectionPresentation.layout.columns).toBe(2);

    expect(columnPresentation.renderer).toBe("name-column");
    expect(columnPresentation.placement).toBe("primary");
  });
});

function createSpec(): CompiledSpec {
  return validateSpec(structuredClone(userSpec));
}

function getFormField(spec: CompiledSpec, fieldName: string): FormFieldVM {
  const vm = createFormVM(getResource(spec, "User"), {
    context: {},
    mode: "create",
  });
  const field = vm.fields.find((entry) => entry.name === fieldName);
  if (!field) {
    throw new Error(`Field not found: ${fieldName}`);
  }
  return field;
}

function getListColumn(
  columns: ListFieldVM[],
  fieldName: string,
): ListFieldVM {
  const column = columns.find((entry) => entry.name === fieldName);
  if (!column) {
    throw new Error(`Column not found: ${fieldName}`);
  }
  return column;
}
