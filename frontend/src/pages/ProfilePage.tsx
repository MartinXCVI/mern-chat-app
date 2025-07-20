// React & React hooks imports
import type { JSX, ChangeEvent } from 'react'
import { useState } from 'react'
// Global state
import { useAuthStore } from '../store/useAuthStore'
// Icons
import { Camera, User, Mail } from 'lucide-react'

const ProfilePage = (): JSX.Element | null => {

  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  if(!authUser) return null

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if(!file) return

    if(file.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB.")
      return
    }

    if(!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.")
      return
    }

    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = async (): Promise<void> => {
      setSelectedImg(String(reader.result))
    }
  }

  return (
    <div className='h-screen pt-20'>
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt={`Profile picture of ${authUser?.fullName || "user"}`}
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            {selectedImg && selectedImg !== authUser.profilePic && (
              <button
                className="btn btn-primary"
                disabled={isUpdatingProfile}
                onClick={() => updateProfile({ profilePic: selectedImg })}
              >
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
            )}

            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>
          {/* User info section */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage