package com.wedding.invitation.service;

import com.wedding.invitation.model.AppConfigEntity;
import com.wedding.invitation.repository.AppConfigRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ConfigService {

    private final AppConfigRepository configRepository;

    public ConfigService(AppConfigRepository configRepository) {
        this.configRepository = configRepository;
    }

    private static final Map<String, String> DEFAULT_CONFIG = new LinkedHashMap<>();

    static {
        DEFAULT_CONFIG.put("BRIDE_NICKNAME", "Chandrika");
        DEFAULT_CONFIG.put("BRIDE_FULLNAME", "Chandrika");
        DEFAULT_CONFIG.put("BRIDE_PARENTS", "Beloved daughter of Mr. & Mrs. Sharma");
        DEFAULT_CONFIG.put("BRIDE_INSTAGRAM", "chandrika_c");
        DEFAULT_CONFIG.put("BRIDE_IMAGE", "/couple/formal_portrait.jpg");

        DEFAULT_CONFIG.put("GROOM_NICKNAME", "Xudong");
        DEFAULT_CONFIG.put("GROOM_FULLNAME", "Xudong");
        DEFAULT_CONFIG.put("GROOM_PARENTS", "Beloved son of Mr. & Mrs. Wang");
        DEFAULT_CONFIG.put("GROOM_INSTAGRAM", "xudong_w");
        DEFAULT_CONFIG.put("GROOM_IMAGE", "/couple/formal_portrait.jpg");

        DEFAULT_CONFIG.put("VENUE_NAME", "The Club International");
        DEFAULT_CONFIG.put("VENUE_ADDRESS", "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)");
        DEFAULT_CONFIG.put("VENUE_LAT", "28.5134");
        DEFAULT_CONFIG.put("VENUE_LNG", "77.0275");

        DEFAULT_CONFIG.put("AKAD_TITLE", "Wedding Ceremony (Baraat & Pheras)");
        DEFAULT_CONFIG.put("AKAD_DAY", "Monday");
        DEFAULT_CONFIG.put("AKAD_DATE", "15 February 2027");
        DEFAULT_CONFIG.put("AKAD_START", "19:00");
        DEFAULT_CONFIG.put("AKAD_END", "22:00");
        DEFAULT_CONFIG.put("AKAD_ISO_START", "2027-02-15T19:00:00+05:30");
        DEFAULT_CONFIG.put("AKAD_ISO_END", "2027-02-15T22:00:00+05:30");

        DEFAULT_CONFIG.put("HERO_IMAGE", "/couple/formal_portrait.jpg");
        DEFAULT_CONFIG.put("HERO_CITY", "The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)");
        DEFAULT_CONFIG.put("MUSIC_URL", "https://www.bensound.com/bensound-music/bensound-forever.mp3");
        DEFAULT_CONFIG.put("RSVP_MAX_GUESTS", "10");

        DEFAULT_CONFIG.put("BANK_ACCOUNTS", "[{\"bank\":\"DBS / POSB\",\"number\":\"123-45678-9\",\"name\":\"Chandrika & Xudong\"},{\"bank\":\"Bank Transfer / Zelle\",\"number\":\"chandrika.xudong.wedding@gmail.com\",\"name\":\"Chandrika & Xudong\"}]");

        DEFAULT_CONFIG.put("LOVE_STORY", "[" +
                "{\"date\":\"2021\",\"title\":\"The Serendipitous Meeting\",\"desc\":\"Our paths crossed on a breezy autumn afternoon, sparking an effortless connection filled with laughter, shared values, and endless conversations.\"}," +
                "{\"date\":\"2023\",\"title\":\"Growing Together\",\"desc\":\"Through journeys near and far, we discovered that true happiness lies in understanding, gentle support, and quiet joy together.\"}," +
                "{\"date\":\"2025\",\"title\":\"A Lifetime Promise\",\"desc\":\"Under starlight, we promised to walk hand in hand through every season of life, choosing each other with all our hearts.\"} " +
                "]");

        DEFAULT_CONFIG.put("GALLERY_IMAGES", "[" +
                "\"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop\"," +
                "\"https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop\"," +
                "\"https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop\"," +
                "\"https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop\"," +
                "\"https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200&auto=format&fit=crop\"," +
                "\"https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop\"" +
                "]");

        DEFAULT_CONFIG.put("TEXT_SALAM_OPENING", "Together with our families, we warmly invite you");
        DEFAULT_CONFIG.put("TEXT_QUOTE_AR_RUM", "\"Two souls with but a single thought, two hearts that beat as one. In love, kindness, and devotion, we begin our new journey together.\"");
        DEFAULT_CONFIG.put("TEXT_QUOTE_SOURCE", "A Celebration of Love & Unity");
        DEFAULT_CONFIG.put("TEXT_INVITATION", "With immense joy and grateful hearts, we invite you to share in our happiness as we unite in marriage.");
        DEFAULT_CONFIG.put("TEXT_CLOSING", "Your blessings, presence, and prayers mean everything to us as we begin this beautiful chapter of our lives.");
        DEFAULT_CONFIG.put("TEXT_SALAM_CLOSING", "With warm regards and heartfelt gratitude,");
        DEFAULT_CONFIG.put("TEXT_SIGNATURE", "Happily Ever After,");
        DEFAULT_CONFIG.put("TEXT_FAMILY", "The Families of Chandrika & Xudong");
        DEFAULT_CONFIG.put("TEXT_GIFT_TITLE", "Wedding Blessings");
        DEFAULT_CONFIG.put("TEXT_GIFT_DESC", "Your presence and warm wishes are the greatest gift we could ever ask for. For friends and family who have kindly inquired about gifts, contributions toward our new journey together are gratefully appreciated.");
        DEFAULT_CONFIG.put("TELEGRAM_BOT_TOKEN", "");
        DEFAULT_CONFIG.put("TELEGRAM_CHAT_ID", "");
    }

    @PostConstruct
    @Transactional
    public void initDefaultConfig() {
        for (Map.Entry<String, String> entry : DEFAULT_CONFIG.entrySet()) {
            if (configRepository.findByKey(entry.getKey()).isEmpty()) {
                configRepository.save(new AppConfigEntity(entry.getKey(), entry.getValue()));
            }
        }
    }

    public Map<String, String> getRawConfig() {
        List<AppConfigEntity> entities = configRepository.findAll();
        Map<String, String> result = new LinkedHashMap<>(DEFAULT_CONFIG);
        for (AppConfigEntity entity : entities) {
            result.put(entity.getKey(), entity.getValue());
        }
        return result;
    }

    public Map<String, String> getSafePublicConfig() {
        Map<String, String> config = getRawConfig();
        config.remove("TELEGRAM_BOT_TOKEN");
        config.remove("TELEGRAM_CHAT_ID");
        return config;
    }

    @Transactional
    public void saveConfig(Map<String, Object> updates) {
        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            String val = entry.getValue() instanceof String
                    ? (String) entry.getValue()
                    : String.valueOf(entry.getValue());
            configRepository.save(new AppConfigEntity(entry.getKey(), val));
        }
    }
}
