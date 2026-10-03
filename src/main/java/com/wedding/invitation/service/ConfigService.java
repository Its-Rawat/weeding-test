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

        DEFAULT_CONFIG.put("CELEBRATIONS", "[" +
                "{\"id\":1,\"key\":\"MEHENDI\",\"title\":\"Mehendi Ceremony\",\"subtitle\":\"Adorning hands with henna, music & sweet celebration\",\"dayDate\":\"Sunday, 14 February 2027\",\"time\":\"04:00 PM onwards\",\"venueName\":\"Royal Courtyard, The Club International\",\"venueAddress\":\"The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)\",\"dressCode\":\"Vibrant Mehndi Greens & Pastel Florals\",\"desc\":\"Welcoming our beloved guests as Chandrika adorns bridal henna, accompanied by live folk rhythms, traditional bangles artisan, and gourmet chaat stations.\",\"illustration\":\"🌿\",\"startIso\":\"2027-02-14T16:00:00+05:30\",\"endIso\":\"2027-02-14T20:00:00+05:30\"}," +
                "{\"id\":2,\"key\":\"HALDI\",\"title\":\"Haldi Ceremony\",\"subtitle\":\"A splash of sunshine, laughter & turmeric blessings\",\"dayDate\":\"Monday, 15 February 2027\",\"time\":\"10:00 AM onwards\",\"venueName\":\"Poolside Pavilion, The Club International\",\"venueAddress\":\"The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)\",\"dressCode\":\"Sunny Yellows, Ochre & Marigold Orange\",\"desc\":\"An auspicious ceremony of turmeric paste blessings for Chandrika & Xudong, accompanied by celebratory dhol beats and a shower of fresh marigold and rose petals.\",\"illustration\":\"🌼\",\"startIso\":\"2027-02-15T10:00:00+05:30\",\"endIso\":\"2027-02-15T13:00:00+05:30\"}," +
                "{\"id\":3,\"key\":\"WEDDING\",\"title\":\"Wedding Ceremony (Baraat & Sacred Pheras)\",\"subtitle\":\"The sacred vows of love under the holy mandap\",\"dayDate\":\"Monday, 15 February 2027\",\"time\":\"Baraat: 07:00 PM • Pheras: 08:30 PM\",\"venueName\":\"The Grand Mandap, The Club International\",\"venueAddress\":\"The Club, International City, Sector 109, B3 Ln, Babupur Village 122017 Palam Vihar, Gurgaon (Gurgaon)\",\"dressCode\":\"Traditional Banarasi Silks & Regal Sherwanis\",\"desc\":\"Xudong arrives with joyful baraat procession, followed by Chandrika's grand bridal entrance and the sacred seven pheras around the holy agni.\",\"illustration\":\"🔥\",\"startIso\":\"2027-02-15T19:00:00+05:30\",\"endIso\":\"2027-02-15T22:00:00+05:30\"}" +
                "]");

        DEFAULT_CONFIG.put("STORY_SLIDES", "[" +
                "{\"image\":\"/couple/snow_winter.jpg\",\"chapter\":\"Chapter 01\",\"title\":\"The Snowy Trails\",\"subtitle\":\"Where our journey began\",\"caption\":\"Wrapped in winter warmth, shared laughter, and quiet pine trees that witnessed the start of our story.\"}," +
                "{\"image\":\"/couple/tuktuk_candid.jpg\",\"chapter\":\"Chapter 02\",\"title\":\"Joy & Sweet Laughter\",\"subtitle\":\"Finding magic in simple moments\",\"caption\":\"From fun rickshaw rides to late-night chats, every ordinary day turned into an extraordinary memory.\"}," +
                "{\"image\":\"/couple/travel_fun.jpg\",\"chapter\":\"Chapter 03\",\"title\":\"Adventures Near & Far\",\"subtitle\":\"Exploring the world together\",\"caption\":\"Hand in hand through sunny skies and new horizons, discovering that home is wherever we are together.\"}," +
                "{\"image\":\"/couple/proposal_story.jpg\",\"chapter\":\"Chapter 04\",\"title\":\"Under Tropical Stars\",\"subtitle\":\"The proposal on the bridge\",\"caption\":\"A knee on the wooden bridge, a box opened under the palms, and a question straight from the heart.\"}," +
                "{\"image\":\"/couple/ring_reveal.jpg\",\"chapter\":\"Chapter 05\",\"title\":\"She Said YES!\",\"subtitle\":\"A lifetime promise begins\",\"caption\":\"With tears of pure happiness, glowing lanterns, and full hearts ready to spend forever as one.\"}," +
                "{\"image\":\"/couple/formal_portrait.jpg\",\"chapter\":\"Chapter 06\",\"title\":\"Stepping Into Forever\",\"subtitle\":\"Under the Holy Mandap\",\"caption\":\"Chandrika & Xudong warmly welcome you to celebrate their wedding nuptials on February 14 & 15, 2027 in Gurugram.\"}" +
                "]");

        DEFAULT_CONFIG.put("PLAYLIST_TRACKS", "[" +
                "{\"id\":\"track-1\",\"title\":\"Kudmayi • Royal Symphony\",\"shortLabel\":\"Kudmayi • Royal Symphony\",\"artist\":\"Shahid Mallya • Traditional Sitar\",\"poster\":\"/couple/formal_portrait.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#D4AF37\",\"tag\":\"Formal Portrait\"}," +
                "{\"id\":\"track-2\",\"title\":\"Din Shagna Da • Bridal Walk\",\"shortLabel\":\"Din Shagna Da • Bridal Walk\",\"artist\":\"Jasleen Royal • Shenai Melody\",\"poster\":\"/couple/proposal_story.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#8C1D24\",\"tag\":\"The Proposal\"}," +
                "{\"id\":\"track-3\",\"title\":\"Kesariya • Sacred Promise\",\"shortLabel\":\"Kesariya • Sacred Promise\",\"artist\":\"Arijit Singh • Flute & Acoustic\",\"poster\":\"/couple/ring_reveal.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#B38E38\",\"tag\":\"Ring Reveal\"}," +
                "{\"id\":\"track-4\",\"title\":\"Mast Magan • Wanderlust\",\"shortLabel\":\"Mast Magan • Wanderlust\",\"artist\":\"Arijit Singh • Rhythmic Tabla\",\"poster\":\"/couple/travel_fun.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#D9822B\",\"tag\":\"Travel Memories\"}," +
                "{\"id\":\"track-5\",\"title\":\"Tum Se Hi • Snowy Pines\",\"shortLabel\":\"Tum Se Hi • Snowy Pines\",\"artist\":\"Mohit Chauhan • Serene Chords\",\"poster\":\"/couple/snow_winter.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#3B82F6\",\"tag\":\"Winter Trails\"}," +
                "{\"id\":\"track-6\",\"title\":\"Gallan Goodiyaan • Street Joy\",\"shortLabel\":\"Gallan Goodiyaan • Street Joy\",\"artist\":\"Shankar Mahadevan • Dhol Folk\",\"poster\":\"/couple/tuktuk_candid.jpg\",\"src\":\"https://cdn.21st.dev/assets/mirror/54/54d439247f35b461581bf47ed58a9be65ceca499240875c88fbb079ceea96081.mp3\",\"mainColor\":\"#E11D48\",\"tag\":\"TukTuk Candid\"}" +
                "]");
    }

    private static final com.fasterxml.jackson.databind.ObjectMapper OBJECT_MAPPER = new com.fasterxml.jackson.databind.ObjectMapper();

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
            String val;
            if (entry.getValue() instanceof String) {
                val = (String) entry.getValue();
            } else {
                try {
                    val = OBJECT_MAPPER.writeValueAsString(entry.getValue());
                } catch (Exception e) {
                    val = String.valueOf(entry.getValue());
                }
            }
            configRepository.save(new AppConfigEntity(entry.getKey(), val));
        }
    }
}
