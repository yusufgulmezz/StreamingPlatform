package com.streaming.platform.model;

import com.streaming.platform.model.interfaces.Playable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Dizi içerik türü.
 * Sadece Playable — indirme desteği yoktur.
 */
@Entity
@Table(name = "series")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Series extends Content implements Playable {

    @Column
    private int seasons;

    @Column
    private int episodes;

    @Override
    public String play() {
        return "▶ Dizi oynatılıyor: \"" + getTitle() + "\" — " + seasons + " sezon, " + episodes + " bölüm";
    }

    @Override
    public String getContentType() {
        return "Series";
    }
}
