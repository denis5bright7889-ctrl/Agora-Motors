// client/src/pages/ProfilePage.jsx

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, Loader2, CheckCircle, Mail, Phone, ShieldCheck, HelpCircle } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="page-header">
        <div className="container-xl">
          <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        </div>
      </div>

      <div className="container-xl py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div>
          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl shadow-card p-1.5 mb-6 w-fit">
            <TabBtn active={tab === 'profile'} onClick={() => setTab('profile')} icon={<User size={15}/>} label="Profile" />
            <TabBtn active={tab === 'password'} onClick={() => setTab('password')} icon={<Lock size={15}/>} label="Password" />
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
            {tab === 'profile' ? (
              <ProfileForm user={user} onSave={(updated) => updateUser(updated)} />
            ) : (
              <PasswordForm />
            )}
          </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Account Summary</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <InfoRow icon={Mail} label="Email" value={user?.email || 'Not provided'} />
                <InfoRow icon={Phone} label="Phone" value={user?.phone || 'Not added'} />
                <InfoRow icon={ShieldCheck} label="Status" value="Secure account" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-semibold text-slate-800 mb-3">Security Tips</h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>Use a unique password for this account.</li>
                <li>Update your password regularly.</li>
                <li>Never share login details with anyone.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-2">
                <HelpCircle size={16} className="text-slate-500 mt-0.5" />
                <p className="text-sm text-slate-600">
                  Need help with your account? Contact support from the marketplace help section.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProfileForm({ user, onSave }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setSaved(false);
    try {
      const { data: res } = await authApi.updateProfile(data);
      onSave(res.user);
      setSaved(true);
      toast.success('Profile updated');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Profile Information</h2>

      {/* Avatar placeholder */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center
                        justify-center text-2xl font-bold uppercase">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div>
        <label className="label">Full Name</label>
        <input
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
          className={`input ${errors.name ? 'input-error' : ''}`}
        />
        {errors.name && <p className="field-error">{errors.name.message}</p>}
      </div>

      <div>
        <label className="label">Email</label>
        <input value={user?.email} disabled className="input bg-slate-50 text-slate-400 cursor-not-allowed" />
        <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
      </div>

      <div>
        <label className="label">Phone</label>
        <input
          {...register('phone')}
          className="input"
          placeholder="+254 700 000 000"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Saving…</> :
         saved   ? <><CheckCircle size={16} /> Saved</> : 'Save Changes'}
      </button>
    </form>
  );
}

function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Change Password</h2>

      <div>
        <label className="label">Current Password</label>
        <input
          type="password"
          {...register('currentPassword', { required: 'Current password is required' })}
          className={`input ${errors.currentPassword ? 'input-error' : ''}`}
        />
        {errors.currentPassword && <p className="field-error">{errors.currentPassword.message}</p>}
      </div>

      <div>
        <label className="label">New Password</label>
        <input
          type="password"
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
          className={`input ${errors.newPassword ? 'input-error' : ''}`}
        />
        {errors.newPassword && <p className="field-error">{errors.newPassword.message}</p>}
      </div>

      <div>
        <label className="label">Confirm New Password</label>
        <input
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm new password',
            validate: (v) => v === watch('newPassword') || 'Passwords do not match',
          })}
          className={`input ${errors.confirmPassword ? 'input-error' : ''}`}
        />
        {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Updating…</> : 'Update Password'}
      </button>
    </form>
  );
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors
                  ${active ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
    >
      {icon} {label}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={14} className="text-slate-400 mt-0.5" />
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-700">{value}</p>
      </div>
    </div>
  );
}
