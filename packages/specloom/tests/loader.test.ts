import { describe, it, expect } from "vitest";
import { parseSpec, validateSpec, SpecError } from "../src/loader/index.js";

describe("loader", () => {
  describe("parseSpec", () => {
    it("有効な JSON をパースできる", () => {
      const json = JSON.stringify({
        version: "0.1",
        resources: [],
        views: [],
      });

      const spec = parseSpec(json);

      expect(spec.version).toBe("0.1");
      expect(spec.resources).toEqual([]);
      expect(spec.views).toEqual([]);
    });

    it("無効な JSON でエラーになる", () => {
      expect(() => parseSpec("invalid json")).toThrow();
    });
  });

  describe("validateSpec", () => {
    it("有効な Spec を検証できる", () => {
      const data = {
        version: "0.1",
        resources: [
          {
            name: "Post",
            fields: [{ name: "id", type: "string" }],
          },
        ],
        views: [
          {
            resource: "Post",
            type: "list",
            columns: ["id"],
            actions: [],
          },
        ],
      };

      const spec = validateSpec(data);

      expect(spec.version).toBe("0.1");
      expect(spec.resources).toHaveLength(1);
      expect(spec.views).toHaveLength(1);
    });

    it("version がない場合エラーになる", () => {
      const data = {
        resources: [],
        views: [],
      };

      expect(() => validateSpec(data)).toThrow(SpecError);
    });

    it("サポートされていない version でエラーになる", () => {
      const data = {
        version: "0.2",
        resources: [],
        views: [],
      };

      expect(() => validateSpec(data)).toThrow("Unsupported version");
    });

    it("resources がない場合エラーになる", () => {
      const data = {
        version: "0.1",
        views: [],
      };

      expect(() => validateSpec(data)).toThrow("resources array");
    });

    it("views がない場合エラーになる", () => {
      const data = {
        version: "0.1",
        resources: [],
      };

      expect(() => validateSpec(data)).toThrow("views array");
    });

    it("オブジェクト以外でエラーになる", () => {
      expect(() => validateSpec(null)).toThrow("must be an object");
      expect(() => validateSpec("string")).toThrow("must be an object");
      expect(() => validateSpec([])).toThrow("must be an object");
    });
  });
});
