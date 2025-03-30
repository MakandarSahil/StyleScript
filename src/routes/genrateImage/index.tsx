import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/genrateImage/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/genrateImage/"!</div>
}
