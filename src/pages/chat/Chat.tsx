import { useRef, useState } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function Chat() {
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message and image submission
    console.log({ message, image: imagePreview });
    // Clear after submission
    setMessage('');
    setImagePreview(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <header className="border-b border-gray-200 p-4 bg-white">
        <h1 className="text-lg font-semibold">Current Chat</h1>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {/* Messages would go here */}
        {imagePreview && (
          <div className="flex justify-end mb-4">
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs rounded-lg border border-gray-200"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          capture="environment"
        />

        {imagePreview && (
          <div className="mb-3 flex justify-between items-center">
            <span className="text-sm text-gray-500">Image attached</span>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={removeImage}
              className="text-red-500 hover:text-red-600 h-auto p-0"
            >
              Remove
            </Button>
          </div>
        )}

        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pr-24 min-h-[100px]"
            placeholder="Type your message..."
          />
          <div className="absolute right-3 bottom-3 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={triggerFileInput}
              className="text-gray-500 hover:text-gray-700"
            >
              <ImageIcon size={20} />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!message && !imagePreview}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Chat