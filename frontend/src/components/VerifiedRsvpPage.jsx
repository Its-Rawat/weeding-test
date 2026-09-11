import React, { useState, useEffect } from 'react';
import { Mail, KeyRound, CheckCircle, ShieldAlert, ShieldCheck, Users, Heart, Music, QrCode, ArrowRight, User, Lock, UserX, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingService } from '../services/api';

export default function VerifiedRsvpPage({ onRsvpSubmitted, onViewPass, onNavigate, verifiedParty, setVerifiedParty }) {
  // Verification states
  const [emailInput, setEmailInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState(verifiedParty ? 'rsvp' : 'email'); // 'email', 'otp', 'rsvp', 'success'
  const [partyInfo, setPartyInfo] = useState(verifiedParty || null);
  const [demoCodeNotice, setDemoCodeNotice] = useState('');

  // Form states for family RSVP
  const [attendingStatus, setAttendingStatus] = useState(verifiedParty?.rsvpStatus || 'ATTENDING');
  const [confirmedHeadcount, setConfirmedHeadcount] = useState(verifiedParty?.confirmedHeadcount || verifiedParty?.allowedPartySize || 2);
  const [familyMembers, setFamilyMembers] = useState([
    { name: '', relationship: 'Primary Guest', diet: 'PURE_VEG', allergy: '', isAttending: true, absenceReason: '' },
    { name: '', relationship: 'Spouse', diet: 'PURE_VEG', allergy: '', isAttending: true, absenceReason: '' },
    { name: '', relationship: 'Child', diet: 'PURE_VEG', allergy: '', isAttending: true, absenceReason: '' },
    { name: '', relationship: 'Family Member', diet: 'PURE_VEG', allergy: '', isAttending: true, absenceReason: '' },
    { name: '', relationship: 'Family Member', diet: 'PURE_VEG', allergy: '', isAttending: true, absenceReason: '' },
    { name: '', relationship: 'Family Member', diet: 'PURE_VEG', allergy: '', isAttending: true, absenceReason: '' }
  ]);
  const [songRequest, setSongRequest] = useState(verifiedParty?.songRequest || '');
  const [blessingMessage, setBlessingMessage] = useState(verifiedParty?.blessingMessage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to check if this invitation has already been accepted
  const isAlreadyAccepted = partyInfo?.rsvpStatus === 'ATTENDING' || verifiedParty?.rsvpStatus === 'ATTENDING';

  // Sync state when verifiedParty prop updates
  useEffect(() => {
    if (verifiedParty) {
      setPartyInfo(verifiedParty);
      setStep('rsvp');
      if (verifiedParty.rsvpStatus) {
        setAttendingStatus(verifiedParty.rsvpStatus);
      }
      if (verifiedParty.confirmedHeadcount) setConfirmedHeadcount(verifiedParty.confirmedHeadcount);
      else if (verifiedParty.allowedPartySize) setConfirmedHeadcount(verifiedParty.allowedPartySize);
      if (verifiedParty.songRequest) setSongRequest(verifiedParty.songRequest);
      if (verifiedParty.blessingMessage) setBlessingMessage(verifiedParty.blessingMessage);

      // Pre-fill family members from party.members or attendingMembers string
      if (verifiedParty.members && verifiedParty.members.length > 0) {
        const loaded = verifiedParty.members.map((m, idx) => ({
          name: idx === 0 ? (verifiedParty.familyName || m.name) : (m.name || ''),
          relationship: m.relationship || (idx === 0 ? 'Primary Guest' : 'Family Member'),
          diet: m.dietaryPreference || 'PURE_VEG',
          allergy: m.allergyNotes || '',
          isAttending: m.isAttending !== false,
          absenceReason: m.absenceReason || ''
        }));
        while (loaded.length < 6) {
          loaded.push({ name: '', relationship: 'Family Member', diet: 'PURE_VEG', allergy: '', isAttending: true, absenceReason: '' });
        }
        setFamilyMembers(loaded);
      } else if (verifiedParty.attendingMembers) {
        const names = verifiedParty.attendingMembers.split(',').map(s => s.trim());
        const loaded = names.map((n, idx) => ({
          name: idx === 0 ? (verifiedParty.familyName || n) : n,
          relationship: idx === 0 ? 'Primary Guest' : 'Family Member',
          diet: 'PURE_VEG',
          allergy: '',
          isAttending: true,
          absenceReason: ''
        }));
        while (loaded.length < 6) {
          loaded.push({ name: '', relationship: 'Family Member', diet: 'PURE_VEG', allergy: '', isAttending: true, absenceReason: '' });
        }
        setFamilyMembers(loaded);
      } else {
        setFamilyMembers(prev => {
          const updated = [...prev];
          updated[0] = { ...updated[0], name: verifiedParty.familyName || '', relationship: 'Primary Guest', isAttending: true, absenceReason: '' };
          return updated;
        });
      }
    }
  }, [verifiedParty]);

  // Step 1: Check Email
  const handleEmailLookup = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setIsLookingUp(true);
    setErrorMessage('');
    setDemoCodeNotice('');

    try {
      const res = await WeddingService.lookupEmail(emailInput);
      if (!res.success) {
        setErrorMessage(res.message || "This email is not registered on the private 100-guest invitation list.");
        return;
      }

      setPartyInfo(res);
      setConfirmedHeadcount(res.allowedPartySize || 2);

      // Send verification code
      const codeRes = await WeddingService.sendVerificationCode(emailInput);
      if (codeRes.demoCode) {
        setDemoCodeNotice(`Verification code sent! (Dev Test Code: ${codeRes.demoCode})`);
        setCodeInput(codeRes.demoCode); // Auto-fill for ultra smooth testing
      } else {
        setDemoCodeNotice("A 6-digit verification code has been dispatched to your email.");
      }

      setStep('otp');
    } catch (err) {
      setErrorMessage("Unable to verify invitation list. Please check your connection.");
    } finally {
      setIsLookingUp(false);
    }
  };

  // Step 2: Verify Code
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!codeInput.trim()) return;

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const res = await WeddingService.verifyCode(emailInput, codeInput);
      if (!res.success) {
        setErrorMessage(res.message || "Invalid verification code.");
        return;
      }

      const party = res.party || partyInfo;
      setPartyInfo(party);
      if (setVerifiedParty) setVerifiedParty(party);
      if (party?.rsvpStatus) {
        setAttendingStatus(party.rsvpStatus);
      }
      if (party?.confirmedHeadcount) {
        setConfirmedHeadcount(party.confirmedHeadcount);
      } else if (party?.allowedPartySize) {
        setConfirmedHeadcount(party.allowedPartySize);
      }

      setStep('rsvp');
    } catch (err) {
      setErrorMessage("Verification code expired or invalid.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Update family member details
  const handleMemberChange = (idx, field, value) => {
    const updated = [...familyMembers];
    while (updated.length <= idx) {
      updated.push({
        name: '',
        relationship: 'Family Member',
        diet: 'PURE_VEG',
        allergy: '',
        isAttending: true,
        absenceReason: ''
      });
    }
    updated[idx] = { ...updated[idx], [field]: value };
    setFamilyMembers(updated);

    if (field === 'isAttending') {
      const totalAllowed = partyInfo?.allowedPartySize || 2;
      const attendingCount = updated.slice(0, totalAllowed).filter(m => m?.isAttending !== false).length;
      setConfirmedHeadcount(attendingCount);
    }
  };

  // Step 3: Submit RSVP
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Strictly enforce: "rsvpStatus" should not be declined after accepted
    if (isAlreadyAccepted && attendingStatus === 'DECLINED') {
      setErrorMessage("Your RSVP is already confirmed as Attending. Once accepted, reservations cannot be changed to Declined online. Please contact the wedding hospitality desk for assistance.");
      setIsSubmitting(false);
      return;
    }

    try {
      const totalAllowed = partyInfo?.allowedPartySize || 2;
      const activeMembers = Array.from({ length: totalAllowed }, (_, i) => familyMembers[i] || {
        name: '',
        relationship: i === 0 ? 'Primary Guest' : 'Family Member',
        diet: 'PURE_VEG',
        allergy: '',
        isAttending: true,
        absenceReason: ''
      });
      const attendingList = activeMembers.filter(m => m?.isAttending !== false);
      const finalStatus = isAlreadyAccepted ? 'ATTENDING' : attendingStatus;

      if (finalStatus === 'ATTENDING' && attendingList.length === 0) {
        setErrorMessage("At least one family member must be marked as Coming for an Attending RSVP. If your entire family is unable to attend, please contact the wedding hospitality desk.");
        setIsSubmitting(false);
        return;
      }

      const calculatedHeadcount = finalStatus === 'ATTENDING' ? attendingList.length : 0;
      const memberNamesStr = attendingList.map((m, i) => (m?.name || '').trim() || `Member ${i + 1}`).join(', ');
      const dietarySummary = attendingList.map(m => `${m?.name || 'Member'}: ${m?.diet || 'PURE_VEG'}`).join(' | ');
      const allergiesSummary = attendingList.map(m => m?.allergy ? `${m.name}: ${m.allergy}` : null).filter(Boolean).join(', ');

      const payload = {
        primaryEmail: partyInfo?.primaryEmail || partyInfo?.email || emailInput,
        rsvpStatus: finalStatus,
        confirmedHeadcount: calculatedHeadcount,
        attendingMembers: memberNamesStr,
        dietaryDetails: dietarySummary,
        allergies: allergiesSummary,
        songRequest: songRequest.trim(),
        blessingMessage: blessingMessage.trim(),
        members: activeMembers.map((m, i) => ({
          name: i === 0 ? (partyInfo?.familyName || m?.name?.trim() || '') : (m?.name?.trim() || (m?.isAttending !== false ? `Member ${i + 1}` : `Absent Member ${i + 1}`)),
          relationship: m?.relationship || (i === 0 ? 'Primary Guest' : 'Family Member'),
          isAttending: m?.isAttending !== false,
          dietaryPreference: m?.diet || 'PURE_VEG',
          allergyNotes: m?.allergy || '',
          absenceReason: m?.absenceReason || ''
        }))
      };

      const result = await WeddingService.submitFamilyRsvp(payload);
      if (result.success === false || result.error) {
        throw new Error(result.message || "Failed to submit RSVP.");
      }
      
      const fullParty = {
        ...partyInfo,
        ...result,
        rsvpStatus: finalStatus,
        confirmedHeadcount: calculatedHeadcount,
        attendingMembers: memberNamesStr,
        dietaryDetails: dietarySummary,
        isVerified: true
      };

      setPartyInfo(fullParty);
      if (setVerifiedParty) setVerifiedParty(fullParty);
      if (onRsvpSubmitted) onRsvpSubmitted(fullParty);

      // Celebration confetti
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#B73239', '#F39C12', '#FFFFFF']
      });

      setStep('success');
    } catch (err) {
      setErrorMessage(err.message || "Failed to submit RSVP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      
      <div className="bg-white rounded-2xl border-2 border-gold-300 shadow-xl p-5 sm:p-8 max-h-[85vh] overflow-y-auto">
        
        {/* STEP 1: EMAIL LOOKUP */}
        {step === 'email' && (
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gold-100 border border-gold-300 mx-auto flex items-center justify-center text-gold-800 shadow-sm">
              <Mail className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-gold-700">Private 100-Guest Invitation</span>
              <h3 className="text-2xl font-serif font-bold text-charcoal mt-0.5">
                Verify Your Family Invitation
              </h3>
              <p className="text-xs text-charcoal/60 mt-1 leading-relaxed">
                Enter your family's registered email address. Only 1 member per family needs to verify.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2 text-left">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleEmailLookup} className="space-y-3 pt-1">
              <input
                type="email"
                required
                placeholder="Enter Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white border border-gold-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
              />

              <button
                type="submit"
                disabled={isLookingUp}
                className="w-full py-2.5 px-4 bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLookingUp ? "Checking Invitation List..." : "Find My Invitation"}</span>
              </button>
            </form>

            <div className="pt-2 text-[11px] text-charcoal/50 border-t border-gold-100">
              <span className="font-semibold text-gold-800">Quick Test Emails:</span> rawat.family@example.com (4 guests), zhang.family@example.com (4 guests)
            </div>
          </div>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 'otp' && (
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-gold-100 border border-gold-300 mx-auto flex items-center justify-center text-gold-800 shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-green-700">Invitation Confirmed</span>
              <h3 className="text-2xl font-serif font-bold text-charcoal mt-0.5">
                Welcome, {partyInfo?.familyName}!
              </h3>
              <p className="text-xs text-charcoal/70 mt-1">
                Your invitation is reserved for up to <strong>{partyInfo?.allowedPartySize} family members</strong>.
              </p>
            </div>

            {demoCodeNotice && (
              <div className="p-3 bg-gold-50 border border-gold-300 rounded-xl text-gold-900 text-xs">
                {demoCodeNotice}
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-charcoal/80 mb-1">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="6-digit code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 bg-white border border-gold-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 px-4 bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {isVerifying ? "Verifying..." : "Verify & Unlock RSVP"}
              </button>
            </form>

            <button
              onClick={() => setStep('email')}
              className="text-xs text-charcoal/60 hover:text-gold-800 underline"
            >
              Use a different email
            </button>
          </div>
        )}

        {/* STEP 3: FAMILY RSVP DETAILS */}
        {step === 'rsvp' && (
          <form onSubmit={handleRsvpSubmit} className="space-y-4">
            
            {/* Header with verified badge */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b border-gold-200 pb-3 gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-green-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Family Invitation</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-charcoal">
                  RSVP for {partyInfo?.familyName}
                </h3>
              </div>

              <div className="text-right text-xs">
                <span className="text-charcoal/60 block text-[10px] uppercase font-bold">Party Quota</span>
                <span className="font-semibold text-gold-900 bg-gold-50 px-2.5 py-1 rounded-md border border-gold-200">
                  Up to {partyInfo?.allowedPartySize} Guests Allowed
                </span>
              </div>
            </div>

            {/* Attendance Toggle */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendingStatus('ATTENDING')}
                  className={`py-2.5 px-4 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    attendingStatus === 'ATTENDING'
                      ? 'border-gold-500 bg-gold-50 text-gold-900 shadow-sm'
                      : 'border-gray-200 text-charcoal/60 hover:border-gold-300'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-rani-600 fill-rani-600" />
                  Joyfully Accept
                </button>

                <button
                  type="button"
                  disabled={isAlreadyAccepted}
                  onClick={() => !isAlreadyAccepted && setAttendingStatus('DECLINED')}
                  className={`py-2.5 px-4 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isAlreadyAccepted
                      ? 'border-gray-200 bg-gray-100/80 text-gray-400 cursor-not-allowed opacity-60'
                      : attendingStatus === 'DECLINED'
                      ? 'border-charcoal bg-gray-100 text-charcoal'
                      : 'border-gray-200 text-charcoal/60 hover:border-gray-300'
                  }`}
                  title={isAlreadyAccepted ? "Once accepted, reservations cannot be changed to Declined online." : ""}
                >
                  {isAlreadyAccepted && <Lock className="w-3.5 h-3.5 text-gray-400" />}
                  Regretfully Decline
                </button>
              </div>

              {isAlreadyAccepted && (
                <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-start gap-2.5 shadow-sm">
                  <Lock className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold">RSVP Confirmed: </span>
                    <span>
                      Your attendance is already accepted and cannot be changed to Declined online. You can still adjust party attendee names, dietary requirements, and song requests below.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {attendingStatus === 'ATTENDING' && (
              <>
                {/* Family Attendance Summary Bar */}
                <div className="bg-gold-50/80 border border-gold-300 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-charcoal block">Family Attendance Roster</span>
                    <span className="text-[11px] text-charcoal/70">
                      Specify who from your {partyInfo?.allowedPartySize || 2}-member quota will be attending or unable to attend.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded-md border border-green-300 flex items-center gap-1 text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      {familyMembers.slice(0, partyInfo?.allowedPartySize || 2).filter(m => m?.isAttending !== false).length} Attending
                    </span>
                    {familyMembers.slice(0, partyInfo?.allowedPartySize || 2).filter(m => m?.isAttending === false).length > 0 && (
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-md border border-rose-300 flex items-center gap-1 text-[11px]">
                        <UserX className="w-3.5 h-3.5 text-rose-600" />
                        {familyMembers.slice(0, partyInfo?.allowedPartySize || 2).filter(m => m?.isAttending === false).length} Not Coming
                      </span>
                    )}
                  </div>
                </div>

                {/* Individual Member Cards with Coming / Not Coming Toggles */}
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/80">
                    Family Member Details ({partyInfo?.allowedPartySize || 2} Reserved Seats)
                  </label>

                  {Array.from({ length: partyInfo?.allowedPartySize || 2 }, (_, idx) => {
                    const member = familyMembers[idx] || {
                      name: '',
                      relationship: idx === 0 ? 'Primary Guest' : 'Family Member',
                      diet: 'PURE_VEG',
                      allergy: '',
                      isAttending: true,
                      absenceReason: ''
                    };
                    const isMemberAttending = member.isAttending !== false;

                    return (
                      <div
                        key={idx}
                        className={`p-3 sm:p-4 rounded-xl border transition-all ${
                          isMemberAttending
                            ? 'bg-gold-50/50 border-gold-300 shadow-sm'
                            : 'bg-rose-50/50 border-rose-200 opacity-95'
                        }`}
                      >
                        {/* Member Card Header with Coming/Not Coming Switch */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2.5 border-b border-gold-200/70">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-gold-200 text-gold-900 font-bold text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-charcoal">
                              {idx === 0 ? "Primary Invitee (Host Reserved)" : `Family Member ${idx + 1}`}
                            </span>
                            {idx === 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-gold-800 bg-gold-100 px-1.5 py-0.5 rounded border border-gold-300">
                                <Lock className="w-2.5 h-2.5 text-gold-600" />
                                <span>Locked</span>
                              </span>
                            )}
                          </div>

                          {/* Coming vs Not Coming toggle buttons */}
                          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gold-200">
                            <button
                              type="button"
                              onClick={() => handleMemberChange(idx, 'isAttending', true)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                                isMemberAttending
                                  ? 'bg-green-600 text-white shadow-sm'
                                  : 'text-charcoal/60 hover:text-charcoal hover:bg-gray-50'
                              }`}
                            >
                              <CheckCircle className="w-3 h-3" />
                              <span>Coming</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleMemberChange(idx, 'isAttending', false)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                                !isMemberAttending
                                  ? 'bg-rose-600 text-white shadow-sm'
                                  : 'text-charcoal/60 hover:text-charcoal hover:bg-gray-50'
                              }`}
                            >
                              <UserX className="w-3 h-3" />
                              <span>Not Coming</span>
                            </button>
                          </div>
                        </div>

                        {/* Fields when COMING */}
                        {isMemberAttending ? (
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                            <div className="sm:col-span-4">
                              <label className="block text-[10px] uppercase font-bold text-charcoal/60 mb-0.5">
                                {idx === 0 ? "Primary Invitee *" : `Guest ${idx + 1} Full Name *`}
                              </label>
                              {idx === 0 ? (
                                <div className="relative">
                                  <input
                                    type="text"
                                    readOnly
                                    disabled
                                    value={familyMembers[0]?.name || partyInfo?.familyName || ''}
                                    className="w-full pl-2.5 pr-7 py-1.5 text-xs bg-gold-100/60 border border-gold-300 rounded-md text-charcoal/90 font-semibold cursor-not-allowed select-none shadow-inner"
                                  />
                                  <Lock className="w-3 h-3 text-gold-600 absolute right-2 top-2 pointer-events-none" />
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  required
                                  placeholder={`Full Name of Guest ${idx + 1}`}
                                  value={familyMembers[idx]?.name || ''}
                                  onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-gold-300 rounded-md focus:outline-none"
                                />
                              )}
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-[10px] uppercase font-bold text-charcoal/60 mb-0.5">
                                Relationship
                              </label>
                              <select
                                value={familyMembers[idx]?.relationship || (idx === 0 ? 'Primary Guest' : 'Family Member')}
                                onChange={(e) => handleMemberChange(idx, 'relationship', e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-white border border-gold-300 rounded-md focus:outline-none"
                              >
                                <option value="Primary Guest">Primary Guest</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Child">Child</option>
                                <option value="Parent">Parent</option>
                                <option value="Sibling">Sibling</option>
                                <option value="Relative">Relative</option>
                                <option value="Friend">Friend</option>
                              </select>
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-[10px] uppercase font-bold text-charcoal/60 mb-0.5">
                                Diet Preference
                              </label>
                              <select
                                value={familyMembers[idx]?.diet || 'PURE_VEG'}
                                onChange={(e) => handleMemberChange(idx, 'diet', e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-white border border-gold-300 rounded-md focus:outline-none"
                              >
                                <option value="PURE_VEG">Pure Vegetarian</option>
                                <option value="JAIN_VEG">Jain Vegetarian</option>
                                <option value="NON_VEG">Non-Vegetarian</option>
                              </select>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] uppercase font-bold text-charcoal/60 mb-0.5">
                                Allergies
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Nut-free"
                                value={familyMembers[idx]?.allergy || ''}
                                onChange={(e) => handleMemberChange(idx, 'allergy', e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-white border border-gold-300 rounded-md focus:outline-none"
                              />
                            </div>
                          </div>
                        ) : (
                          /* Fields when NOT COMING */
                          <div className="space-y-2 pt-0.5">
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                              <div className="sm:col-span-4">
                                <label className="block text-[10px] uppercase font-bold text-rose-800 mb-0.5">
                                  Who is unable to attend? *
                                </label>
                                {idx === 0 ? (
                                  <div className="relative">
                                    <input
                                      type="text"
                                      readOnly
                                      disabled
                                      value={familyMembers[0]?.name || partyInfo?.familyName || ''}
                                      className="w-full pl-2.5 pr-7 py-1.5 text-xs bg-rose-100/60 border border-rose-300 rounded-md text-charcoal font-semibold cursor-not-allowed"
                                    />
                                    <Lock className="w-3 h-3 text-rose-600 absolute right-2 top-2 pointer-events-none" />
                                  </div>
                                ) : (
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Rohan Rawat"
                                    value={familyMembers[idx]?.name || ''}
                                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-rose-300 rounded-md focus:outline-none"
                                  />
                                )}
                              </div>

                              <div className="sm:col-span-3">
                                <label className="block text-[10px] uppercase font-bold text-charcoal/60 mb-0.5">
                                  Relationship
                                </label>
                                <select
                                  value={familyMembers[idx]?.relationship || 'Family Member'}
                                  onChange={(e) => handleMemberChange(idx, 'relationship', e.target.value)}
                                  className="w-full px-2 py-1.5 text-xs bg-white border border-rose-300 rounded-md focus:outline-none"
                                >
                                  <option value="Spouse">Spouse</option>
                                  <option value="Child">Child</option>
                                  <option value="Parent">Parent</option>
                                  <option value="Sibling">Sibling</option>
                                  <option value="Relative">Relative</option>
                                  <option value="Friend">Friend</option>
                                </select>
                              </div>

                              <div className="sm:col-span-5">
                                <label className="block text-[10px] uppercase font-bold text-charcoal/60 mb-0.5">
                                  Reason for Not Attending (Optional)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Work commitments, College exams"
                                  value={familyMembers[idx]?.absenceReason || ''}
                                  onChange={(e) => handleMemberChange(idx, 'absenceReason', e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-rose-300 rounded-md focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-rose-700 bg-rose-100/70 px-2.5 py-1.5 rounded-lg border border-rose-200">
                              <Mail className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                              <span>
                                An alert will be automatically emailed to <strong>adi2002rawat@gmail.com</strong> so host seating and catering plans can be updated.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Sangeet Song Request */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Family Sangeet Dance Song Recommendation
                  </label>
                  <div className="relative">
                    <Music className="w-3.5 h-3.5 text-gold-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Gallan Goodiyan, London Thumakda"
                      value={songRequest}
                      onChange={(e) => setSongRequest(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Blessing Message */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Warm Blessing for Chandrika & Xudong
              </label>
              <textarea
                rows={2}
                placeholder="Share your loving congratulations..."
                value={blessingMessage}
                onChange={(e) => setBlessingMessage(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Pass Permanence Alert */}
            <div className="p-3 rounded-xl bg-gold-50/80 border border-gold-200/90 text-xs text-charcoal/70 flex items-start gap-2">
              <Lock className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-gold-900 block text-[11px] uppercase tracking-wider">Permanent Invitation Security</span>
                <p className="text-[11px] leading-relaxed">
                  Your invitation pass is permanently associated with <strong>{partyInfo?.primaryEmail || partyInfo?.email || 'your registered account'}</strong>. You can return and update your family members anytime without resetting or altering your invitation pass.
                </p>
              </div>
            </div>

            {/* Host Email Alert Notice when any member is absent */}
            {familyMembers.slice(0, partyInfo?.allowedPartySize || 2).some(m => m?.isAttending === false) && (
              <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-300/80 text-xs text-amber-900 flex items-start gap-2 shadow-sm">
                <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-[11px] uppercase tracking-wider">Host Email Notification</span>
                  <p className="text-[11px] leading-relaxed">
                    Notice: One or more family members are marked as unable to attend. A notification email with family details and absent person information will be automatically dispatched to <strong>adi2002rawat@gmail.com</strong> upon confirmation.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? "Locking Family RSVP..." : "Confirm Attendance & Generate VIP Pass"}</span>
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION & PASS LINK */}
        {step === 'success' && (
          <div className="text-center py-5 space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-500 mx-auto flex items-center justify-center text-green-600 shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-gold-700">Official Pass Issued</span>
              <h3 className="text-2xl font-serif font-bold text-charcoal mt-0.5">
                RSVP Locked for {partyInfo?.familyName}!
              </h3>
              <p className="text-xs text-charcoal/70 max-w-md mx-auto mt-1 leading-relaxed">
                {attendingStatus === 'ATTENDING'
                  ? `Your official digital wedding pass for ${confirmedHeadcount} member(s) has been verified and registered.`
                  : "Thank you for letting us know. You will be remembered warmly in our hearts."}
              </p>
            </div>

            {attendingStatus === 'ATTENDING' && (
              <div className="p-3.5 bg-gold-50 border border-gold-300 rounded-xl max-w-md mx-auto text-xs space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Pass Serial:</span>
                  <span className="font-mono font-bold text-gold-900">{partyInfo?.passSerial || "CX-VIP-101"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Confirmed Guests:</span>
                  <span className="font-semibold text-charcoal">{confirmedHeadcount} Attending</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Assigned Seating:</span>
                  <span className="font-semibold text-charcoal">{partyInfo?.assignedTable || "Table 1 - Royal Lotus"}</span>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              {attendingStatus === 'ATTENDING' && (
                <button
                  onClick={() => {
                    if (onViewPass) onViewPass(partyInfo);
                    if (onNavigate) onNavigate('pass');
                  }}
                  className="px-6 py-2.5 bg-gold-gradient text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  View & Print Verified Pass
                </button>
              )}

              <button
                onClick={() => onNavigate('traditions')}
                className="px-5 py-2.5 border border-gold-400 hover:bg-gold-50 text-gold-900 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors"
              >
                View Cultural Etiquette Guide
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
