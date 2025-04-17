import React from "react"
import { Button } from "@/components/ui/button"
function Chat() {
  const [isResult, setIsResult] = React.useState(false)
  return (
    <>

    {/* Chat Container */}
    {isResult && (
      <div>
        hii
      </div>
    )}
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">What can I help with?</h1>

        {/* Search Box */}
        <div className="w-full max-w-2xl relative">
          <textarea
            placeholder="Help me pick a Halloween costume"
            className="w-full bg-[#1a1a1a] text-gray-400 p-4 pr-20 h-28 rounded-lg focus:outline-none"
          />
          {/* Send Button */}
          <Button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 p-3 rounded-full">
            <span className="text-white text-lg">↑</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-fit mt-6">
          {["Search with ChatGPT", "Talk with ChatGPT", "Research", "Sora", "More"].map((text, index) => (
            <Button key={index} className="w-full">
              {text}
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}

export default Chat