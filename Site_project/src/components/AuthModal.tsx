"use client";

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Phone, LogIn, UserPlus, LogOut, Package } from 'lucide-react';
import { apiLogin, apiRegister, apiGetMe, apiLogout, type ApiUser } from '@/lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      apiGetMe().then((u) => {
        if (u) setCurrentUser(u);
      });
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await apiLogin({ email: email.trim(), password });
      setCurrentUser(res.user);
      setSuccessMessage(`Welcome back, ${res.user.full_name}!`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await apiRegister({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        phone: phone.trim() || undefined
      });
      setCurrentUser(res.user);
      setSuccessMessage(`Account created successfully! Welcome, ${res.user.full_name}!`);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiLogout();
    setCurrentUser(null);
    setSuccessMessage('Logged out successfully.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 bg-[#111] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#C9A84C]" />
            <h3 className="font-extrabold text-base tracking-wide uppercase font-[family-name:var(--font-playfair)]">
              {currentUser ? 'My Account' : isLoginTab ? 'Customer Sign In' : 'Create an Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium">
              {successMessage}
            </div>
          )}

          {currentUser ? (
            /* Logged in state */
            <div className="space-y-4 py-2">
              <div className="p-4 bg-[#fbfbf9] rounded-2xl border border-neutral-200/80">
                <div className="font-extrabold text-base text-neutral-900">{currentUser.full_name}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{currentUser.email}</div>
                {currentUser.phone && (
                  <div className="text-xs text-neutral-500 mt-0.5">Phone: {currentUser.phone}</div>
                )}
                <div className="mt-2.5 inline-block text-[10px] font-black uppercase px-2.5 py-1 bg-[#C9A84C]/20 text-[#8f742f] rounded-lg">
                  {currentUser.role} Account
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href="/orders/track"
                  onClick={onClose}
                  className="w-full flex items-center justify-between p-3.5 bg-neutral-50 hover:bg-neutral-100 rounded-xl text-xs font-bold text-neutral-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#C9A84C]" /> Track My Orders
                  </span>
                  <span>→</span>
                </a>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 p-3 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Auth Tabs & Forms */
            <div>
              {/* Tab Selector */}
              <div className="flex border-b border-neutral-200 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginTab(true);
                    setErrorMessage('');
                  }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-all ${
                    isLoginTab
                      ? 'text-neutral-900 border-b-2 border-[#C9A84C]'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginTab(false);
                    setErrorMessage('');
                  }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-all ${
                    !isLoginTab
                      ? 'text-neutral-900 border-b-2 border-[#C9A84C]'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Register
                </button>
              </div>

              {isLoginTab ? (
                /* Login Form */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 bg-[#C9A84C] hover:bg-[#e8c96b] text-[#111] font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <LogIn className="w-4 h-4" />
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Usman Ali"
                        className="w-full pl-10 pr-4 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="03326457322"
                        className="w-full pl-10 pr-4 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Password (min. 6 characters) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-[#C9A84C] bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 bg-[#C9A84C] hover:bg-[#e8c96b] text-[#111] font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" />
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
