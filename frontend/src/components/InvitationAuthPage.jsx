import React, { useState, useEffect } from 'react';
import { Mail, QrCode, KeyRound, ShieldCheck, Sparkles, ArrowRight, CheckCircle, AlertCircle, Heart, Lock, RefreshCw } from 'lucide-react';
import { WeddingService } from '../services/api';

export default function InvitationAuthPage({ onAuthenticated, initialToken = '' }) {
  const [activeTab, setActiveTab] = useState('invite'); // 'invite' or 'email'
  
  // Tab 1: Invitation Link / Token / QR State
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [tokenValidation, setTokenValidation] = useState(null); // { valid, status, familyName, allowedPartySize, message, registeredEmailObfuscated }
  const [tokenError, setTokenError] = useState('');
  
  // First-time Registration State (when token is valid & UNUSED)
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Tab 2: Returning Guest Email Login State
  const [lastRegisteredEmail, setLastRegisteredEmail] = useState(() => {
    try {
      return localStorage.getItem('didi_wedding_last_registered_email') || '';
    } catch (e) {
      return '';
    }
  });
  const [emailInput, setEmailInput] = useState(() => {
    try {
      return localStorage.getItem('didi_wedding_last_registered_email') || '';
    } catch (e) {
      return '';
    }
  });
  const [codeInput, setCodeInput] = useState('');
  const [isEmailLookingUp, setIsEmailLookingUp] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [emailStep, setEmailStep] = useState('enter_email'); // 'enter_email' or 'enter_otp'
  const [emailLookupResult, setEmailLookupResult] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [otpNotice, setOtpNotice] = useState('');

  // Helper to suggest correction for common domain typos (e.g. gamil.com -> gmail.com)
  const getTypoSuggestion = (email) => {
    if (!email || !email.includes('@')) return null;
    const parts = email.split('@');
    if (parts.length !== 2) return null;
    const domain = parts[1].toLowerCase().trim();
    const typoMap = {
      'gamil.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmaill.com': 'gmail.com',
      'gmal.com': 'gmail.com',
      'gemail.com': 'gmail.com',
      'gmail.co': 'gmail.com',
      'yaho.com': 'yahoo.com',
      'yahooo.com': 'yahoo.com',
      'yhaoo.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
      'hotmaill.com': 'hotmail.com',
      'homail.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
      'outloo.com': 'outlook.com',
      'iclud.com': 'icloud.com',
      'icoud.com': 'icloud.com',
    };
    if (typoMap[domain]) {
      return `${parts[0]}@${typoMap[domain]}`;
    }
    return null;
  };

  // Auto-validate if initial token exists from URL
  useEffect(() => {
    if (initialToken && initialToken.trim()) {
      handleValidateToken(initialToken.trim());
    }
  }, [initialToken]);

  // Validate Invitation Token or Code
  const handleValidateToken = async (tokenToTest) => {
    const raw = tokenToTest || tokenInput;
    if (!raw || !raw.trim()) {
      setTokenError('Please enter an invitation token or pass code.');
      return;
    }

    setIsValidatingToken(true);
    setTokenError('');
    setTokenValidation(null);
    setRegisterError('');

    try {
      const res = await WeddingService.validateInvitation(raw.trim());
      setTokenValidation(res);

      if (res.valid && res.status === 'UNUSED') {
        if (res.familyName && !registerName) {
          setRegisterName(res.familyName);
        }
      } else if (res.status === 'ALREADY_REGISTERED') {
        setTokenError(res.message || 'This invitation has already been registered.');
      } else {
        setTokenError(res.message || 'This invitation link is invalid or expired.');
      }
    } catch (err) {
      setTokenError('Failed to connect to verification server. Please try again.');
    } finally {
      setIsValidatingToken(false);
    }
  };

  // Submit First-Time Registration
  const handleRegisterInvitation = async (e) => {
    e.preventDefault();
    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setRegisterError('Please enter a valid email address.');
      return;
    }

    const token = tokenInput.trim();
    if (!token) {
      setRegisterError('Invitation token is missing.');
      return;
    }

    setIsRegistering(true);
    setRegisterError('');

    try {
      const res = await WeddingService.registerInvitation({
        token,
        email: registerEmail.trim(),
        primaryGuestName: tokenValidation?.familyName || registerName.trim()
      });

      if (!res.success) {
        setRegisterError(res.message || 'Registration failed. Please try again.');
        return;
      }

      // Successfully claimed invitation!
      try {
        localStorage.setItem('didi_wedding_last_registered_email', registerEmail.trim());
        setLastRegisteredEmail(registerEmail.trim());
      } catch (e) {}

      if (onAuthenticated) {
        onAuthenticated(res.party);
      }
    } catch (err) {
      setRegisterError('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Returning Guest: Request Email OTP
  const handleRequestEmailOtp = async (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsEmailLookingUp(true);
    setEmailError('');
    setOtpNotice('');

    try {
      const lookup = await WeddingService.lookupEmail(emailInput.trim());
      if (!lookup.success) {
        // Check if there's a suggested domain typo
        const suggestion = getTypoSuggestion(emailInput);
        if (suggestion) {
          setEmailError(`Email not found. Did you mean ${suggestion}?`);
        } else {
          setEmailError(lookup.message || 'This email was not found on the private invitation list.');
        }
        return;
      }

      // Sync to canonical email if server fixed a typo
      const canonicalEmail = lookup.email || emailInput.trim();
      if (canonicalEmail.toLowerCase() !== emailInput.toLowerCase()) {
        setEmailInput(canonicalEmail);
      }

      try {
        localStorage.setItem('didi_wedding_last_registered_email', canonicalEmail);
        setLastRegisteredEmail(canonicalEmail);
      } catch (e) {}

      setEmailLookupResult(lookup);

      const codeRes = await WeddingService.sendVerificationCode(canonicalEmail);
      if (!codeRes.success) {
        setEmailError(codeRes.message || 'Failed to generate verification code.');
        return;
      }

      if (codeRes.demoCode) {
        setOtpNotice(`6-digit code sent! (Dev Test Code: ${codeRes.demoCode})`);
        setCodeInput(codeRes.demoCode); // Auto-fill for developer convenience
      } else {
        setOtpNotice('A 6-digit verification code has been dispatched to your email.');
      }

      setEmailStep('enter_otp');
    } catch (err) {
      setEmailError('Unable to connect to verification server.');
    } finally {
      setIsEmailLookingUp(false);
    }
  };

  // Returning Guest: Verify OTP
  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    if (!codeInput.trim()) {
      setEmailError('Please enter the 6-digit code.');
      return;
    }

    setIsVerifyingCode(true);
    setEmailError('');

    try {
      const res = await WeddingService.verifyCode(emailInput.trim(), codeInput.trim());
      if (!res.success) {
        setEmailError(res.message || 'Invalid or expired verification code.');
        return;
      }

      // Successful login!
      if (onAuthenticated) {
        onAuthenticated(res.party);
      }
    } catch (err) {
      setEmailError('Verification failed. Please try again.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAF7F2] relative overflow-hidden py-10 px-4 select-none">
      
      {/* Background Decorative Floral & Gold Mandala Motifs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-rani-200/20 blur-3xl pointer-events-none" />

      {/* Outer Royal Card Container */}
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-gold-300/80 p-6 sm:p-10 text-charcoal flex flex-col z-10 animate-fade-in">
        
        {/* Royal Crest / Monogram Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-gold-100 via-white to-gold-200 border border-gold-400/60 shadow-inner mb-3">
            <span className="font-serif font-bold text-2xl text-gold-800 tracking-wider">C & X</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="h-[1px] w-8 bg-gold-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-700">The Royal Wedding Portal</span>
            <span className="h-[1px] w-8 bg-gold-400" />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
            Chandrika & Xudong
          </h1>
          <p className="text-xs text-charcoal/60 mt-1 font-serif italic">
            November 26 – 28, 2026 • The Oberoi Udaivilas, Udaipur
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-gold-50/70 border border-gold-200/80 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('invite'); setTokenError(''); setRegisterError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'invite'
                ? 'bg-white text-gold-900 shadow-sm border border-gold-300'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            <QrCode className="w-4 h-4 text-gold-600" />
            <span>Invitation Pass / QR</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('email'); setEmailError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'email'
                ? 'bg-white text-gold-900 shadow-sm border border-gold-300'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            <Mail className="w-4 h-4 text-gold-600" />
            <span>Email Sign-In</span>
          </button>
        </div>

        {/* TAB 1: INVITATION PASS & FIRST-TIME REGISTRATION */}
        {activeTab === 'invite' && (
          <div className="flex flex-col space-y-4">
            
            {!tokenValidation || !tokenValidation.valid ? (
              <>
                <div className="text-center mb-1">
                  <h3 className="font-serif text-base font-bold text-charcoal">
                    Enter Your Invitation Pass or Scan QR Code
                  </h3>
                  <p className="text-xs text-charcoal/60 mt-0.5">
                    Each invited party holds a private single-use invitation pass.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                      Invitation Pass Code or Secure Token
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tokenInput}
                        onChange={(e) => { setTokenInput(e.target.value); setTokenError(''); }}
                        placeholder="e.g. INV-CX2026 or paste your secure invite token"
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-gold-300 bg-gold-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 font-mono tracking-wide"
                      />
                      <QrCode className="absolute right-3.5 top-3.5 w-4 h-4 text-gold-500 pointer-events-none" />
                    </div>
                  </div>

                  {tokenError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p>{tokenError}</p>
                        {tokenValidation?.status === 'ALREADY_REGISTERED' && (
                          <button
                            type="button"
                            onClick={() => setActiveTab('email')}
                            className="text-xs font-bold text-rani-700 underline mt-1 block"
                          >
                            Click here to Sign In with your registered email →
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleValidateToken()}
                    disabled={isValidatingToken || !tokenInput.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-gold-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isValidatingToken ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Invitation...</span>
                      </>
                    ) : (
                      <>
                        <span>Validate Invitation Pass</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Invitation is VALID and UNUSED -> Prompt for Email to claim */
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm mb-1">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Official Invitation Verified!</span>
                  </div>
                  <p className="text-emerald-700">
                    Welcome, <strong className="font-bold">{tokenValidation.familyName}</strong>! You have been reserved a private party quota of <strong className="font-bold">{tokenValidation.allowedPartySize} guests</strong> at {tokenValidation.assignedTable || 'The Lotus Pavilion'}.
                  </p>
                </div>

                <form onSubmit={handleRegisterInvitation} className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70">
                        Primary Invitee Name
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gold-800 bg-gold-100/90 px-2 py-0.5 rounded-md border border-gold-300">
                        <Lock className="w-3 h-3 text-gold-600" />
                        <span>Reserved by Host • Unchangeable</span>
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={tokenValidation?.familyName || registerName}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gold-200 bg-gold-50/50 text-sm font-semibold text-charcoal/80 cursor-not-allowed select-none shadow-inner"
                      />
                      <Lock className="absolute right-3.5 top-3 w-4 h-4 text-gold-500 pointer-events-none" />
                    </div>
                    <span className="text-[10px] text-charcoal/50 block mt-1">
                      This invitation pass is strictly reserved for <strong>{tokenValidation?.familyName}</strong> and cannot be altered.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                      Your Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="Enter your email to permanently link your pass"
                      className="w-full px-4 py-2.5 rounded-xl border border-gold-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    <span className="text-[10px] text-charcoal/50 block mt-1">
                      This email will be permanently associated with your invitation pass and used for future logins and RSVP updates.
                    </span>
                  </div>

                  {registerError && (
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{registerError}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setTokenValidation(null)}
                      className="px-4 py-2.5 rounded-xl border border-gold-300 text-charcoal text-xs font-semibold hover:bg-gold-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isRegistering || !registerEmail.trim()}
                      className="flex-1 py-3 px-4 rounded-xl bg-gold-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isRegistering ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Registering Pass...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Confirm & Enter Wedding Portal</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Quick Helper Test Pass Pills */}
            <div className="mt-4 pt-4 border-t border-gold-200/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50 block mb-2">
                Quick Test Invitation Passes (Pre-Seeded)
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput('demo-invitation-token-12345');
                    handleValidateToken('demo-invitation-token-12345');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gold-100/60 hover:bg-gold-200/70 border border-gold-300 text-[11px] font-semibold text-gold-900 transition-colors"
                >
                  🎟️ Unused Pass 1 (Choudhary Family • 4 Seats)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput('demo-vip-token-xudong');
                    handleValidateToken('demo-vip-token-xudong');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gold-100/60 hover:bg-gold-200/70 border border-gold-300 text-[11px] font-semibold text-gold-900 transition-colors"
                >
                  🎟️ Unused Pass 2 (Li Family • 3 Seats)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: RETURNING GUEST EMAIL LOGIN */}
        {activeTab === 'email' && (
          <div className="flex flex-col space-y-4">
            <div className="text-center mb-1">
              <h3 className="font-serif text-base font-bold text-charcoal">
                Returning Guest Sign-In
              </h3>
              <p className="text-xs text-charcoal/60 mt-0.5">
                Sign in with the email linked to your wedding invitation.
              </p>
            </div>

            {emailStep === 'enter_email' ? (
              <form onSubmit={handleRequestEmailOtp} className="space-y-3">
                {lastRegisteredEmail && (
                  <div className="p-2.5 rounded-xl bg-gold-50/90 border border-gold-300/80 flex items-center justify-between text-xs animate-fade-in">
                    <div className="flex items-center gap-1.5 text-gold-900 truncate mr-2">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span className="font-semibold text-[11px] uppercase tracking-wider text-gold-700 shrink-0">Your Email:</span>
                      <span className="font-mono text-gold-950 font-bold truncate">{lastRegisteredEmail}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailInput(lastRegisteredEmail);
                        setEmailError('');
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold text-white bg-gold-600 hover:bg-gold-700 rounded-lg shadow-sm transition-all shrink-0"
                    >
                      Fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                    Your Registered Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
                      placeholder="Enter Email"
                      className="w-full pl-4 pr-10 py-3 rounded-xl border border-gold-300 bg-gold-50/20 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 font-sans"
                    />
                    <Mail className="absolute right-3.5 top-3.5 w-4 h-4 text-gold-500 pointer-events-none" />
                  </div>

                  {/* Real-time typo suggestion */}
                  {(() => {
                    const suggestion = getTypoSuggestion(emailInput);
                    if (!suggestion) return null;
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          setEmailInput(suggestion);
                          setEmailError('');
                        }}
                        className="mt-1.5 w-full text-left p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between hover:bg-amber-100 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Did you mean <strong>{suggestion}</strong>?</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/90 px-2 py-0.5 rounded text-amber-950">
                          Click to fix
                        </span>
                      </button>
                    );
                  })()}
                </div>

                {emailError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isEmailLookingUp || !emailInput.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-gold-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isEmailLookingUp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Checking Invitation List...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit Login Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Enter OTP */
              <form onSubmit={handleVerifyEmailOtp} className="space-y-3 animate-fade-in">
                <div className="p-3 rounded-xl bg-gold-50 border border-gold-200 text-xs text-gold-900">
                  <p className="font-semibold">Verification Code Sent</p>
                  <p className="text-charcoal/70 mt-0.5">
                    We sent a 6-digit code to <strong>{emailInput}</strong>.
                  </p>
                  {otpNotice && (
                    <p className="mt-1 text-rani-700 font-mono font-bold">{otpNotice}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-1">
                    Enter 6-Digit OTP Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={codeInput}
                      onChange={(e) => { setCodeInput(e.target.value); setEmailError(''); }}
                      placeholder="• • • • • •"
                      className="w-full py-3 px-4 text-center tracking-[0.5em] font-mono text-xl font-bold rounded-xl border border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    <KeyRound className="absolute right-3.5 top-3.5 w-4 h-4 text-gold-500 pointer-events-none" />
                  </div>
                </div>

                {emailError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setEmailStep('enter_email')}
                    className="px-4 py-2.5 rounded-xl border border-gold-300 text-charcoal text-xs font-semibold hover:bg-gold-50"
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingCode || !codeInput.trim()}
                    className="flex-1 py-3 px-4 rounded-xl bg-gold-gradient hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifyingCode ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* Footer Security Badge */}
        <div className="mt-8 pt-4 border-t border-gold-200/80 flex items-center justify-center text-xs text-charcoal/60">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-gold-600" />
            <span>Private 100-Guest Royal Invitation Portal • Confidential</span>
          </span>
        </div>

      </div>

    </div>
  );
}
