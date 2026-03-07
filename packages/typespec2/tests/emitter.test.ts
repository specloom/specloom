import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = resolve(packageRoot, "tests/sample.tsp");
const expectedOutputRoot = resolve(packageRoot, "tests/output");
const tspBin = resolve(packageRoot, "node_modules/.bin/tsp");

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("typespec2 emitter", () => {
  it("emits one JSON file per resource at the output root", () => {
    const outputDir = createTempDir();

    compileFixture(outputDir);

    expect(readJson(resolve(outputDir, "user.json")).resources).toHaveProperty(
      "User",
    );
    expect(
      readJson(resolve(outputDir, "department.json")).resources,
    ).toHaveProperty("Department");
    expect(
      readJson(resolve(outputDir, "address.json")).resources,
    ).toHaveProperty("Address");
  });

  it("emits resource metadata", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.meta).toMatchObject({
      label: "User",
      pluralLabel: "Users",
      titleField: "name",
    });
  });

  it("emits readonly scalar field visibility", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.fields.id.ui).toMatchObject({
      label: "ID",
      readonly: true,
      visibleIn: {
        list: true,
        show: true,
        form: false,
      },
    });
  });

  it("emits field validation and filter metadata", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.fields.name).toMatchObject({
      validation: {
        minLength: 1,
      },
      filter: {
        operators: ["eq", "contains"],
      },
      ui: {
        section: "basic",
        order: 20,
      },
    });
  });

  it("emits field appearance metadata", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.fields.email.ui).toMatchObject({
      appearance: "link",
      section: "basic",
      order: 30,
    });
  });

  it("emits list view columns and search settings", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.views.list.columns[1]).toMatchObject({
      field: "name",
      label: "Account",
      template: "{name} <{email}>",
    });
    expect(user.resources.User.views.list).toMatchObject({
      search: { fields: ["name", "email"] },
      sortable: ["name", "email"],
      defaultSort: {
        field: "name",
        direction: "asc",
      },
      selection: "multi",
      clickAction: "show",
    });
  });

  it("emits relation field metadata and submit mapping", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.fields.departmentId.relation).toMatchObject({
      resource: "Department",
      kind: "belongsTo",
      submitField: "departmentId",
      linkTo: "show",
    });
    expect(user.resources.User.fields.departmentId.submit).toMatchObject({
      field: "departmentId",
      shape: "scalar",
      valueField: "id",
    });
  });

  it("emits nested field metadata and submit mapping", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.fields.addresses.nested).toMatchObject({
      resource: "Address",
      cardinality: "many",
      minItems: 1,
      maxItems: 3,
      maxDepth: 3,
    });
    expect(user.resources.User.fields.addresses.submit).toMatchObject({
      field: "addresses",
      shape: "object[]",
    });
  });

  it("emits computed field metadata", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.fields.displayName).toMatchObject({
      computed: true,
      ui: {
        label: "Display Name",
        readonly: true,
        visibleIn: {
          list: true,
          show: true,
          form: false,
        },
      },
    });
  });

  it("emits form sections", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.views.form.sections).toEqual([
      {
        id: "basic",
        label: "Basic",
        view: "form",
        fields: ["name", "email"],
      },
      {
        id: "main",
        label: "Main",
        view: "form",
        fields: ["departmentId", "addresses"],
      },
    ]);
  });

  it("emits show sections", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.views.show.sections).toEqual([
      {
        id: "main",
        label: "Main",
        view: "show",
        fields: ["id", "departmentId", "addresses", "displayName"],
      },
      {
        id: "basic",
        label: "Basic",
        view: "show",
        fields: ["name", "email"],
      },
    ]);
  });

  it("emits page and row action metadata", () => {
    const { user } = compileSplitFixture();

    expect(user.resources.User.views.list.pageActions[0]).toMatchObject({
      id: "exportCsv",
      kind: "page",
      view: "list",
      resource: "User",
      selection: "query",
      input: "ExportUsersInput",
      operation: {
        id: "exportCsv",
        path: "/user/export-csv",
      },
    });
    expect(user.resources.User.views.list.rowActions[0]).toMatchObject({
      id: "suspend",
      kind: "row",
      view: "list",
      resource: "User",
      operation: {
        id: "suspend",
        method: "POST",
        path: "/user/suspend",
      },
    });
    expect(user.resources.User.views.list.rowActions[0]?.when).toMatchObject({
      type: "comparison",
      operator: "==",
    });
  });

  it("emits input model fields and sections", () => {
    const { user } = compileSplitFixture();

    expect(user.inputs.ExportUsersInput.fields.status.ui).toMatchObject({
      label: "Status",
      visibleIn: {
        list: false,
        show: true,
        form: true,
      },
    });
    expect(user.inputs.ExportUsersInput.form.sections).toEqual([
      {
        id: "main",
        label: "Main",
        view: "form",
        fields: ["status"],
      },
    ]);
  });

  it("emits related resource specs", () => {
    const { department, address } = compileSplitFixture();

    expect(department.resources.Department.views.list.columns).toEqual([
      {
        field: "name",
        label: "Name",
        sortable: false,
      },
    ]);
    expect(address.resources.Address.views.form.sections).toEqual([
      {
        id: "main",
        label: "Main",
        view: "form",
        fields: ["line1"],
      },
    ]);
  });

  it("emits a single aggregate file when output-file is provided", () => {
    const outputDir = createTempDir();

    compileFixture(outputDir, [
      "--option",
      "@specloom/typespec2.output-file=admin/spec.json",
    ]);

    const aggregate = readJson(resolve(outputDir, "admin/spec.json"));

    expect(aggregate.resources).toHaveProperty("User");
    expect(aggregate.resources).toHaveProperty("Department");
    expect(aggregate.resources).toHaveProperty("Address");
    expect(aggregate.inputs).toHaveProperty("ExportUsersInput");
  });

  it("matches the checked-in split output", () => {
    const { user, department, address } = compileSplitFixture();

    expect(user).toEqual(readJson(resolve(expectedOutputRoot, "user.json")));
    expect(department).toEqual(
      readJson(resolve(expectedOutputRoot, "department.json")),
    );
    expect(address).toEqual(
      readJson(resolve(expectedOutputRoot, "address.json")),
    );
  });

  it("matches the checked-in aggregate output", () => {
    const outputDir = createTempDir();

    compileFixture(outputDir, [
      "--option",
      "@specloom/typespec2.output-file=admin/spec.json",
    ]);

    const aggregate = readJson(resolve(outputDir, "admin/spec.json"));
    const expected = readJson(resolve(expectedOutputRoot, "admin/spec.json"));

    expect(aggregate).toEqual(expected);
  });
});

function createTempDir(): string {
  const dir = mkdtempSync(resolve(tmpdir(), "typespec2-test-"));
  tempDirs.push(dir);
  return dir;
}

function compileFixture(outputDir: string, extraArgs: string[] = []): void {
  execFileSync(
    tspBin,
    [
      "compile",
      fixturePath,
      "--emit",
      "@specloom/typespec2",
      "--output-dir",
      outputDir,
      ...extraArgs,
    ],
    {
      cwd: packageRoot,
      stdio: "pipe",
    },
  );
}

function compileSplitFixture(): {
  user: any;
  department: any;
  address: any;
} {
  const outputDir = createTempDir();
  compileFixture(outputDir);
  return {
    user: readJson(resolve(outputDir, "user.json")),
    department: readJson(resolve(outputDir, "department.json")),
    address: readJson(resolve(outputDir, "address.json")),
  };
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, "utf8"));
}
