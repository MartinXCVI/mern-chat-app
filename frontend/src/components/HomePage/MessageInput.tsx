// React imports
import type { JSX, ChangeEvent, FormEvent } from 'react'
// React hooks imports
import { useState, useRef } from 'react'
// Global state
import { useChatStore } from '../../store/useChatStore'
// Icons
import { Image, Send, X } from 'lucide-react'
// Utilities
import toast from 'react-hot-toast'


const MessageInput = (): JSX.Element => {

  const [text, setText] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sendMessage } = useChatStore()


  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if(!file) {
      toast.error("No file selected")
      return
    }
    if(!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if(!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, JPG, PNG, or WEBP images are allowed")
      return
    }
    const MAX_SIZE_MB = 5
    if(file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB} MB`)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (): void => {
    setImagePreview(null)
    if(fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if(!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview ?? undefined,
      })
      // Clearing form
      setText("")
      setImagePreview(null)
      if(fileInputRef.current) fileInputRef.current.value = ""
    } catch(error) {
      if(error instanceof Error) {
        console.error(`Failed to send message: ${error.message || error}`)
        toast.error(`Failed to send message: ${error.message}`)
      } else {
        console.error(`Failed to send message: ${error}`)
        toast.error('Failed to send message. Try again later ')
      }
    }
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => setText(event.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
              ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`
            }
            onClick={(): void | undefined => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}

export default MessageInput