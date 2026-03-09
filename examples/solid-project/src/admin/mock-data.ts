import type { CompiledResource, CompiledField } from "@specloom/spec";

function generateValue(field: CompiledField, index: number): unknown {
  if (field.key || field.name === "id") return `${field.name}-${index + 1}`;
  if (field.hidden || field.computed) return undefined;
  if (field.options && field.options.length > 0) {
    return field.options[index % field.options.length].value;
  }

  const { type, ui } = field;

  if (type.kind === "nested") {
    if (type.cardinality === "one") {
      return generateNestedObject(field.name, index);
    }
    return Array.from({ length: 2 }, (_, i) =>
      generateNestedObject(field.name, index * 10 + i),
    );
  }

  if (type.kind === "relation") {
    if (type.cardinality === "many") {
      return Array.from({ length: 2 }, (_, i) => `ref-${index * 10 + i + 1}`);
    }
    return `ref-${index + 1}`;
  }

  const scalarName = type.name;

  if ("array" in type && type.array) {
    return Array.from({ length: 2 }, (_, i) =>
      generateScalar(scalarName, field.name, index * 10 + i, ui.widget),
    );
  }

  return generateScalar(scalarName, field.name, index, ui.widget);
}

function generateScalar(
  typeName: string,
  fieldName: string,
  index: number,
  widget?: string,
): unknown {
  switch (typeName) {
    case "string":
      if (widget === "color-input") return ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"][index % 5];
      if (widget === "password-input") return "********";
      if (fieldName.includes("email")) return `user${index + 1}@example.com`;
      if (fieldName.includes("url")) return `https://example.com/${index + 1}`;
      if (fieldName.includes("slug")) return `item-${index + 1}`;
      if (fieldName.includes("phone")) return `090-${String(1000 + index).slice(0, 4)}-${String(1000 + index)}`;
      return `${capitalize(fieldName)} ${index + 1}`;
    case "int32":
    case "integer":
    case "float32":
    case "float64":
      return (index + 1) * 10;
    case "boolean":
      return index % 2 === 0;
    case "date": {
      const d = new Date();
      d.setDate(d.getDate() - index * 3);
      return d.toISOString().slice(0, 10);
    }
    case "datetime":
    case "utcDateTime": {
      const dt = new Date();
      dt.setDate(dt.getDate() - index);
      dt.setHours(dt.getHours() - index * 2);
      return dt.toISOString();
    }
    default:
      return `${fieldName}-${index + 1}`;
  }
}

function generateNestedObject(
  fieldName: string,
  index: number,
): Record<string, unknown> {
  if (fieldName.includes("address") || fieldName.includes("Address")) {
    return {
      line1: `${100 + index} Main St`,
      city: ["Tokyo", "Osaka", "Nagoya", "Fukuoka", "Sapporo"][index % 5],
      postalCode: `${100 + index}-0001`,
    };
  }
  if (fieldName.includes("line") || fieldName.includes("Line") || fieldName.includes("order")) {
    return {
      sku: `SKU-${1000 + index}`,
      name: `Product ${index + 1}`,
      quantity: (index + 1) * 2,
    };
  }
  if (fieldName.includes("attachment") || fieldName.includes("Attachment")) {
    return {
      title: `Document ${index + 1}`,
      url: `https://example.com/files/doc-${index + 1}.pdf`,
    };
  }
  return { id: `nested-${index + 1}`, name: `Item ${index + 1}` };
}

function capitalize(s: string): string {
  return s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}

export function generateMockData(
  resource: CompiledResource,
  count = 8,
): Record<string, unknown>[] {
  const fields = Object.values(resource.fields);

  return Array.from({ length: count }, (_, i) => {
    const record: Record<string, unknown> = {};
    for (const field of fields) {
      const value = generateValue(field, i);
      if (value !== undefined) {
        record[field.name] = value;
      }
    }
    return record;
  });
}
