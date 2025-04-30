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
    <div className="p-4 relative">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Settings</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-20">
        {/* Profile Photo */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            {photo ? (
              <img src={photo} alt="Profile" className="rounded-full" />
            ) : (
              <AvatarFallback className="bg-gray-300 text-gray-600">?</AvatarFallback>
            )}
          </Avatar>
          <label className="text-sm font-medium text-gray-700">
            <span className="block mb-1">Profile Photo</span>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
              className="text-sm"
            />
          </label>
        </div>

        {/* Name */}
        <label className="text-sm font-medium text-gray-700">
          <span className="block mb-1">Change Name</span>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </label>

        {/* Email */}
        <label className="text-sm font-medium text-gray-700">
          <span className="block mb-1">Update Email</span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </label>

        {/* Password */}
        <label className="text-sm font-medium text-gray-700">
          <span className="block mb-1">Update Password</span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a new password"
          />
        </label>

        {/* NetID */}
        <label className="text-sm font-medium text-gray-700">
          <span className="block mb-1">NetID</span>
          <Input
            type="text"
            value={netId}
            onChange={(e) => setNetId(e.target.value)}
            placeholder="Enter your NetID"
          />
        </label>
      </form>

      {/* Submit Button */}
      <div className="fixed bottom-24 right-4">
        <Button
          type="submit"
          className="bg-[#b31b1b] text-white font-semibold px-6 py-2 rounded-md shadow-md"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}