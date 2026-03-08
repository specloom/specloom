import type { CompiledField } from "@specloom/spec"
import { formatValue } from "specloom"

import { Badge } from "~/components/ui/badge"

type PresentableField = Pick<CompiledField, "type" | "ui" | "relation">

export function SpecFieldValue(props: {
  field: PresentableField
  value: unknown
}) {
  return presentTextValue(
    formatValue(props.field, props.value),
    props.field.ui.appearance,
    props.value,
  )
}

export function presentTextValue(
  text: string,
  appearance?: string,
  rawValue?: unknown,
) {
  const display = text === "" ? "-" : text

  if (appearance === "badge") {
    return <Badge variant="secondary">{display}</Badge>
  }

  if (appearance === "link") {
    const href = resolveHref(rawValue, text)
    if (href) {
      const external = href.startsWith("http://") || href.startsWith("https://")
      return (
        <a
          href={href}
          class="text-primary hover:underline"
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {display}
        </a>
      )
    }
  }

  return <>{display}</>
}

function resolveHref(rawValue: unknown, text: string) {
  const value =
    typeof rawValue === "string" && rawValue.length > 0 ? rawValue : text

  if (/^https?:\/\//.test(value)) {
    return value
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return `mailto:${value}`
  }

  return undefined
}
