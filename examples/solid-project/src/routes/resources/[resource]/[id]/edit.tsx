import { useParams } from "@solidjs/router"
import { ResourceEditPage } from "~/components/vm/ResourceFormPage"

export default function ResourceEdit() {
  const params = useParams()
  return <ResourceEditPage resource={params.resource!} id={params.id!} />
}
