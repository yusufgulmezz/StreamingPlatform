package com.streaming.platform.controller;

import com.streaming.platform.service.WatchlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * İzleme Listesi REST Controller.
 * Iterator Pattern ile izleme listesi gezinme.
 */
@RestController
@RequestMapping("/api/watchlist")
@Tag(name = "İzleme Listesi (Watchlist)",
     description = "İzleme listesi yönetimi ve Iterator Pattern ile veri yapısından bağımsız sıralı gezinme")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @Operation(
            summary = "İzleme listesine içerik ekle",
            description = "Belirtilen kullanıcının izleme listesine bir içerik ekler. " +
                          "İçerik tipi fark etmeksizin (Movie, Series, Documentary, Podcast) " +
                          "polimorfik olarak Watchlist'e eklenebilir."
    )
    @PostMapping("/{userId}")
    public ResponseEntity<Map<String, String>> addToWatchlist(
            @Parameter(description = "Kullanıcı ID", example = "1")
            @PathVariable Long userId,
            @Parameter(description = "Eklenecek içerik ID", example = "1")
            @RequestParam Long contentId) {
        String result = watchlistService.addToWatchlist(userId, contentId);
        return ResponseEntity.ok(Map.of("result", result));
    }

    @Operation(
            summary = "🔄 İzleme listesini getir (Iterator Pattern)",
            description = """
                    **Tasarım Deseni: Iterator Pattern**

                    Bu endpoint, kullanıcının izleme listesini özel `WatchlistIterator` ile sıralı olarak döndürür.

                    **Nasıl Çalışır:**
                    1. `Watchlist` sınıfı `Iterable<Content>` implement eder
                    2. `iterator()` metodu özel `WatchlistIterator` nesnesi döndürür
                    3. `WatchlistIterator`, `hasNext()` ve `next()` ile sıralı erişim sağlar
                    4. İç veri yapısı (List) dışarıya açılmaz — sadece Iterator aracılığıyla erişim

                    **Avantaj:** İç veri yapısı (ArrayList, LinkedList, Set vb.) değişse bile
                    dış kod etkilenmez; sadece Iterator implementasyonu güncellenir.
                    """
    )
    @GetMapping("/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getWatchlist(
            @Parameter(description = "Kullanıcı ID", example = "1")
            @PathVariable Long userId) {
        return ResponseEntity.ok(watchlistService.getWatchlist(userId));
    }

    @Operation(
            summary = "İzleme listesinden içerik kaldır",
            description = "Belirtilen kullanıcının izleme listesinden bir içeriği kaldırır. " +
                          "Iterator ile gezilerek eşleşen içerik bulunur ve yeni bir Watchlist oluşturulur."
    )
    @DeleteMapping("/{userId}")
    public ResponseEntity<Map<String, String>> removeFromWatchlist(
            @Parameter(description = "Kullanıcı ID", example = "1")
            @PathVariable Long userId,
            @Parameter(description = "Kaldırılacak içerik ID", example = "1")
            @RequestParam Long contentId) {
        String result = watchlistService.removeFromWatchlist(userId, contentId);
        return ResponseEntity.ok(Map.of("result", result));
    }
}
