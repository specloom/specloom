import { useParams } from "@solidjs/router"
import { ResourceShowPage } from "~/components/vm/ResourceShowPage"

export default function ResourceShow() {
  const params = useParams()
  return <ResourceShowPage resource={params.resource!} id={params.id!} />
}
