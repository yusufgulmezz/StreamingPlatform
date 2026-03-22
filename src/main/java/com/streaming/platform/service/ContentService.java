package com.streaming.platform.service;

import com.streaming.platform.model.Content;
import com.streaming.platform.model.User;
import com.streaming.platform.model.interfaces.Playable;
import com.streaming.platform.proxy.ContentPlayProxy;
import com.streaming.platform.repository.ContentRepository;
import com.streaming.platform.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * İçerik iş mantığı servisi.
 * İçerik CRUD işlemlerini ve Proxy Pattern ile yaş kontrollü oynatmayı yönetir.
 */
@Service
public class ContentService {

    private final ContentRepository contentRepository;
    private final UserRepository userRepository;

    public ContentService(ContentRepository contentRepository, UserRepository userRepository) {
        this.contentRepository = contentRepository;
        this.userRepository = userRepository;
    }

    public List<Content> getAllContents() {
        return contentRepository.findAll();
    }

    public Content getContentById(Long id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("İçerik bulunamadı: ID=" + id));
    }

    public Content saveContent(Content content) {
        return contentRepository.save(content);
    }

    public void deleteContent(Long id) {
        contentRepository.deleteById(id);
    }

    /**
     * Proxy Pattern kullanarak yaş kontrollü oynatma.
     * İçerik Playable değilse hata döndürür.
     * İçerik Playable ise ContentPlayProxy ile yaş kontrolünden geçirilir.
     */
    public String playContent(Long contentId, Long userId) {
        Content content = getContentById(contentId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: ID=" + userId));

        if (!(content instanceof Playable playable)) {
            return "⚠ Bu içerik oynatılamaz: \"" + content.getTitle() + "\"";
        }

        // Proxy ile yaş kontrolü
        ContentPlayProxy proxy = new ContentPlayProxy(playable, content, user);
        return proxy.play();
    }

    /**
     * İçerik indirme işlemi.
     */
    public String downloadContent(Long contentId) {
        Content content = getContentById(contentId);

        if (content instanceof com.streaming.platform.model.interfaces.Downloadable downloadable) {
            return downloadable.download();
        }
        return "⚠ Bu içerik indirilemez: \"" + content.getTitle() + "\"";
    }
}
