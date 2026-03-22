package com.streaming.platform.strategy;

/**
 * Basic abonelik stratejisi.
 * Maksimum çözünürlük: 720p | Fiyat: 49.99 TL
 */
public class BasicSubscription implements SubscriptionStrategy {

    @Override
    public String getPlanName() {
        return "Basic";
    }

    @Override
    public String getMaxResolution() {
        return "720p";
    }

    @Override
    public double getPrice() {
        return 49.99;
    }
}
