package com.wedding.didi.config;

import com.wedding.didi.model.FamilyMember;
import com.wedding.didi.model.GuestWish;
import com.wedding.didi.model.InvitedParty;
import com.wedding.didi.model.WeddingEvent;
import com.wedding.didi.repository.FamilyMemberRepository;
import com.wedding.didi.repository.GuestWishRepository;
import com.wedding.didi.repository.InvitedPartyRepository;
import com.wedding.didi.repository.WeddingEventRepository;
import com.wedding.didi.service.AuthService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final WeddingEventRepository weddingEventRepository;
    private final GuestWishRepository guestWishRepository;
    private final InvitedPartyRepository invitedPartyRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final AuthService authService;

    public DataInitializer(WeddingEventRepository weddingEventRepository,
                           GuestWishRepository guestWishRepository,
                           InvitedPartyRepository invitedPartyRepository,
                           FamilyMemberRepository familyMemberRepository,
                           AuthService authService) {
        this.weddingEventRepository = weddingEventRepository;
        this.guestWishRepository = guestWishRepository;
        this.invitedPartyRepository = invitedPartyRepository;
        this.familyMemberRepository = familyMemberRepository;
        this.authService = authService;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Indian Ceremonies with Chandrika & Xudong's details
        if (weddingEventRepository.count() == 0) {
            weddingEventRepository.saveAll(List.of(
                new WeddingEvent(
                    "Ganesh Puja & Mehndi Carnival",
                    "Intricate Henna artistry & Rajasthani Folk Rhythms",
                    "November 26, 2026",
                    "3:00 PM onwards",
                    "Courtyard Lawns, The Oberoi Udaivilas",
                    "Haridas Ji Ki Magri, Udaipur, Rajasthan 313001",
                    "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
                    "Vibrant Mehndi Greens, Mint & Pastel Florals",
                    "Welcoming all 100 guests to celebrate as Chandrika adorns intricate bridal henna, joined by live folk singing, traditional bangles artisan, and street-chaat counters.",
                    "Sparkles",
                    1
                ),
                new WeddingEvent(
                    "Haldi & Phoolon Ki Holi",
                    "Auspicious turmeric blessing with fragrant flower petals",
                    "November 27, 2026",
                    "10:30 AM",
                    "Poolside Pavilions, Udaivilas",
                    "Haridas Ji Ki Magri, Udaipur, Rajasthan 313001",
                    "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
                    "Sunny Yellows, Ochre & Marigold Orange",
                    "A lively ceremony of turmeric paste blessings for both Chandrika & Xudong, accompanied by dhol drums and a joyous shower of fresh marigold and rose petals.",
                    "Sun",
                    2
                ),
                new WeddingEvent(
                    "Sangeet & Cocktail Extravaganza",
                    "Jashn-e-Bahaar: High-energy dance and music",
                    "November 27, 2026",
                    "7:30 PM onwards",
                    "Grand Royal Ballroom & Terrace",
                    "Haridas Ji Ki Magri, Udaipur, Rajasthan 313001",
                    "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
                    "Glitz, Shimmer & Indo-Western Tuxedos / Lehengas",
                    "Choreographed performances by family and friends celebrating Chandrika & Xudong's love story, followed by signature cocktails and live DJ music.",
                    "Music",
                    3
                ),
                new WeddingEvent(
                    "Baraat & Varmala (The Royal Entry)",
                    "Grand procession & exchange of sacred floral garlands",
                    "November 28, 2026",
                    "4:30 PM",
                    "Palace Main Gates & Lake Promenade",
                    "Haridas Ji Ki Magri, Udaipur, Rajasthan 313001",
                    "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
                    "Royal Heritage Safas, Sherwanis & Banarasi Silks",
                    "Xudong arrives with royal fanfare and brass band, followed by Chandrika's breathtaking bridal entry by Lake Pichola and the floral garland exchange.",
                    "Crown",
                    4
                ),
                new WeddingEvent(
                    "Vivah Sanskar (Sacred 7 Phere)",
                    "Seven Vedic vows uniting two heritage cultures",
                    "November 28, 2026",
                    "6:30 PM (Lagna Muhurat)",
                    "The Lotus Mandap, Floating Deck",
                    "Haridas Ji Ki Magri, Udaipur, Rajasthan 313001",
                    "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
                    "Traditional Banarasi Silks & Regal Sherwanis",
                    "The sacred nuptials performed around the holy agni under the starry skies of Udaipur, invoking eternal blessings for Chandrika and Xudong.",
                    "Flame",
                    5
                ),
                new WeddingEvent(
                    "Royal Reception & Gala Banquet",
                    "Imperial feast with celebratory toasts",
                    "November 28, 2026",
                    "8:30 PM onwards",
                    "Maharani Greens & Lakeview Lawn",
                    "Haridas Ji Ki Magri, Udaipur, Rajasthan 313001",
                    "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
                    "Black Tie / Formal Evening Elegance",
                    "A multi-course banquet celebrating the newlyweds with champagne toasts, cake cutting, live classical sitar and violin, and dinner under the stars.",
                    "Wine",
                    6
                )
            ));
        }

        // 2. Seed Master Guest List of Exactly 100 Invited Seats if empty
        if (invitedPartyRepository.count() == 0) {
            // Family 1: Rawat Family (4 members)
            InvitedParty rawat = new InvitedParty(
                "rawat.family@example.com",
                "Rawat Family",
                4,
                "Bride's Side (Chandrika)",
                "Table 1 - Royal Lotus",
                "CX-VIP-101"
            );
            rawat.setInvitationCode("INV-RAWAT1");
            rawat.setTokenHash(authService.hashToken("rawat-secure-token-101"));
            rawat.setStatus("REGISTERED");
            rawat.setVerificationCode("882194");
            rawat.setCodeExpiresAt(LocalDateTime.now().plusDays(30));
            rawat.setIsVerified(true);
            rawat.setRsvpStatus("ATTENDING");
            rawat.setConfirmedHeadcount(4);
            rawat.setAttendingMembers("Aditya Rawat, Sunita Rawat, Rajesh Rawat, Priya Rawat");
            rawat.setDietaryDetails("3 Pure Vegetarian, 1 Jain Vegetarian");
            rawat.setSongRequest("Gallan Goodiyan & London Thumakda");
            rawat.setBlessingMessage("Dearest Chandrika and Xudong Jiju, wishing you both a lifetime of love and joy!");
            rawat.setRsvpTimestamp(LocalDateTime.now());
            
            rawat.addMember(new FamilyMember("Aditya Rawat", "Brother", true, "PURE_VEG", "None", rawat));
            rawat.addMember(new FamilyMember("Sunita Rawat", "Mother", true, "PURE_VEG", "None", rawat));
            rawat.addMember(new FamilyMember("Rajesh Rawat", "Father", true, "PURE_VEG", "None", rawat));
            rawat.addMember(new FamilyMember("Priya Rawat", "Sister", true, "JAIN_VEG", "No onion/garlic", rawat));
            invitedPartyRepository.save(rawat);

            // Family 2: Zhang Family (4 members)
            InvitedParty zhang = new InvitedParty(
                "zhang.family@example.com",
                "Zhang Family",
                4,
                "Groom's Side (Xudong)",
                "Table 2 - Jade Pavilion",
                "CX-VIP-102"
            );
            zhang.setInvitationCode("INV-ZHANG2");
            zhang.setTokenHash(authService.hashToken("zhang-secure-token-102"));
            zhang.setStatus("REGISTERED");
            zhang.setVerificationCode("734912");
            zhang.setCodeExpiresAt(LocalDateTime.now().plusDays(30));
            zhang.addMember(new FamilyMember("Mr. Zhang", "Father", true, "NON_VEG", "", zhang));
            zhang.addMember(new FamilyMember("Mrs. Zhang", "Mother", true, "NON_VEG", "", zhang));
            zhang.addMember(new FamilyMember("Mei Zhang", "Sister", true, "NON_VEG", "", zhang));
            zhang.addMember(new FamilyMember("Tao Zhang", "Brother", true, "NON_VEG", "", zhang));
            invitedPartyRepository.save(zhang);

            // Other core families...
            invitedPartyRepository.save(new InvitedParty("sharma.family@example.com", "Sharma Family", 4, "Bride's Side (Chandrika)", "Table 1 - Royal Lotus", "CX-VIP-103"));
            invitedPartyRepository.save(new InvitedParty("wang.family@example.com", "Wang Family", 4, "Groom's Side (Xudong)", "Table 2 - Jade Pavilion", "CX-VIP-104"));
            invitedPartyRepository.save(new InvitedParty("verma.family@example.com", "Verma Family", 4, "Bride's Side (Chandrika)", "Table 3 - Lake Pichola View", "CX-VIP-105"));
            invitedPartyRepository.save(new InvitedParty("chen.family@example.com", "Chen Family", 4, "Groom's Side (Xudong)", "Table 4 - Mewar Terrace", "CX-VIP-106"));
            invitedPartyRepository.save(new InvitedParty("gupta.family@example.com", "Gupta Family", 4, "Bride's Side (Chandrika)", "Table 3 - Lake Pichola View", "CX-VIP-107"));
            invitedPartyRepository.save(new InvitedParty("liu.family@example.com", "Liu Family", 4, "Groom's Side (Xudong)", "Table 4 - Mewar Terrace", "CX-VIP-108"));
            invitedPartyRepository.save(new InvitedParty("kapoor.family@example.com", "Kapoor Family", 4, "Bride's Side (Chandrika)", "Table 5 - Rose Garden", "CX-VIP-109"));
            invitedPartyRepository.save(new InvitedParty("wu.family@example.com", "Wu Family", 4, "Groom's Side (Xudong)", "Table 5 - Rose Garden", "CX-VIP-110"));
            invitedPartyRepository.save(new InvitedParty("aditya.rawat@example.com", "Aditya Rawat", 2, "Bride's Side (Chandrika)", "Table 1 - Royal Lotus", "CX-VIP-111"));
        }

        // 3. Ensure Unused Test Invitation Passes Exist for Instant Testing
        if (invitedPartyRepository.findByInvitationCodeIgnoreCase("INV-CX2026").isEmpty()) {
            InvitedParty testPass1 = new InvitedParty();
            testPass1.setInvitationCode("INV-CX2026");
            // Raw token: demo-invitation-token-12345
            testPass1.setInviteToken("demo-invitation-token-12345");
            testPass1.setTokenHash(authService.hashToken("demo-invitation-token-12345"));
            testPass1.setStatus("UNUSED");
            testPass1.setFamilyName("Choudhary Family");
            testPass1.setAllowedPartySize(4);
            testPass1.setConfirmedHeadcount(0);
            testPass1.setSide("Bride's Side (Chandrika)");
            testPass1.setAssignedTable("Table 1 - Royal Lotus");
            testPass1.setPassSerial("CX-VIP-130");
            testPass1.setRsvpStatus("PENDING");
            testPass1.setIsVerified(false);
            testPass1.setCreatedAt(LocalDateTime.now());
            invitedPartyRepository.save(testPass1);

            System.out.println("==========================================================");
            System.out.println(" [SEED] Created Unused Test Pass 1:");
            System.out.println(" Invitation Code: INV-CX2026");
            System.out.println(" Raw Token:       demo-invitation-token-12345");
            System.out.println(" Invitation URL:  /invite/demo-invitation-token-12345");
            System.out.println("==========================================================");
        }

        if (invitedPartyRepository.findByInvitationCodeIgnoreCase("INV-VIP777").isEmpty()) {
            InvitedParty testPass2 = new InvitedParty();
            testPass2.setInvitationCode("INV-VIP777");
            // Raw token: demo-vip-token-xudong
            testPass2.setInviteToken("demo-vip-token-xudong");
            testPass2.setTokenHash(authService.hashToken("demo-vip-token-xudong"));
            testPass2.setStatus("UNUSED");
            testPass2.setFamilyName("Li Family");
            testPass2.setAllowedPartySize(3);
            testPass2.setConfirmedHeadcount(0);
            testPass2.setSide("Groom's Side (Xudong)");
            testPass2.setAssignedTable("Table 2 - Jade Pavilion");
            testPass2.setPassSerial("CX-VIP-131");
            testPass2.setRsvpStatus("PENDING");
            testPass2.setIsVerified(false);
            testPass2.setCreatedAt(LocalDateTime.now());
            invitedPartyRepository.save(testPass2);

            System.out.println("==========================================================");
            System.out.println(" [SEED] Created Unused Test Pass 2:");
            System.out.println(" Invitation Code: INV-VIP777");
            System.out.println(" Raw Token:       demo-vip-token-xudong");
            System.out.println(" Invitation URL:  /invite/demo-vip-token-xudong");
            System.out.println("==========================================================");
        }

        // 4. Update any existing records missing invitation codes, status, or tokens
        List<InvitedParty> allParties = invitedPartyRepository.findAll();
        for (InvitedParty p : allParties) {
            boolean changed = false;
            if (p.getInvitationCode() == null) {
                p.setInvitationCode("INV-" + String.format("%04d", p.getId()));
                changed = true;
            }
            if (p.getStatus() == null) {
                p.setStatus(p.getPrimaryEmail() != null ? "REGISTERED" : "UNUSED");
                changed = true;
            }
            if (p.getTokenHash() == null) {
                String token = "token-seed-" + p.getId();
                p.setTokenHash(authService.hashToken(token));
                if ("UNUSED".equalsIgnoreCase(p.getStatus())) {
                    p.setInviteToken(token);
                }
                changed = true;
            }
            if ("UNUSED".equalsIgnoreCase(p.getStatus()) && p.getInviteToken() == null) {
                if ("INV-CX2026".equalsIgnoreCase(p.getInvitationCode())) {
                    p.setInviteToken("demo-invitation-token-12345");
                    changed = true;
                } else if ("INV-VIP777".equalsIgnoreCase(p.getInvitationCode())) {
                    p.setInviteToken("demo-vip-token-xudong");
                    changed = true;
                }
            }
            if (changed) {
                invitedPartyRepository.save(p);
            }
        }

        // 5. Seed sample blessings
        if (guestWishRepository.count() == 0) {
            guestWishRepository.saveAll(List.of(
                new GuestWish("Aditya (Brother)", "Bride's Brother", "Dearest Chandrika and Xudong Jiju, wishing you both a lifetime of love, intercultural adventures, and boundless happiness! So proud and excited for Udaipur!"),
                new GuestWish("Mr. & Mrs. Zhang", "Groom's Parents", "Wishing Chandrika and Xudong eternal harmony, deep respect, and flourishing prosperity as their two families become one."),
                new GuestWish("Priya & Rahul", "Close Friends", "Counting down every second to the Sangeet in Udaipur! The most beautiful couple ever!")
            ));
        }
    }
}
