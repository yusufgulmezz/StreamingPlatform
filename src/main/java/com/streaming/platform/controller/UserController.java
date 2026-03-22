package com.streaming.platform.controller;

import com.streaming.platform.model.User;
import com.streaming.platform.service.UserService;
import com.streaming.platform.strategy.SubscriptionType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Kullanıcı REST Controller.
 * CRUD işlemleri + Strategy Pattern ile abonelik yönetimi.
 */
@RestController
@RequestMapping("/api/users")
@Tag(name = "Kullanıcı Yönetimi (User)",
     description = "Kullanıcı CRUD işlemleri ve Strategy Pattern ile abonelik plan yönetimi")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Tüm kullanıcıları listele",
            description = "Sistemdeki tüm kullanıcıları abonelik tipleriyle birlikte döndürür."
    )
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(
            summary = "ID ile kullanıcı getir",
            description = "Belirtilen ID'ye sahip kullanıcının tüm bilgilerini döndürür."
    )
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @Parameter(description = "Kullanıcı ID", example = "1")
            @PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Operation(
            summary = "Yeni kullanıcı oluştur",
            description = "Yeni bir platform kullanıcısı oluşturur. Abonelik tipi (BASIC / STANDARD / PREMIUM) belirtilmelidir."
    )
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @Operation(
            summary = "Kullanıcı sil",
            description = "Belirtilen ID'ye sahip kullanıcıyı sistemden siler."
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @Parameter(description = "Silinecek kullanıcı ID", example = "1")
            @PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "Kullanıcı silindi: ID=" + id));
    }

    @Operation(
            summary = "🎯 Abonelik tipini değiştir (Strategy Pattern)",
            description = """
                    **Tasarım Deseni: Strategy Pattern**

                    Bu endpoint, kullanıcının abonelik planını runtime'da değiştirir.
                    Her plan farklı bir `SubscriptionStrategy` concrete sınıfına karşılık gelir:

                    | Plan | Strateji Sınıfı | Maks. Çözünürlük | Aylık Fiyat |
                    |------|----------------|------------------|-------------|
                    | BASIC | BasicSubscription | 720p | 49.99 TL |
                    | STANDARD | StandardSubscription | 1080p | 79.99 TL |
                    | PREMIUM | PremiumSubscription | 4K | 119.99 TL |

                    Strateji nesnesi `SubscriptionType.toStrategy()` ile oluşturulur ve
                    `getMaxResolution()`, `getPrice()`, `getPlanName()` metotları çağrılır.

                    **Avantaj:** Yeni bir plan eklemek için sadece yeni bir strateji sınıfı yazılır,
                    mevcut kod değiştirilmez (Open/Closed Principle).
                    """
    )
    @PutMapping("/{id}/subscription")
    public ResponseEntity<Map<String, Object>> changeSubscription(
            @Parameter(description = "Kullanıcı ID", example = "2")
            @PathVariable Long id,
            @Parameter(description = "Yeni abonelik tipi", example = "PREMIUM")
            @RequestParam SubscriptionType type) {
        return ResponseEntity.ok(userService.changeSubscription(id, type));
    }

    @Operation(
            summary = "🎯 Abonelik bilgilerini getir (Strategy Pattern)",
            description = """
                    Kullanıcının mevcut abonelik tipine karşılık gelen strateji nesnesini kullanarak
                    plan adı, maksimum çözünürlük ve fiyat bilgilerini döndürür.

                    Strategy Pattern sayesinde her plan tipi kendi çözünürlük ve fiyat mantığını
                    bağımsız olarak tanımlar.
                    """
    )
    @GetMapping("/{id}/subscription")
    public ResponseEntity<Map<String, Object>> getSubscriptionInfo(
            @Parameter(description = "Kullanıcı ID", example = "1")
            @PathVariable Long id) {
        return ResponseEntity.ok(userService.getSubscriptionInfo(id));
    }
}
