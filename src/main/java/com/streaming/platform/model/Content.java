package com.streaming.platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonSubTypes;

/**
 * Tüm içerik türlerinin temel abstract sınıfı.
 * JPA kalıtımı JOINED stratejisi ile yönetilir —
 * her alt sınıf kendi tablosuna sahip olur.
 */
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.PROPERTY,
        property = "contentType",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = Movie.class, name = "Movie"),
        @JsonSubTypes.Type(value = Series.class, name = "Series"),
        @JsonSubTypes.Type(value = Documentary.class, name = "Documentary"),
        @JsonSubTypes.Type(value = Podcast.class, name = "Podcast")
})
public abstract class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** İçerik başlığı */
    @Column(nullable = false)
    private String title;

    /** İçeriğin izlenmesi için gereken minimum yaş (ör.: 18) */
    @Column(nullable = false)
    private int requiredAge;

    /** İçerik süresi (dakika cinsinden) */
    @Column(nullable = false)
    private int duration;

    /**
     * Alt sınıfların içerik türünü döndürmesi için abstract metot.
     *
     * @return içerik türü açıklaması
     */
    public abstract String getContentType();
}
