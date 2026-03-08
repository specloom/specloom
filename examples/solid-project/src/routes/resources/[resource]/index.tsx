import { useParams } from "@solidjs/router"
import { ResourceListPage } from "~/components/vm/ResourceListPage"

export default function ResourceList() {
  const params = useParams()
  return <ResourceListPage resource={params.resource!} />
}
