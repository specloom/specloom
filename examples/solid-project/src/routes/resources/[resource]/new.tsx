import { useParams } from "@solidjs/router"
import { ResourceNewPage } from "~/components/vm/ResourceFormPage"

export default function ResourceNew() {
  const params = useParams()
  return <ResourceNewPage resource={params.resource!} />
}
