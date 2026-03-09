import taskSpec from "../../../examples/specs/generated/solid-app/spec.json";
import { describe, expect, it } from "vitest";
import {
  createFormState,
  createFormVM,
  createListVM,
  createShowVM,
  getResource,
  serializeForm,
  validateSpec,
} from "../src/index.js";

const spec = validateSpec(taskSpec);
const task = getResource(spec, "Task");

describe("Task spec", () => {
  describe("operations", () => {
    it("has all operations enabled by default", () => {
      expect(task.operations).toEqual({
        list: true,
        show: true,
        create: true,
        edit: true,
        delete: true,
      });
    });
  });

  describe("list view", () => {
    it("renders columns: id, title, done, createdAt", () => {
      const vm = createListVM(task, {
        context: {},
        data: [
          { id: "1", title: "Buy milk", done: false, createdAt: "2026-01-01T00:00:00Z" },
          { id: "2", title: "Write tests", done: true, createdAt: "2026-01-02T00:00:00Z" },
        ],
      });

      expect(vm.columns.map((c) => c.field)).toEqual(["id", "title", "done", "createdAt"]);
      expect(vm.rows).toHaveLength(2);
      expect(vm.rows[0].values.title).toBe("Buy milk");
      expect(vm.rows[1].values.done).toBe(true);
    });

    it("supports search on title", () => {
      const vm = createListVM(task, {
        context: {},
        data: [],
        searchQuery: "milk",
      });

      expect(vm.search.fields).toEqual(["title"]);
      expect(vm.search.query).toBe("milk");
    });

    it("has defaultSort on id desc", () => {
      const vm = createListVM(task, { context: {}, data: [] });
      expect(vm.defaultSort).toEqual({ field: "id", direction: "desc" });
    });

    it("clickAction is show", () => {
      const vm = createListVM(task, { context: {}, data: [] });
      expect(vm.clickAction).toBe("show");
    });
  });

  describe("form view (create)", () => {
    it("shows title and done fields in main section", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });

      expect(vm.sections).toHaveLength(1);
      expect(vm.sections[0].id).toBe("main");
      expect(vm.fields.map((f) => f.name)).toEqual(["title", "done"]);
    });

    it("title is required, done is required (non-nullable boolean)", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });

      expect(vm.fields.find((f) => f.name === "title")?.required).toBe(true);
      expect(vm.fields.find((f) => f.name === "done")?.required).toBe(true);
    });

    it("done uses switch widget", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });
      expect(vm.fields.find((f) => f.name === "done")?.ui.widget).toBe("switch");
    });

    it("serializes form values", () => {
      const vm = createFormVM(task, {
        context: {},
        mode: "create",
        record: { title: "Test task", done: false },
      });

      expect(serializeForm(vm)).toMatchObject({
        title: "Test task",
        done: false,
      });
    });
  });

  describe("form view (edit)", () => {
    it("populates existing values", () => {
      const vm = createFormVM(task, {
        context: {},
        mode: "edit",
        record: { id: "1", title: "Existing", done: true, createdAt: "2026-01-01T00:00:00Z" },
      });

      expect(vm.fields.find((f) => f.name === "title")?.value).toBe("Existing");
      expect(vm.fields.find((f) => f.name === "done")?.value).toBe(true);
    });
  });

  describe("show view", () => {
    it("shows all visible fields: title, done, createdAt, id", () => {
      const vm = createShowVM(task, {
        context: {},
        record: { id: "1", title: "Test", done: false, createdAt: "2026-01-01T00:00:00Z" },
      });

      expect(vm.fields.map((f) => f.name)).toEqual(["title", "done", "createdAt", "id"]);
    });

    it("createdAt has relative format", () => {
      const vm = createShowVM(task, {
        context: {},
        record: { id: "1", title: "Test", done: false, createdAt: "2026-01-01T00:00:00Z" },
      });

      expect(vm.fields.find((f) => f.name === "createdAt")?.ui.format).toBe("relative");
    });
  });

  describe("form state", () => {
    it("creates form state and tracks values", () => {
      const form = createFormState({
        resource: task,
        mode: "create",
        values: { title: "New task", done: false },
      });

      expect(form.getValue("title")).toBe("New task");
      expect(form.getValue("done")).toBe(false);
    });

    it("validates minLength on title", () => {
      const form = createFormState({
        resource: task,
        mode: "create",
        values: { title: "", done: false },
      });

      const { state, result } = form.validate();
      expect(result.valid).toBe(false);
      const vm = state.view();
      const titleField = vm.fields.find((f) => f.name === "title");
      expect(titleField?.errors.length).toBeGreaterThan(0);
    });
  });
});
