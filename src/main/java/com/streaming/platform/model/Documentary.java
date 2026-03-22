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
 * Belgesel içerik türü.
 * Hem Playable hem Downloadable.
 */
@Entity
@Table(name = "documentaries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Documentary extends Content implements Playable, Downloadable {

    @Column
    private String topic;

    @Override
    public String play() {
        return "▶ Belgesel oynatılıyor: \"" + getTitle() + "\" — Konu: " + topic;
    }

    @Override
    public String download() {
        return "⬇ Belgesel indiriliyor: \"" + getTitle() + "\" — Konu: " + topic;
    }

    @Override
    public String getContentType() {
        return "Documentary";
    }
}
