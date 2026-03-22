package com.streaming.platform.model.interfaces;

/**
 * Oynatılabilir içerikleri temsil eden arayüz.
 * Movie, Series, Documentary ve Podcast bu arayüzü implement eder.
 */
public interface Playable {

    /**
     * İçeriği oynatır.
     *
     * @return oynatma sonucu hakkında bilgi mesajı
     */
    String play();
}
