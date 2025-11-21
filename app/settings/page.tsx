'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { User, AlertCircle, LogOut } from 'lucide-react';
import { closeApp } from '@/lib/telegram';

export default function SettingsPage() {
  const { user, noShowCount, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    campus: '',
    gender: '',
    collegeYear: '',
    department: '',
    religion: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadProfile();
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        location: user.location || '',
        campus: user.campus || '',
        gender: user.gender || '',
        collegeYear: user.collegeYear || '',
        department: user.department || '',
        religion: user.religion || '',
      });
    }
  }, [user]);

  async function loadProfile() {
    try {
      setIsLoading(true);
      const data = await api.getProfile();
      useAuthStore.getState().setNoShowCount(data.noShowCount);
      setUser({ ...data.user });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      const data = await api.updateProfile(formData);
      setUser({ ...user, ...data.user });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    if (confirm('Close the app?')) {
      closeApp();
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4 pb-24">
      <h1 className="text-2xl font-bold text-foreground font-sans mb-2">Settings</h1>

      {/* Profile Header */}
      <GlassCard>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <User size={28} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground">
              {user?.firstName || user?.username || 'User'}
            </h2>
            {user?.username && (
              <p className="text-muted-foreground text-sm mt-0.5">@{user.username}</p>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Personal Information Form */}
      <GlassCard>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Personal Information
        </h3>
        <div className="space-y-4">
          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Addis Ababa"
              className="w-full h-8 bg-background/50 rounded px-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Campus */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Campus</label>
            <input
              type="text"
              value={formData.campus}
              onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
              placeholder="e.g. 4 Kilo"
              className="w-full h-8 bg-background/50 rounded px-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full h-8 bg-background/50 rounded px-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* College Year */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">College Year</label>
            <input
              type="text"
              value={formData.collegeYear}
              onChange={(e) => setFormData({ ...formData, collegeYear: e.target.value })}
              placeholder="e.g. 3rd Year"
              className="w-full h-8 bg-background/50 rounded px-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Computer Science"
              className="w-full h-8 bg-background/50 rounded px-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Religion */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Religion</label>
            <input
              type="text"
              value={formData.religion}
              onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
              placeholder="e.g. Orthodox"
              className="w-full h-8 bg-background/50 rounded px-3 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <GlassButton
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </GlassButton>
        </div>
      </GlassCard>

      {/* Stats */}
      <GlassCard>
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">bar_chart</span>
          Account Stats
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground text-sm">No-Show Count</span>
            </div>
            <span className="text-foreground font-bold">{noShowCount}</span>
          </div>
        </div>
      </GlassCard>

      {/* Actions */}
      <GlassButton
        variant="danger"
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 h-12"
      >
        <LogOut size={18} />
        <span className="font-semibold">Close App</span>
      </GlassButton>
    </div>
  );
}

