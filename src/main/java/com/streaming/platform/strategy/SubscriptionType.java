package com.streaming.platform.strategy;

/**
 * Veritabanında saklanacak abonelik tipi enum'u.
 * Runtime'da ilgili SubscriptionStrategy nesnesine dönüştürülür.
 */
public enum SubscriptionType {
    BASIC,
    STANDARD,
    PREMIUM;

    /**
     * Enum değerini ilgili SubscriptionStrategy nesnesine dönüştürür.
     *
     * @return karşılık gelen strateji nesnesi
     */
    public SubscriptionStrategy toStrategy() {
        return switch (this) {
            case BASIC -> new BasicSubscription();
            case STANDARD -> new StandardSubscription();
            case PREMIUM -> new PremiumSubscription();
        };
    }
}
