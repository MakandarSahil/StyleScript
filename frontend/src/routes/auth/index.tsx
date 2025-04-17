import { GalleryVerticalEnd } from "lucide-react"
import AuthForm from '@/components/auth-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left Section: Login Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            StyleScript
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AuthForm />
          </div>
        </div>
      </div>

      {/* Right Section: Video Background */}
      <div className="relative bg-muted border-l-2 flex items-center justify-center">
        <video
          src="assets/auth.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[50vh] sm:h-[60vh] md:h-full object-cover"
        />
      </div>
    </div>
  )
}

