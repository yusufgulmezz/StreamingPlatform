package com.streaming.platform.strategy;

/**
 * Premium abonelik stratejisi.
 * Maksimum çözünürlük: 4K | Fiyat: 119.99 TL
 */
public class PremiumSubscription implements SubscriptionStrategy {

    @Override
    public String getPlanName() {
        return "Premium";
    }

    @Override
    public String getMaxResolution() {
        return "4K";
    }

    @Override
    public double getPrice() {
        return 119.99;
    }
}
