package com.streaming.platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
