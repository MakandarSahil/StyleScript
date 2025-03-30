import LandingPage from '@/pages/LandingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="pt-24 p-8">
        <LandingPage />
      </div>
    </>

  )
}
