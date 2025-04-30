import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type SettingsViewProps = {
  user: { name: string; email: string; netId?: string };
  onUpdate: (updatedUser: { name: string; email: string; netId?: string; password?: string; photo?: File }) => void;
};

export function SettingsView({ user, onUpdate }: SettingsViewProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [netId, setNetId] = useState(user.netId || "");
  const [password, setPassword] = useState("");
  const [netIdPassword, setNetIdPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ name, email, netId, password, photo: photo || undefined });
  };

  return (
    <div className="p-4 relative">
      <h2 className="text-lg font-bold text-gray-700 mb-4">Settings</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-20">
        {/* Profile Photo */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            {photo ? (
              <img src={URL.createObjectURL(photo)} alt="Profile" className="rounded-full" />
            ) : (
              <AvatarFallback className="bg-gray-300 text-gray-600">?</AvatarFallback>
            )}
          </Avatar>
          <label className="text-sm font-medium text-gray-700">
            <span className="block mb-1">Profile Photo</span>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
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

        {/* NetID and NetID Password */}
        <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-semibold text-gray-700">NetID Information</h3>
          <label className="text-sm font-medium text-gray-700">
            <span className="block mb-1">NetID</span>
            <Input
              type="text"
              value={netId}
              onChange={(e) => setNetId(e.target.value)}
              placeholder="Enter your NetID"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            <span className="block mb-1">NetID Password</span>
            <Input
              type="password"
              value={netIdPassword}
              onChange={(e) => setNetIdPassword(e.target.value)}
              placeholder="Enter your NetID password"
            />
          </label>
        </div>
      </form>

      {/* Submit Button in the Lower Right */}
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