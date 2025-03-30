import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$userid')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/users/$userid"!</div>
}
