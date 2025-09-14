import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type SettingsViewProps = {
  user: { id: string; name: string; email: string; netId?: string; photo?: string };
  onUpdate: (updatedUser: { name: string; email: string; netId?: string; password?: string; photo?: string }) => void;
};

export function SettingsView({ user, onUpdate }: SettingsViewProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [netId, setNetId] = useState(user.netId || "");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<string | null>(user.photo || null);
  const [photoId, setPhotoId] = useState<string | null>(null);

  const handlePhotoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
          "x-user-id": user.id, // Pass the user ID in the headers
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setPhotoId(data.photoId); // Save the photo ID
        setPhoto(`http://localhost:3000/photo/${data.photoId}`); // Set the photo URL
      } else {
        console.error("Photo upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name, email, netId, password, photo: photoId || undefined });
  };

  return (
    <div className="p-6 relative">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 pb-24">
        {/* Profile Photo */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Photo</h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-cornell-red/20">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="flex items-center justify-center w-full h-full bg-cornell-red/10 text-cornell-red text-xl font-semibold">
                    {name.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cornell-red rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">📷</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload new photo
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file);
                }}
                className="text-sm border-gray-200 rounded-xl focus:ring-cornell-red/50 focus:border-cornell-red"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="border-gray-200 rounded-xl focus:ring-cornell-red/50 focus:border-cornell-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@cornell.edu"
                className="border-gray-200 rounded-xl focus:ring-cornell-red/50 focus:border-cornell-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cornell NetID
              </label>
              <Input
                type="text"
                value={netId}
                onChange={(e) => setNetId(e.target.value)}
                placeholder="abc123"
                className="border-gray-200 rounded-xl focus:ring-cornell-red/50 focus:border-cornell-red"
              />
              <p className="text-xs text-gray-500 mt-1">Your Cornell network ID for campus services</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border-0 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="border-gray-200 rounded-xl focus:ring-cornell-red/50 focus:border-cornell-red"
            />
            <p className="text-xs text-gray-500 mt-1">Only enter a password if you want to change it</p>
          </div>
        </div>
      </form>

      {/* Submit Button */}
      <div className="fixed bottom-28 right-6">
        <Button
          type="submit"
          className="bg-gradient-to-r from-cornell-red to-cornell-dark-red text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          onClick={handleSubmit}
        >
          <span>💾</span>
          Save Changes
        </Button>
      </div>
    </div>
  );
}