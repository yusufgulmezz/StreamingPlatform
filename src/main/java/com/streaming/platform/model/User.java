package com.streaming.platform.model;

import com.streaming.platform.strategy.SubscriptionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Platform kullanıcısı entity sınıfı.
 * Abonelik tipi SubscriptionType enum olarak veritabanında saklanır;
 * runtime'da Strategy pattern ile ilgili strateji nesnesine dönüştürülür.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    /** Kullanıcının yaşı — Proxy pattern'daki yaş kontrolü için kullanılır */
    @Column(nullable = false)
    private int age;

    /** Abonelik tipi (BASIC / STANDARD / PREMIUM) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionType subscriptionType;
}
