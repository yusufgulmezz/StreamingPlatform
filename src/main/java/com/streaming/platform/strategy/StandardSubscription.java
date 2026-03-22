package com.streaming.platform.strategy;

/**
 * Standard abonelik stratejisi.
 * Maksimum çözünürlük: 1080p | Fiyat: 79.99 TL
 */
public class StandardSubscription implements SubscriptionStrategy {

    @Override
    public String getPlanName() {
        return "Standard";
    }

    @Override
    public String getMaxResolution() {
        return "1080p";
    }

    @Override
    public double getPrice() {
        return 79.99;
    }
}
