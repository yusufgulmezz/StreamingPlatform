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
 * Film içerik türü.
 * Sadece Playable — indirme desteği yoktur.
 */
@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Movie extends Content implements Playable {

    @Column
    private String director;

    @Column
    private String genre;

    @Override
    public String play() {
        return "▶ Film oynatılıyor: \"" + getTitle() + "\" — Yönetmen: " + director;
    }

    @Override
    public String getContentType() {
        return "Movie";
    }
}
