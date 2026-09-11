package com.wedding.didi.service;

import com.wedding.didi.model.FamilyMember;
import com.wedding.didi.model.InvitedParty;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${wedding.admin.notification-email:adi2002rawat@gmail.com}")
    private String notificationEmail;

    @Value("${spring.mail.username:adi2002rawat@gmail.com}")
    private String mailFrom;

    @Value("${wedding.mail.enabled:true}")
    private boolean mailEnabled;

    /**
     * Dispatches an asynchronous absence notification to adi2002rawat@gmail.com
     * when one or more family members are marked as unable to attend.
     */
    public void sendAbsenceNotification(InvitedParty party, List<FamilyMember> absentMembers, List<FamilyMember> attendingMembers) {
        CompletableFuture.runAsync(() -> {
            try {
                String subject = "[Wedding RSVP Alert] Family Member Unable to Attend - " + party.getFamilyName();
                String htmlBody = buildAbsenceHtmlEmail(party, absentMembers, attendingMembers);
                String textSummary = buildPlainTextSummary(party, absentMembers, attendingMembers);

                // Always log formatted dispatch to server console for instant observability
                logger.info("\n" + textSummary);
                System.out.println(textSummary);

                // Attempt real SMTP dispatch if mailSender is available and enabled
                if (mailSender != null && mailEnabled) {
                    try {
                        MimeMessage message = mailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                        helper.setFrom(mailFrom);
                        helper.setTo(notificationEmail);
                        helper.setSubject(subject);
                        helper.setText(textSummary, htmlBody);

                        mailSender.send(message);
                        logger.info("Successfully dispatched absence alert email to: {}", notificationEmail);
                    } catch (Exception mailEx) {
                        logger.warn("Could not dispatch live SMTP email to {} ({}: {}). " +
                                "To enable live Gmail delivery, configure SPRING_MAIL_PASSWORD in application.properties or environment variables.",
                                notificationEmail, mailEx.getClass().getSimpleName(), mailEx.getMessage());
                    }
                } else {
                    logger.info("Live SMTP sender not configured or disabled. Absence alert logged above.");
                }
            } catch (Exception e) {
                logger.error("Error generating absence alert notification", e);
            }
        });
    }

    /**
     * Generates a plain text summary for console logging and fallback.
     */
    private String buildPlainTextSummary(InvitedParty party, List<FamilyMember> absentMembers, List<FamilyMember> attendingMembers) {
        StringBuilder sb = new StringBuilder();
        sb.append("================================================================================\n");
        sb.append(" [WEDDING ALERT: GUEST ABSENCE NOTIFICATION]\n");
        sb.append(" To: ").append(notificationEmail).append("\n");
        sb.append(" Time: ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        sb.append("--------------------------------------------------------------------------------\n");
        sb.append(" FAMILY INFORMATION:\n");
        sb.append("   • Family Name: ").append(party.getFamilyName()).append("\n");
        sb.append("   • Registered Email: ").append(party.getPrimaryEmail() != null ? party.getPrimaryEmail() : "N/A").append("\n");
        sb.append("   • Pass Serial: ").append(party.getPassSerial() != null ? party.getPassSerial() : "N/A").append("\n");
        sb.append("   • Assigned Seating: ").append(party.getAssignedTable() != null ? party.getAssignedTable() : "N/A").append("\n");
        sb.append("   • Total Reserved Quota: ").append(party.getAllowedPartySize()).append(" Guests\n");
        sb.append("   • Confirmed Attending: ").append(party.getConfirmedHeadcount()).append(" Guests\n");
        sb.append("   • RSVP Status: ").append(party.getRsvpStatus()).append("\n");
        sb.append("--------------------------------------------------------------------------------\n");
        sb.append(" FAMILY MEMBER(S) NOT COMING (").append(absentMembers.size()).append("):\n");
        for (int i = 0; i < absentMembers.size(); i++) {
            FamilyMember m = absentMembers.get(i);
            sb.append("   ").append(i + 1).append(". Name: ").append(m.getName()).append("\n");
            sb.append("      Relationship: ").append(m.getRelationship()).append("\n");
            sb.append("      Reason / Note: ").append(m.getAbsenceReason() != null && !m.getAbsenceReason().trim().isEmpty() ? m.getAbsenceReason() : "No reason provided").append("\n");
        }
        sb.append("--------------------------------------------------------------------------------\n");
        sb.append(" FAMILY MEMBER(S) COMING (").append(attendingMembers.size()).append("):\n");
        for (int i = 0; i < attendingMembers.size(); i++) {
            FamilyMember m = attendingMembers.get(i);
            sb.append("   ").append(i + 1).append(". Name: ").append(m.getName())
              .append(" (").append(m.getRelationship()).append(")")
              .append(" | Diet: ").append(m.getDietaryPreference());
            if (m.getAllergyNotes() != null && !m.getAllergyNotes().trim().isEmpty()) {
                sb.append(" | Allergies: ").append(m.getAllergyNotes());
            }
            sb.append("\n");
        }
        if (party.getBlessingMessage() != null && !party.getBlessingMessage().trim().isEmpty()) {
            sb.append("--------------------------------------------------------------------------------\n");
            sb.append(" Blessing Message: ").append(party.getBlessingMessage()).append("\n");
        }
        if (party.getSongRequest() != null && !party.getSongRequest().trim().isEmpty()) {
            sb.append(" Sangeet Song Request: ").append(party.getSongRequest()).append("\n");
        }
        sb.append("================================================================================");
        return sb.toString();
    }

    /**
     * Builds a royal, elegant HTML email body for Gmail inbox presentation.
     */
    private String buildAbsenceHtmlEmail(InvitedParty party, List<FamilyMember> absentMembers, List<FamilyMember> attendingMembers) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html><head><meta charset='UTF-8'></head>");
        html.append("<body style='font-family: Arial, sans-serif; background-color: #f7f4ef; margin: 0; padding: 24px; color: #23201e;'>");
        html.append("<div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e0cfb3; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);'>");

        // Header
        html.append("<div style='background: linear-gradient(135deg, #b73239, #8c1d23); padding: 20px 24px; text-align: center; color: #ffffff;'>");
        html.append("<h1 style='margin: 0; font-size: 20px; font-family: Georgia, serif; letter-spacing: 0.5px;'>Chandrika &amp; Xudong Wedding</h1>");
        html.append("<p style='margin: 6px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9;'>Guest Absence Notification Alert</p>");
        html.append("</div>");

        // Content Body
        html.append("<div style='padding: 24px;'>");
        html.append("<p style='margin-top: 0; font-size: 14px; line-height: 1.5;'>A guest family has submitted/updated their RSVP, indicating that one or more members are <strong>unable to attend</strong>:</p>");

        // Family Card Box
        html.append("<div style='background: #fcf9f2; border: 1px solid #ebd9be; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;'>");
        html.append("<h3 style='margin: 0 0 10px 0; font-size: 16px; color: #b73239; font-family: Georgia, serif;'>").append(escapeHtml(party.getFamilyName())).append("</h3>");
        html.append("<table style='width: 100%; font-size: 13px; border-collapse: collapse;'>");
        html.append("<tr><td style='padding: 4px 0; color: #666;'>Registered Email:</td><td style='padding: 4px 0; font-weight: bold; color: #23201e;'>").append(escapeHtml(party.getPrimaryEmail())).append("</td></tr>");
        html.append("<tr><td style='padding: 4px 0; color: #666;'>Pass Serial:</td><td style='padding: 4px 0; font-weight: bold; color: #916815;'>").append(escapeHtml(party.getPassSerial())).append("</td></tr>");
        html.append("<tr><td style='padding: 4px 0; color: #666;'>Assigned Table:</td><td style='padding: 4px 0; font-weight: bold; color: #23201e;'>").append(escapeHtml(party.getAssignedTable())).append("</td></tr>");
        html.append("<tr><td style='padding: 4px 0; color: #666;'>Reserved Quota:</td><td style='padding: 4px 0; font-weight: bold; color: #23201e;'>").append(party.getAllowedPartySize()).append(" Guests</td></tr>");
        html.append("<tr><td style='padding: 4px 0; color: #666;'>Confirmed Attending:</td><td style='padding: 4px 0; font-weight: bold; color: #2e7d32;'>").append(party.getConfirmedHeadcount()).append(" Guests</td></tr>");
        html.append("</table>");
        html.append("</div>");

        // Absent Members Section
        html.append("<div style='margin-bottom: 20px;'>");
        html.append("<h4 style='margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #c62828;'>&#10006; Member(s) Not Coming (").append(absentMembers.size()).append(")</h4>");
        html.append("<div style='border: 1px solid #f8d7da; background: #fff5f5; border-radius: 8px; overflow: hidden;'>");
        for (int i = 0; i < absentMembers.size(); i++) {
            FamilyMember m = absentMembers.get(i);
            html.append("<div style='padding: 10px 14px; border-bottom: ").append(i == absentMembers.size() - 1 ? "none" : "1px solid #fedbdc").append(";'>");
            html.append("<div style='display: flex; justify-content: space-between;'>");
            html.append("<span style='font-weight: bold; color: #b73239; font-size: 13px;'>").append(escapeHtml(m.getName())).append("</span>");
            html.append("<span style='font-size: 11px; background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-weight: bold;'>").append(escapeHtml(m.getRelationship())).append("</span>");
            html.append("</div>");
            if (m.getAbsenceReason() != null && !m.getAbsenceReason().trim().isEmpty()) {
                html.append("<p style='margin: 4px 0 0 0; font-size: 12px; color: #555;'><strong>Reason:</strong> ").append(escapeHtml(m.getAbsenceReason())).append("</p>");
            }
            html.append("</div>");
        }
        html.append("</div>");
        html.append("</div>");

        // Attending Members Section
        html.append("<div style='margin-bottom: 20px;'>");
        html.append("<h4 style='margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #2e7d32;'>&#10004; Member(s) Attending (").append(attendingMembers.size()).append(")</h4>");
        html.append("<div style='border: 1px solid #c8e6c9; background: #f1f8f3; border-radius: 8px; overflow: hidden;'>");
        for (int i = 0; i < attendingMembers.size(); i++) {
            FamilyMember m = attendingMembers.get(i);
            html.append("<div style='padding: 10px 14px; border-bottom: ").append(i == attendingMembers.size() - 1 ? "none" : "1px solid #e0f2e1").append(";'>");
            html.append("<div style='font-weight: bold; color: #1b5e20; font-size: 13px;'>").append(escapeHtml(m.getName())).append(" <span style='font-weight: normal; font-size: 11px; color: #555;'>(").append(escapeHtml(m.getRelationship())).append(")</span></div>");
            html.append("<div style='font-size: 12px; color: #444; margin-top: 2px;'><strong>Diet:</strong> ").append(escapeHtml(m.getDietaryPreference()));
            if (m.getAllergyNotes() != null && !m.getAllergyNotes().trim().isEmpty()) {
                html.append(" | <strong>Allergies:</strong> ").append(escapeHtml(m.getAllergyNotes()));
            }
            html.append("</div></div>");
        }
        html.append("</div>");
        html.append("</div>");

        // Special notes if available
        if (party.getBlessingMessage() != null && !party.getBlessingMessage().trim().isEmpty()) {
            html.append("<div style='margin-bottom: 14px; padding: 10px 14px; background: #fdfaf3; border: 1px solid #eee1cc; border-radius: 6px; font-size: 12px;'>");
            html.append("<strong>Blessing Message:</strong> &ldquo;").append(escapeHtml(party.getBlessingMessage())).append("&rdquo;");
            html.append("</div>");
        }

        html.append("<p style='font-size: 11px; color: #888; text-align: center; margin-top: 20px;'>This automated alert was dispatched by the Chandrika &amp; Xudong Wedding RSVP System to ").append(notificationEmail).append("</p>");
        html.append("</div></div></body></html>");

        return html.toString();
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}
