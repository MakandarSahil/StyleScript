import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="pt-24 p-8">
        <h1 className="text-3xl font-bold">Welcome to Cillo</h1>
        <p className="mt-4">Your premium shopping destination</p>
      </div>
    </>

  )
}
