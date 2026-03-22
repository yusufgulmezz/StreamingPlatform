package com.streaming.platform.controller;

import com.streaming.platform.model.Content;
import com.streaming.platform.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * İçerik REST Controller.
 * CRUD işlemleri + Proxy Pattern ile yaş kontrollü oynatma + Downloadable kontrolü.
 */
@RestController
@RequestMapping("/api/contents")
@Tag(name = "İçerik Yönetimi (Content)",
     description = "İçerik CRUD işlemleri, Proxy Pattern ile yaş kontrollü oynatma ve Downloadable arayüzü ile indirme")
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    @Operation(
            summary = "Tüm içerikleri listele",
            description = "Veritabanındaki tüm içerikleri (Movie, Series, Documentary, Podcast) polimorfik olarak döndürür. " +
                          "Her alt sınıfın kendine özgü alanları da dahildir."
    )
    @GetMapping
    public ResponseEntity<List<Content>> getAllContents() {
        return ResponseEntity.ok(contentService.getAllContents());
    }

    @Operation(
            summary = "ID ile içerik getir",
            description = "Belirtilen ID'ye sahip içeriği getirir. İçerik bulunamazsa hata döner."
    )
    @GetMapping("/{id}")
    public ResponseEntity<Content> getContentById(
            @Parameter(description = "İçerik ID", example = "1")
            @PathVariable Long id) {
        return ResponseEntity.ok(contentService.getContentById(id));
    }

    @Operation(
            summary = "İçerik sil",
            description = "Belirtilen ID'ye sahip içeriği veritabanından kalıcı olarak siler."
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteContent(
            @Parameter(description = "Silinecek içerik ID", example = "1")
            @PathVariable Long id) {
        contentService.deleteContent(id);
        return ResponseEntity.ok(Map.of("message", "İçerik silindi: ID=" + id));
    }

    @Operation(
            summary = "🛡️ İçerik oynat (Proxy Pattern — Yaş Kontrolü)",
            description = """
                    **Tasarım Deseni: Proxy Pattern**

                    Bu endpoint, ContentPlayProxy aracılığıyla içerik oynatma isteğini işler.
                    Proxy, gerçek Playable nesnesini sarmalayarak yaş kısıtlaması kontrolü uygular:

                    1. İçerik `Playable` arayüzünü implement etmiyorsa → uyarı döner
                    2. Kullanıcının yaşı, içeriğin `requiredAge` değerinden küçükse → **Erişim Engellenir** (ör: 18+ içerik, 16 yaşındaki kullanıcı)
                    3. Yaş yeterliyse → Gerçek içeriğin `play()` metodu çağrılır

                    **Test Senaryosu:** userId=2 (16 yaş) ile 18+ içerik (id=2 veya id=3) deneyin → Erişim engellenecektir.
                    """
    )
    @PostMapping("/{id}/play")
    public ResponseEntity<Map<String, String>> playContent(
            @Parameter(description = "Oynatılacak içerik ID", example = "2")
            @PathVariable Long id,
            @Parameter(description = "Oynatma isteğinde bulunan kullanıcı ID", example = "2")
            @RequestParam Long userId) {
        String result = contentService.playContent(id, userId);
        return ResponseEntity.ok(Map.of("result", result));
    }

    @Operation(
            summary = "İçerik indir (Downloadable arayüzü kontrolü)",
            description = """
                    İçerik `Downloadable` arayüzünü implement ediyorsa indirilir.

                    **OOP — Interface Implementasyonu:**
                    - ✅ Documentary ve Podcast → `Downloadable` implement eder → indirilebilir
                    - ❌ Movie ve Series → `Downloadable` implement etmez → "Bu içerik indirilemez" uyarısı

                    Bu, OOP'nin polimorfizm ve arayüz ayrımı prensiplerini gösterir.
                    """
    )
    @PostMapping("/{id}/download")
    public ResponseEntity<Map<String, String>> downloadContent(
            @Parameter(description = "İndirilecek içerik ID", example = "5")
            @PathVariable Long id) {
        String result = contentService.downloadContent(id);
        return ResponseEntity.ok(Map.of("result", result));
    }
}
