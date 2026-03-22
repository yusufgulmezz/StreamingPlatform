package com.streaming.platform.service;

import com.streaming.platform.model.User;
import com.streaming.platform.repository.UserRepository;
import com.streaming.platform.strategy.SubscriptionStrategy;
import com.streaming.platform.strategy.SubscriptionType;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Kullanıcı iş mantığı servisi.
 * Strategy Pattern entegrasyonu ile abonelik yönetimini sağlar.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: ID=" + id));
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Strategy Pattern — Kullanıcının abonelik tipini değiştirir.
     * Yeni strateji nesnesi oluşturularak plan bilgisi döndürülür.
     */
    public Map<String, Object> changeSubscription(Long userId, SubscriptionType newType) {
        User user = getUserById(userId);
        user.setSubscriptionType(newType);
        userRepository.save(user);

        SubscriptionStrategy strategy = newType.toStrategy();

        return Map.of(
                "userId", user.getId(),
                "username", user.getUsername(),
                "plan", strategy.getPlanName(),
                "maxResolution", strategy.getMaxResolution(),
                "price", strategy.getPrice()
        );
    }

    /**
     * Kullanıcının mevcut abonelik bilgilerini Strategy ile döndürür.
     */
    public Map<String, Object> getSubscriptionInfo(Long userId) {
        User user = getUserById(userId);
        SubscriptionStrategy strategy = user.getSubscriptionType().toStrategy();

        return Map.of(
                "userId", user.getId(),
                "username", user.getUsername(),
                "plan", strategy.getPlanName(),
                "maxResolution", strategy.getMaxResolution(),
                "price", strategy.getPrice()
        );
    }
}
