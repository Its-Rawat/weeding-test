export interface PublicMember {
  name: string;
  attending: boolean;
}

export interface PublicInvitation {
  name: string;
  type: "FAMILY" | "INDIVIDUAL";
  status: "ACTIVE" | "INACTIVE";
  rsvpStatus: "PENDING" | "ATTENDING" | "NOT_ATTENDING";
  members: PublicMember[];
  message?: string;
  allowedEvents?: string[];
}

export interface SubmitRsvpPayload {
  rsvpStatus: "ATTENDING" | "NOT_ATTENDING";
  attendingMembers?: string[];
  message?: string;
}

export interface SubmitRsvpResponse {
  success: boolean;
  message: string;
  name: string;
  rsvpStatus: "ATTENDING" | "NOT_ATTENDING";
  attendingCount: number;
  respondedAt?: string;
}

export const personalizedRsvpService = {
  async getInvitation(token: string): Promise<PublicInvitation> {
    const res = await fetch(`/api/rsvp/${encodeURIComponent(token)}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("INVITATION_NOT_FOUND");
      }
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `Failed to fetch invitation (${res.status})`);
    }
    return res.json();
  },

  async submitRsvp(token: string, payload: SubmitRsvpPayload): Promise<SubmitRsvpResponse> {
    const res = await fetch(`/api/rsvp/${encodeURIComponent(token)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (res.status === 403 || data.message?.includes("inactive")) {
        throw new Error("INVITATION_INACTIVE");
      }
      throw new Error(data.message || "Failed to submit RSVP");
    }

    return res.json();
  },
};
