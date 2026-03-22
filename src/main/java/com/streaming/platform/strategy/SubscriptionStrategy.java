package com.streaming.platform.strategy;

/**
 * Strategy Pattern — Abonelik stratejisi arayüzü.
 * Her abonelik tipi (Basic, Standard, Premium) bu arayüzü implement eder
 * ve kendi çözünürlük / fiyat bilgisini döndürür.
 */
public interface SubscriptionStrategy {

    /**
     * Abonelik planının adını döndürür.
     */
    String getPlanName();

    /**
     * Maksimum desteklenen video çözünürlüğünü döndürür.
     */
    String getMaxResolution();

    /**
     * Aylık abonelik fiyatını döndürür (TL).
     */
    double getPrice();
}
