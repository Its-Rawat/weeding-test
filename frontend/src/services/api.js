// API Service for DIDI_Wedding (Chandrika & Xudong)
const API_BASE = (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : '') + '/api';

const TOKEN_KEY = 'didi_wedding_auth_token';

export const WeddingService = {
  // Session Auth Token Utilities
  getAuthToken() {
    try {
      return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  },

  setAuthToken(token, persist = true) {
    try {
      if (persist) {
        localStorage.setItem(TOKEN_KEY, token);
      }
      sessionStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error('Error saving auth token:', e);
    }
  },

  clearAuthToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem('didi_wedding_verified_party');
    } catch (e) {
      console.error('Error clearing auth token:', e);
    }
  },

  // Fetch overall wedding metadata
  async getWeddingInfo() {
    try {
      const res = await fetch(`${API_BASE}/wedding-info`);
      if (!res.ok) throw new Error('Network response not ok');
      return await res.json();
    } catch (err) {
      console.warn('Backend offline, using fallback wedding info:', err.message);
      return {
        brideName: "Chandrika",
        groomName: "Xudong",
        coupleTitle: "Chandrika & Xudong",
        monogram: "C & X",
        hostPrefix: "HOST:",
        hostName: "The Verma & Wang Families",
        weddingDate: "November 28, 2026",
        weddingDatesRange: "November 26 – 28, 2026",
        targetCountdownDate: "2026-11-28T18:00:00",
        eventCode: "CX2026",
        totalInvitedLimit: 100,
        locationCity: "Udaipur, Rajasthan, India",
        mainVenue: "The Oberoi Udaivilas, Haridas Ji Ki Magri, Udaipur",
        welcomeNote: "With joyful hearts and the blessings of our elders, we invite our closest family and friends to celebrate the wedding of Chandrika & Xudong.",
        tagline: "Two ancient cultures, two loving souls, one royal celebration in Udaipur.",
        rsvpDeadline: "November 10, 2026",
        hospitalityPhone: "+91 98765 43210",
        hospitalityEmail: "hospitality@chandrika-xudong.in"
      };
    }
  },

  // Fetch all ceremonies
  async getEvents() {
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (!res.ok) throw new Error('Network response not ok');
      return await res.json();
    } catch (err) {
      return [
        {
          id: 1,
          title: "Ganesh Puja & Mehndi Carnival",
          subtitle: "Intricate Henna artistry & Rajasthani Folk Rhythms",
          date: "November 26, 2026",
          time: "3:00 PM onwards",
          venueName: "Courtyard Lawns, The Oberoi Udaivilas",
          venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
          mapUrl: "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
          dressCode: "Vibrant Mehndi Greens, Mint & Pastel Florals",
          description: "Welcoming all 100 guests to celebrate as Chandrika adorns intricate bridal henna, joined by live folk singing, traditional bangles artisan, and street-chaat counters.",
          icon: "Sparkles",
          orderIndex: 1
        },
        {
          id: 2,
          title: "Haldi & Phoolon Ki Holi",
          subtitle: "Auspicious turmeric blessing with fragrant flower petals",
          date: "November 27, 2026",
          time: "10:30 AM",
          venueName: "Poolside Pavilions, Udaivilas",
          venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
          mapUrl: "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
          dressCode: "Sunny Yellows, Ochre & Marigold Orange",
          description: "A lively ceremony of turmeric paste blessings for both Chandrika & Xudong, accompanied by dhol drums and a joyous shower of fresh marigold and rose petals.",
          icon: "Sun",
          orderIndex: 2
        },
        {
          id: 3,
          title: "Sangeet & Cocktail Extravaganza",
          subtitle: "Jashn-e-Bahaar: High-energy dance and music",
          date: "November 27, 2026",
          time: "7:30 PM onwards",
          venueName: "Grand Royal Ballroom & Terrace",
          venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
          mapUrl: "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
          dressCode: "Glitz, Shimmer & Indo-Western Tuxedos / Lehengas",
          description: "Choreographed performances by family and friends celebrating Chandrika & Xudong's love story, followed by signature cocktails and live DJ music.",
          icon: "Music",
          orderIndex: 3
        },
        {
          id: 4,
          title: "Baraat & Varmala (The Royal Entry)",
          subtitle: "Grand procession & exchange of sacred floral garlands",
          date: "November 28, 2026",
          time: "4:30 PM",
          venueName: "Palace Main Gates & Lake Promenade",
          venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
          mapUrl: "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
          dressCode: "Royal Heritage Safas, Sherwanis & Banarasi Silks",
          description: "Xudong arrives with royal fanfare and brass band, followed by Chandrika's breathtaking bridal entry by Lake Pichola and the floral garland exchange.",
          icon: "Crown",
          orderIndex: 4
        },
        {
          id: 5,
          title: "Vivah Sanskar (Sacred 7 Phere)",
          subtitle: "Seven Vedic vows uniting two heritage cultures",
          date: "November 28, 2026",
          time: "6:30 PM (Lagna Muhurat)",
          venueName: "The Lotus Mandap, Floating Deck",
          venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
          mapUrl: "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
          dressCode: "Traditional Banarasi Silks & Regal Sherwanis",
          description: "The sacred nuptials performed around the holy agni under the starry skies of Udaipur, invoking eternal blessings for Chandrika and Xudong.",
          icon: "Flame",
          orderIndex: 5
        },
        {
          id: 6,
          title: "Royal Reception & Gala Banquet",
          subtitle: "Imperial feast with celebratory toasts",
          date: "November 28, 2026",
          time: "8:30 PM onwards",
          venueName: "Maharani Greens & Lakeview Lawn",
          venueAddress: "Haridas Ji Ki Magri, Udaipur, Rajasthan",
          mapUrl: "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
          dressCode: "Black Tie / Formal Evening Elegance",
          description: "A multi-course banquet celebrating the newlyweds with champagne toasts, cake cutting, live classical sitar and violin, and dinner under the stars.",
          icon: "Wine",
          orderIndex: 6
        }
      ];
    }
  },

  // =========================================================================
  // INVITATION PASS VALIDATION & SINGLE-USE REGISTRATION
  // =========================================================================

  async validateInvitation(tokenOrCode) {
    try {
      const res = await fetch(`${API_BASE}/auth/invitation/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenOrCode.trim() })
      });
      return await res.json();
    } catch (err) {
      console.warn('Validate invitation failed:', err);
      return { valid: false, status: 'INVALID', message: 'Unable to connect to invitation verification server.' };
    }
  },

  async registerInvitation({ token, email, primaryGuestName }) {
    try {
      const res = await fetch(`${API_BASE}/auth/invitation/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          email: email.trim().toLowerCase(),
          primaryGuestName: primaryGuestName ? primaryGuestName.trim() : ''
        })
      });
      const data = await res.json();
      if (data.authToken) {
        this.setAuthToken(data.authToken);
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Registration request failed. Please check network connection.' };
    }
  },

  // =========================================================================
  // RETURNING GUEST EMAIL LOGIN & OTP
  // =========================================================================

  async lookupEmail(email) {
    try {
      const res = await fetch(`${API_BASE}/auth/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'This email address was not found on the private invitation list.' };
    }
  },

  async sendVerificationCode(email) {
    try {
      const res = await fetch(`${API_BASE}/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });
      return await res.json();
    } catch (err) {
      return { success: true, demoCode: "882194", message: "Demo code 882194 generated for testing." };
    }
  },

  async verifyCode(email, code) {
    try {
      const res = await fetch(`${API_BASE}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() })
      });
      const data = await res.json();
      if (data.authToken) {
        this.setAuthToken(data.authToken);
      }
      return data;
    } catch (err) {
      return { success: false, message: "Verification failed. Please check code." };
    }
  },

  // =========================================================================
  // CURRENT SESSION AUTHENTICATION
  // =========================================================================

  async getCurrentUser() {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        this.clearAuthToken();
        return null;
      }
      const data = await res.json();
      return data.party || null;
    } catch (err) {
      console.warn('Failed to verify session token:', err);
      return null;
    }
  },

  // =========================================================================
  // RSVP & FAMILY MEMBERS
  // =========================================================================

  async submitFamilyRsvp(payload) {
    const token = this.getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/auth/family-rsvp`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update RSVP.');
    }
    return data;
  },

  async submitRsvp(payload) {
    const res = await fetch(`${API_BASE}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit RSVP.');
    }
    return data;
  },

  // =========================================================================
  // ADMIN INVITATION CREATION & MANIFEST
  // =========================================================================

  async createAdminInvitation(payload) {
    try {
      const res = await fetch(`${API_BASE}/auth/admin/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: 'Failed to create invitation pass.' };
    }
  },

  async getAdminInvitations(status = 'ALL') {
    try {
      const res = await fetch(`${API_BASE}/auth/admin/invitations?status=${status}`);
      if (!res.ok) throw new Error('Failed to load invitations');
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async getMasterList() {
    try {
      const res = await fetch(`${API_BASE}/auth/master-list`);
      if (!res.ok) throw new Error('Failed to load master list');
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  async getMasterStats() {
    try {
      const res = await fetch(`${API_BASE}/auth/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (err) {
      return {
        totalAllowedSeats: 100,
        confirmedHeadcount: 4,
        remainingSeats: 96,
        totalParties: 23,
        registeredParties: 21,
        unusedParties: 2,
        attendingParties: 1,
        declinedParties: 0,
        pendingParties: 22
      };
    }
  },

  // Wishes
  async getWishes() {
    try {
      const res = await fetch(`${API_BASE}/wishes`);
      if (!res.ok) throw new Error('Failed to fetch wishes');
      return await res.json();
    } catch (err) {
      return [
        {
          id: 1,
          senderName: "Aditya (Brother)",
          relation: "Bride's Brother",
          message: "Dearest Chandrika and Xudong Jiju, wishing you both a lifetime of love, intercultural adventures, and boundless happiness!",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          senderName: "Mr. & Mrs. Zhang",
          relation: "Groom's Parents",
          message: "Wishing Chandrika and Xudong eternal harmony, deep respect, and flourishing prosperity.",
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  async submitWish(wishData) {
    try {
      const res = await fetch(`${API_BASE}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wishData)
      });
      if (!res.ok) throw new Error('Failed to submit wish');
      return await res.json();
    } catch (err) {
      return { ...wishData, id: Date.now(), createdAt: new Date().toISOString() };
    }
  }
};
