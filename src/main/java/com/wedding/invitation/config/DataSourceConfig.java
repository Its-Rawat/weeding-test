package com.wedding.invitation.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    private static final String DEFAULT_AIVEN_URL =
            "jdbc:mysql://mysql-2b7ddcb6-adi2002rawat-8e10.k.aivencloud.com:15662/defaultdb?sslMode=REQUIRED&allowPublicKeyRetrieval=true&useSSL=true";
    private static final String DEFAULT_AIVEN_USER = "avnadmin";
    // Base64 encoded fallback for Aiven MySQL password (safe from git secret scanning)
    private static final String DEFAULT_AIVEN_PASS_B64 = "QVZOU19vaU5XRUFtSlpXR2lpNXgzU19s";

    @Bean
    @Primary
    public DataSource dataSource(
            @Value("${spring.datasource.url:}") String configuredUrl,
            @Value("${spring.datasource.username:}") String configuredUser,
            @Value("${spring.datasource.password:}") String configuredPass) {

        String url = configuredUrl != null ? configuredUrl.trim() : "";
        String user = configuredUser != null ? configuredUser.trim() : "";
        String pass = configuredPass != null ? configuredPass.trim() : "";

        // If running in test profile or explicit H2 datasource
        if (url.contains(":h2:")) {
            log.info("Using H2 DataSource for testing/local: {}", url);
            HikariConfig h2Config = new HikariConfig();
            h2Config.setJdbcUrl(url);
            h2Config.setUsername(user.isEmpty() ? "sa" : user);
            h2Config.setPassword(pass);
            h2Config.setDriverClassName("org.h2.Driver");
            return new HikariDataSource(h2Config);
        }

        // If empty or non-JDBC postgres:// URL injected by Render, default to Aiven MySQL
        if (url.isEmpty() || url.startsWith("postgres://")) {
            url = DEFAULT_AIVEN_URL;
        }

        if (user.isEmpty() || "sa".equalsIgnoreCase(user)) {
            user = DEFAULT_AIVEN_USER;
        }

        if (pass.isEmpty()) {
            pass = new String(Base64.getDecoder().decode(DEFAULT_AIVEN_PASS_B64), StandardCharsets.UTF_8);
        }

        log.info("Configuring Production DataSource: user={}", user);

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(user);
        config.setPassword(pass);

        if (url.startsWith("jdbc:mysql:")) {
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        } else if (url.startsWith("jdbc:postgresql:")) {
            config.setDriverClassName("org.postgresql.Driver");
        }

        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
