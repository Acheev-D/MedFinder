import React, { useRef, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

export const AuthBottomSheet: React.FC = () => {
  const {
    isAuthModalOpen,
    authStep,
    phoneInput,
    setPhoneInput,
    otpInput,
    setOtpInput,
    authError,
    handleSendOtp,
    handleVerifyOtp,
    handleAutoFillOtp,
    closeAuthModal,
    activeOffer,
    t
  } = useSimulator();

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  // Auto focus first OTP input when transitioning to OTP step
  useEffect(() => {
    if (isAuthModalOpen && authStep === 'OTP') {
      setTimeout(() => {
        otpRefs[0].current?.focus();
      }, 150);
    }
  }, [isAuthModalOpen, authStep]);

  if (!isAuthModalOpen) return null;

  const handleOtpChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otpInput];
    newOtp[index] = clean;
    setOtpInput(newOtp);

    // Auto advance to next box if digit entered
    if (clean && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const maskedPhoneDisplay = phoneInput.length === 10
    ? `${phoneInput.slice(0, 5)}-XXXXX`
    : '98765-XXXXX';

  return (
    <div className="absolute inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-fade-in">
      {/* Slide-Up Frosted Glass Bottom Sheet */}
      <div className="bg-white/95 backdrop-blur-md rounded-t-[2.2rem] border-t border-slate-200/90 shadow-2xl p-6 space-y-4 animate-slide-up">
        
        {/* Sheet Handle & Close */}
        <div className="flex items-center justify-between pb-1">
          <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mr-2"></div>
          <button
            onClick={closeAuthModal}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {authStep === 'PHONE' ? (
          /* STEP 1: MOBILE INPUT */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-brand-700 text-[11px] font-bold border border-blue-200/60">
                <ShieldCheck className="w-3 h-3 text-brand-600" />
                <span>{t.authModalTitle}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                {t.authModalTitle}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {t.authModalDesc}
              </p>
            </div>

            {/* Medicine Quick Pill */}
            {activeOffer && (
              <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between text-xs">
                <div className="font-bold text-slate-800 truncate max-w-[200px]">
                  {activeOffer.medicineName}
                </div>
                <div className="font-extrabold text-brand-700 font-mono">
                  ₹{activeOffer.price.toFixed(2)}
                </div>
              </div>
            )}

            {/* Phone Input Box */}
            <div className="space-y-1">
              <label htmlFor="phone-input" className="text-xs font-bold text-slate-700 block">
                {t.phoneLabel}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-slate-500 font-mono">
                  +91
                </span>
                <input
                  id="phone-input"
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  maxLength={10}
                  autoFocus
                  className="w-full pl-12 pr-4 py-3 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-2xl focus:border-brand-500 focus:bg-white focus:outline-none text-slate-900 tracking-wider"
                />
              </div>
            </div>

            {/* Error message */}
            {authError && (
              <p className="text-xs font-semibold text-rose-600 text-center animate-slide-up">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all group cursor-pointer"
            >
              <span>{t.sendOtpBtn}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        ) : (
          /* STEP 2: 4-DIGIT OTP CONFIRMATION */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>{t.counterHoldDuration}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 leading-tight">
                {t.authModalTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.otpPrompt} <strong className="text-slate-800 font-mono">+91 {maskedPhoneDisplay}</strong>
              </p>
            </div>

            {/* 4-Digit Segmented Boxes */}
            <div className="flex justify-center items-center gap-2.5 py-1">
              {otpInput.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-13 text-center text-xl font-mono font-black bg-slate-50 border-2 border-slate-300 rounded-2xl focus:border-brand-600 focus:bg-white focus:outline-none text-slate-900 shadow-sm transition-all"
                />
              ))}
            </div>

            {/* Demo Helper Pill */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition-colors shadow-2xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                <span>{t.autoFillDemo}</span>
              </button>
            </div>

            {/* Error message */}
            {authError && (
              <p className="text-xs font-semibold text-rose-600 text-center animate-slide-up">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.verifyOtpBtn}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
