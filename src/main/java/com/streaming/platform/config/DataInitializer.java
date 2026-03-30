package com.streaming.platform.config;

import com.streaming.platform.model.*;
import com.streaming.platform.repository.ContentRepository;
import com.streaming.platform.repository.UserRepository;
import com.streaming.platform.strategy.SubscriptionType;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Uygulama başlangıcında örnek veri yükleyici.
 * H2 in-memory veritabanına test verileri ekler.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(ContentRepository contentRepo, UserRepository userRepo) {
        return args -> {
            if (contentRepo.count() > 0 || userRepo.count() > 0) {
                System.out.println("=== Veritabanında veri bulundu, varsayılan yükleme atlandı. ===");
                return;
            }

            System.out.println("=== Örnek veriler yükleniyor ===");

            // --- İçerikler ---

            // Movie (sadece Playable)
            Movie movie1 = new Movie();
            movie1.setTitle("Inception");
            movie1.setRequiredAge(13);
            movie1.setDuration(148);
            movie1.setDirector("Christopher Nolan");
            movie1.setGenre("Sci-Fi");
            contentRepo.save(movie1);

            Movie movie2 = new Movie();
            movie2.setTitle("The Matrix");
            movie2.setRequiredAge(18);
            movie2.setDuration(136);
            movie2.setDirector("Wachowski Sisters");
            movie2.setGenre("Action/Sci-Fi");
            contentRepo.save(movie2);

            // Series (sadece Playable)
            Series series1 = new Series();
            series1.setTitle("Breaking Bad");
            series1.setRequiredAge(18);
            series1.setDuration(47);
            series1.setSeasons(5);
            series1.setEpisodes(62);
            contentRepo.save(series1);

            Series series2 = new Series();
            series2.setTitle("Stranger Things");
            series2.setRequiredAge(13);
            series2.setDuration(50);
            series2.setSeasons(4);
            series2.setEpisodes(34);
            contentRepo.save(series2);

            // Documentary (Playable + Downloadable)
            Documentary doc1 = new Documentary();
            doc1.setTitle("Our Planet");
            doc1.setRequiredAge(0);
            doc1.setDuration(50);
            doc1.setTopic("Doğa ve Yaban Hayatı");
            contentRepo.save(doc1);

            Documentary doc2 = new Documentary();
            doc2.setTitle("The Social Dilemma");
            doc2.setRequiredAge(13);
            doc2.setDuration(94);
            doc2.setTopic("Sosyal Medya ve Teknoloji");
            contentRepo.save(doc2);

            // Podcast (Playable + Downloadable)
            Podcast podcast1 = new Podcast();
            podcast1.setTitle("Tech Talks Daily");
            podcast1.setRequiredAge(0);
            podcast1.setDuration(35);
            podcast1.setHost("Neil Hughes");
            podcast1.setEpisodeCount(1500);
            contentRepo.save(podcast1);

            Podcast podcast2 = new Podcast();
            podcast2.setTitle("Crime Junkie");
            podcast2.setRequiredAge(18);
            podcast2.setDuration(45);
            podcast2.setHost("Ashley Flowers");
            podcast2.setEpisodeCount(350);
            contentRepo.save(podcast2);

            // --- Kullanıcılar ---

            User user1 = new User();
            user1.setUsername("ahmet_yilmaz");
            user1.setEmail("ahmet@example.com");
            user1.setAge(25);
            user1.setSubscriptionType(SubscriptionType.PREMIUM);
            userRepo.save(user1);

            User user2 = new User();
            user2.setUsername("zeynep_kaya");
            user2.setEmail("zeynep@example.com");
            user2.setAge(16);
            user2.setSubscriptionType(SubscriptionType.BASIC);
            userRepo.save(user2);

            User user3 = new User();
            user3.setUsername("can_demir");
            user3.setEmail("can@example.com");
            user3.setAge(30);
            user3.setSubscriptionType(SubscriptionType.STANDARD);
            userRepo.save(user3);

            System.out.println("=== Örnek veriler başarıyla yüklendi! ===");
            System.out.println("  → " + contentRepo.count() + " içerik eklendi");
            System.out.println("  → " + userRepo.count() + " kullanıcı eklendi");
        };
    }
}
