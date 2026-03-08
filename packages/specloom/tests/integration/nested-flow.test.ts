import { describe, it, expect } from "vitest";
import {
  parseSpec,
  evaluateShowView,
  evaluateFormView,
  type Context,
  type ShowView,
  type FormView,
} from "../../src/index.js";

/**
 * 統合テスト: nested フィールドのフロー
 * Order → OrderItem (nested) の注文管理
 */

const nestedSpecJson = `{
  "version": "0.1",
  "resources": [
    {
      "name": "Order",
      "label": "注文",
      "fields": [
        {
          "name": "id",
          "type": "string",
          "label": "ID",
          "readonly": true
        },
        {
          "name": "customer",
          "type": "Customer",
          "label": "顧客",
          "kind": "relation",
          "required": true,
          "relation": {
            "resource": "Customer",
            "labelField": "name"
          },
          "ui": {
            "inputHint": "autocomplete"
          }
        },
        {
          "name": "items",
          "type": "OrderItem[]",
          "label": "注文明細",
          "kind": "nested",
          "nested": {
            "resource": "OrderItem",
            "min": 1,
            "max": 50
          }
        },
        {
          "name": "total",
          "type": "int32",
          "label": "合計",
          "kind": "number",
          "readonly": true
        }
      ]
    }
  ],
  "views": [
    {
      "resource": "Order",
      "type": "show",
      "fields": ["id", "customer", "items", "total"],
      "actions": [
        {
          "id": "edit",
          "label": "編集"
        }
      ]
    },
    {
      "resource": "Order",
      "type": "form",
      "fields": ["customer", "items"],
      "actions": [
        {
          "id": "save",
          "label": "保存"
        }
      ]
    }
  ]
}`;

describe("統合テスト: nested フィールド", () => {
  const spec = parseSpec(nestedSpecJson);
  const resource = spec.resources[0];

  describe("nested フィールド定義", () => {
    it("nested フィールドが正しく定義される", () => {
      const itemsField = resource.fields.find((f) => f.name === "items");
      expect(itemsField).toBeDefined();
      expect(itemsField?.kind).toBe("nested");
      expect(itemsField?.nested).toEqual({
        resource: "OrderItem",
        min: 1,
        max: 50,
      });
    });

    it("relation フィールドは nested と独立して存在する", () => {
      const customerField = resource.fields.find(
        (f) => f.name === "customer",
      );
      expect(customerField?.kind).toBe("relation");
      expect(customerField?.relation).toBeDefined();
      expect(customerField?.nested).toBeUndefined();
    });
  });

  describe("詳細画面 (ShowView) での nested", () => {
    const orderData = {
      id: "order-1",
      customer: { id: "c1", name: "田中太郎" },
      items: [
        { product: { id: "p1", name: "商品A" }, quantity: 2, unitPrice: 1000 },
        { product: { id: "p2", name: "商品B" }, quantity: 1, unitPrice: 2000 },
      ],
      total: 4000,
    };

    it("nested データが表示される", () => {
      const view = spec.views.find(
        (v) => v.type === "show" && v.resource === "Order",
      ) as ShowView;
      const context: Context = { role: "admin" };
      const vm = evaluateShowView({
        view,
        resource,
        context,
        data: orderData,
      });

      const itemsField = vm.fields.find((f) => f.name === "items");
      expect(itemsField?.kind).toBe("nested");
      expect(itemsField?.nested?.resource).toBe("OrderItem");
      expect(itemsField?.value).toEqual(orderData.items);
    });
  });

  describe("フォーム (FormView) での nested", () => {
    it("nested フィールドがフォームに含まれる", () => {
      const view = spec.views.find(
        (v) => v.type === "form" && v.resource === "Order",
      ) as FormView;
      const context: Context = { role: "admin" };
      const vm = evaluateFormView({
        view,
        resource,
        context,
        mode: "create",
      });

      const itemsField = vm.fields.find((f) => f.name === "items");
      expect(itemsField?.kind).toBe("nested");
      expect(itemsField?.nested).toEqual({
        resource: "OrderItem",
        min: 1,
        max: 50,
      });
    });

    it("edit モードで nested データが渡される", () => {
      const view = spec.views.find(
        (v) => v.type === "form" && v.resource === "Order",
      ) as FormView;
      const context: Context = { role: "admin" };
      const existingData = {
        id: "order-1",
        customer: { id: "c1", name: "田中太郎" },
        items: [
          { product: { id: "p1", name: "商品A" }, quantity: 3 },
        ],
      };
      const vm = evaluateFormView({
        view,
        resource,
        context,
        data: existingData,
        mode: "edit",
      });

      const itemsField = vm.fields.find((f) => f.name === "items");
      expect(itemsField?.value).toEqual(existingData.items);
    });
  });

  describe("フルフロー: nested を含む注文作成", () => {
    it("作成 → 詳細表示の流れ", () => {
      const context: Context = { role: "admin" };

      // 1. フォーム画面
      const formView = spec.views.find(
        (v) => v.type === "form" && v.resource === "Order",
      ) as FormView;
      const formVm = evaluateFormView({
        view: formView,
        resource,
        context,
        mode: "create",
      });
      expect(formVm.fields.map((f) => f.name)).toContain("items");
      const itemsField = formVm.fields.find((f) => f.name === "items");
      expect(itemsField?.kind).toBe("nested");

      // 2. 保存後、詳細画面で確認
      const savedOrder = {
        id: "order-new",
        customer: { id: "c2", name: "佐藤花子" },
        items: [
          { product: { id: "p1", name: "商品A" }, quantity: 2, unitPrice: 1000 },
        ],
        total: 2000,
      };
      const showView = spec.views.find(
        (v) => v.type === "show" && v.resource === "Order",
      ) as ShowView;
      const showVm = evaluateShowView({
        view: showView,
        resource,
        context,
        data: savedOrder,
      });
      expect(showVm.id).toBe("order-new");
      const showItems = showVm.fields.find((f) => f.name === "items");
      expect(showItems?.kind).toBe("nested");
      expect(showItems?.nested?.resource).toBe("OrderItem");
    });
  });
});
