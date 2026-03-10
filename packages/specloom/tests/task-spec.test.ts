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
    it("renders columns: id, title, priority, done, dueDate, createdAt", () => {
      const vm = createListVM(task, {
        context: {},
        data: [
          {
            id: "1",
            title: "Buy milk",
            priority: "low",
            done: false,
            dueDate: null,
            createdAt: "2026-01-01T00:00:00Z",
          },
          {
            id: "2",
            title: "Write tests",
            priority: "high",
            done: true,
            dueDate: "2026-02-01T00:00:00Z",
            createdAt: "2026-01-02T00:00:00Z",
          },
        ],
      });

      expect(vm.columns.map((c) => c.field)).toEqual([
        "id",
        "title",
        "priority",
        "done",
        "dueDate",
        "createdAt",
      ]);
      expect(vm.rows).toHaveLength(2);
      expect(vm.rows[0].values.title).toBe("Buy milk");
      expect(vm.rows[1].values.done).toBe(true);
    });

    it("supports search on title and description", () => {
      const vm = createListVM(task, {
        context: {},
        data: [],
        searchQuery: "milk",
      });

      expect(vm.search.fields).toEqual(["title", "description"]);
      expect(vm.search.query).toBe("milk");
    });

    it("exposes list filters from listView", () => {
      const vm = createListVM(task, { context: {}, data: [] });

      expect(vm.filters.map((filter) => filter.field)).toEqual([
        "title",
        "priority",
        "done",
        "dueDate",
        "createdAt",
      ]);
      expect(
        vm.filters.find((filter) => filter.field === "priority")?.widget,
      ).toBe("select");
    });

    it("has defaultSort on id desc", () => {
      const vm = createListVM(task, { context: {}, data: [] });
      expect(vm.defaultSort).toEqual({ field: "id", direction: "desc" });
    });

    it("clickAction is show", () => {
      const vm = createListVM(task, { context: {}, data: [] });
      expect(vm.clickAction).toBe("show");
    });

    it("has 3 named filters", () => {
      const vm = createListVM(task, { context: {}, data: [] });
      expect(vm.namedFilters.map((f) => f.id)).toEqual([
        "incomplete",
        "highPriority",
        "overdue",
      ]);
    });

    it("named filters have Japanese labels", () => {
      const vm = createListVM(task, { context: {}, data: [] });
      expect(vm.namedFilters.map((f) => f.label)).toEqual([
        "未完了",
        "高優先",
        "期限切れ",
      ]);
    });

    it("has list pageActions and selectionActions", () => {
      const vm = createListVM(task, { context: {}, data: [] });

      expect(vm.pageActions.map((action) => action.id)).toEqual([
        "exportCsv",
        "reviewOverdue",
        "archiveCompleted",
      ]);
      expect(vm.pageActions.map((action) => action.label)).toEqual([
        "CSVエクスポート",
        "期限切れを再確認",
        "完了済みをアーカイブ",
      ]);
      expect(vm.pageActions[1]?.confirm).toMatchObject({
        message: "現在の条件で期限切れタスクを再確認しますか？",
      });
      expect(vm.selectionActions.map((action) => action.id)).toEqual([
        "markSelectedDone",
      ]);
    });
  });

  describe("form view (create)", () => {
    it("has main and detail sections", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });

      expect(vm.sections.map((s) => s.id)).toEqual(["main", "detail"]);
    });

    it("main section has title, priority, done, dueDate", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });
      const mainFields = vm.sections
        .find((s) => s.id === "main")
        ?.fields.map((f) => f.name);

      expect(mainFields).toEqual(["title", "priority", "done", "dueDate"]);
    });

    it("detail section has description, estimatedHours, tags, memo", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });
      const detailFields = vm.sections
        .find((s) => s.id === "detail")
        ?.fields.map((f) => f.name);

      expect(detailFields).toEqual([
        "description",
        "estimatedHours",
        "tags",
        "memo",
      ]);
    });

    it("title is required with minLength 1 and maxLength 200", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });
      const title = vm.fields.find((f) => f.name === "title");

      expect(title?.required).toBe(true);
    });

    it("priority uses select widget with options", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });
      const priority = vm.fields.find((f) => f.name === "priority");

      expect(priority?.ui.widget).toBe("select");
      expect(priority?.options?.map((o) => o.value)).toEqual([
        "low",
        "medium",
        "high",
      ]);
    });

    it("done uses switch widget", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });
      expect(vm.fields.find((f) => f.name === "done")?.ui.widget).toBe(
        "switch",
      );
    });

    it("description uses textarea widget", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });
      expect(vm.fields.find((f) => f.name === "description")?.ui.widget).toBe(
        "textarea",
      );
    });

    it("estimatedHours uses number-input widget", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });
      expect(
        vm.fields.find((f) => f.name === "estimatedHours")?.ui.widget,
      ).toBe("number-input");
    });

    it("optional fields are not required", () => {
      const vm = createFormVM(task, { context: {}, mode: "create" });

      expect(vm.fields.find((f) => f.name === "description")?.required).toBe(
        false,
      );
      expect(vm.fields.find((f) => f.name === "estimatedHours")?.required).toBe(
        false,
      );
      expect(vm.fields.find((f) => f.name === "dueDate")?.required).toBe(false);
      expect(vm.fields.find((f) => f.name === "memo")?.required).toBe(false);
    });

    it("serializes form values", () => {
      const vm = createFormVM(task, {
        context: {},
        mode: "create",
        record: {
          title: "Test task",
          priority: "medium",
          done: false,
          tags: ["dev"],
        },
      });

      expect(serializeForm(vm)).toMatchObject({
        title: "Test task",
        priority: "medium",
        done: false,
        tags: ["dev"],
      });
    });
  });

  describe("form view (edit)", () => {
    it("populates existing values", () => {
      const vm = createFormVM(task, {
        context: {},
        mode: "edit",
        record: {
          id: "1",
          title: "Existing",
          priority: "high",
          done: true,
          estimatedHours: 3,
          tags: ["bug"],
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      });

      expect(vm.fields.find((f) => f.name === "title")?.value).toBe("Existing");
      expect(vm.fields.find((f) => f.name === "priority")?.value).toBe("high");
      expect(vm.fields.find((f) => f.name === "done")?.value).toBe(true);
      expect(vm.fields.find((f) => f.name === "estimatedHours")?.value).toBe(3);
    });
  });

  describe("show view", () => {
    it("shows visible fields in section order", () => {
      const vm = createShowVM(task, {
        context: {},
        record: {
          id: "1",
          title: "Test",
          description: "desc",
          priority: "low",
          done: false,
          estimatedHours: 2,
          dueDate: null,
          tags: [],
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-02T00:00:00Z",
        },
      });

      const names = vm.fields.map((f) => f.name);
      expect(names).toContain("title");
      expect(names).toContain("priority");
      expect(names).toContain("done");
      expect(names).toContain("description");
      expect(names).toContain("estimatedHours");
      expect(names).toContain("createdAt");
      expect(names).toContain("updatedAt");
      // memo is show: false
      expect(names).not.toContain("memo");
    });

    it("createdAt and updatedAt have relative format", () => {
      const vm = createShowVM(task, {
        context: {},
        record: {
          id: "1",
          title: "Test",
          priority: "low",
          done: false,
          tags: [],
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-02T00:00:00Z",
        },
      });

      expect(vm.fields.find((f) => f.name === "createdAt")?.ui.format).toBe(
        "datetime",
      );
      expect(vm.fields.find((f) => f.name === "updatedAt")?.ui.format).toBe(
        "relative",
      );
    });
  });

  describe("form state validation", () => {
    it("validates minLength on title", () => {
      const form = createFormState({
        resource: task,
        mode: "create",
        values: { title: "", priority: "low", done: false, tags: [] },
      });

      const { state, result } = form.validate();
      expect(result.valid).toBe(false);
      const vm = state.view();
      const titleField = vm.fields.find((f) => f.name === "title");
      expect(titleField?.errors.length).toBeGreaterThan(0);
    });

    it("validates maxLength on title", () => {
      const form = createFormState({
        resource: task,
        mode: "create",
        values: {
          title: "x".repeat(201),
          priority: "low",
          done: false,
          tags: [],
        },
      });

      const { result } = form.validate();
      expect(result.valid).toBe(false);
    });

    it("validates minValue/maxValue on estimatedHours", () => {
      const formNeg = createFormState({
        resource: task,
        mode: "create",
        values: {
          title: "T",
          priority: "low",
          done: false,
          tags: [],
          estimatedHours: -1,
        },
      });
      expect(formNeg.validate().result.valid).toBe(false);

      const formOver = createFormState({
        resource: task,
        mode: "create",
        values: {
          title: "T",
          priority: "low",
          done: false,
          tags: [],
          estimatedHours: 1000,
        },
      });
      expect(formOver.validate().result.valid).toBe(false);
    });

    it("validates maxItems on tags", () => {
      const form = createFormState({
        resource: task,
        mode: "create",
        values: {
          title: "T",
          priority: "low",
          done: false,
          tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
        },
      });

      const { result } = form.validate();
      expect(result.valid).toBe(false);
    });

    it("validates pattern on memo (no angle brackets)", () => {
      const form = createFormState({
        resource: task,
        mode: "create",
        values: {
          title: "T",
          priority: "low",
          done: false,
          tags: [],
          memo: "<script>alert(1)</script>",
        },
      });

      const { result } = form.validate();
      expect(result.valid).toBe(false);
    });

    it("passes validation with valid data", () => {
      const form = createFormState({
        resource: task,
        mode: "create",
        values: {
          title: "Valid task",
          priority: "medium",
          done: false,
          estimatedHours: 5,
          tags: ["feature", "v2"],
          memo: "Some notes here",
        },
      });

      const { result } = form.validate();
      expect(result.valid).toBe(true);
    });
  });
});
