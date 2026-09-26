package com.wedding.invitation.util;

import java.security.SecureRandom;

public final class TokenGenerator {

    private static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom RANDOM = new SecureRandom();
    public static final int DEFAULT_TOKEN_LENGTH = 12;

    private TokenGenerator() {
    }

    public static String generateToken() {
        return generateToken(DEFAULT_TOKEN_LENGTH);
    }

    public static String generateToken(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
}
