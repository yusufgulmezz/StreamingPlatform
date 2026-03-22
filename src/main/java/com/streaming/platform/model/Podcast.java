package com.streaming.platform.model;

import com.streaming.platform.model.interfaces.Downloadable;
import com.streaming.platform.model.interfaces.Playable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Podcast içerik türü.
 * Hem Playable hem Downloadable.
 */
@Entity
@Table(name = "podcasts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Podcast extends Content implements Playable, Downloadable {

    @Column
    private String host;

    @Column
    private int episodeCount;

    @Override
    public String play() {
        return "▶ Podcast oynatılıyor: \"" + getTitle() + "\" — Sunucu: " + host;
    }

    @Override
    public String download() {
        return "⬇ Podcast indiriliyor: \"" + getTitle() + "\" — " + episodeCount + " bölüm";
    }

    @Override
    public String getContentType() {
        return "Podcast";
    }
}
