package com.streaming.platform.model.interfaces;

/**
 * İndirilebilir içerikleri temsil eden arayüz.
 * Documentary ve Podcast bu arayüzü implement eder.
 */
public interface Downloadable {

    /**
     * İçeriği indirir.
     *
     * @return indirme sonucu hakkında bilgi mesajı
     */
    String download();
}
