package com.streaming.platform.service;

import com.streaming.platform.iterator.Watchlist;
import com.streaming.platform.model.Content;
import com.streaming.platform.repository.ContentRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * İzleme Listesi servisi.
 * Iterator Pattern entegrasyonu ile kullanıcının izleme listesini yönetir.
 * In-memory olarak tutulur (her kullanıcı için ayrı Watchlist).
 */
@Service
public class WatchlistService {

    private final ContentRepository contentRepository;

    /** Kullanıcı ID → Watchlist eşleştirmesi */
    private final Map<Long, Watchlist> watchlists = new ConcurrentHashMap<>();

    public WatchlistService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    /**
     * Kullanıcının izleme listesine içerik ekler.
     */
    public String addToWatchlist(Long userId, Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("İçerik bulunamadı: ID=" + contentId));

        Watchlist watchlist = watchlists.computeIfAbsent(userId, k -> new Watchlist());
        watchlist.addContent(content);

        return "✅ \"" + content.getTitle() + "\" izleme listesine eklendi.";
    }

    /**
     * Iterator Pattern kullanarak izleme listesini sırayla döndürür.
     * Özel WatchlistIterator ile iç veri yapısından bağımsız erişim.
     */
    public List<Map<String, Object>> getWatchlist(Long userId) {
        Watchlist watchlist = watchlists.get(userId);
        if (watchlist == null || watchlist.isEmpty()) {
            return Collections.emptyList();
        }

        List<Map<String, Object>> result = new ArrayList<>();
        int index = 1;

        // Iterator pattern ile gezinme
        Iterator<Content> iterator = watchlist.iterator();
        while (iterator.hasNext()) {
            Content content = iterator.next();
            result.add(Map.of(
                    "order", index++,
                    "id", content.getId(),
                    "title", content.getTitle(),
                    "type", content.getContentType(),
                    "duration", content.getDuration() + " dk"
            ));
        }

        return result;
    }

    /**
     * İzleme listesinden içerik kaldırır.
     */
    public String removeFromWatchlist(Long userId, Long contentId) {
        Watchlist watchlist = watchlists.get(userId);
        if (watchlist == null) {
            return "⚠ İzleme listesi boş.";
        }

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("İçerik bulunamadı: ID=" + contentId));

        // İçeriği ID ile eşleştirerek kaldır
        Iterator<Content> iterator = watchlist.iterator();
        Watchlist newWatchlist = new Watchlist();
        boolean found = false;

        while (iterator.hasNext()) {
            Content c = iterator.next();
            if (c.getId().equals(contentId) && !found) {
                found = true; // ilk eşleşmeyi kaldır
            } else {
                newWatchlist.addContent(c);
            }
        }

        watchlists.put(userId, newWatchlist);
        return found
                ? "✅ \"" + content.getTitle() + "\" izleme listesinden kaldırıldı."
                : "⚠ İçerik izleme listesinde bulunamadı.";
    }
}
