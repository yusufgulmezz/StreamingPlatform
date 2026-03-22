package com.streaming.platform.iterator;

import com.streaming.platform.model.Content;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Iterator Pattern — İzleme Listesi (Watchlist).
 *
 * Iterable&lt;Content&gt; implement ederek for-each döngüsüyle
 * ve özel WatchlistIterator ile kullanılabilir.
 * İç veri yapısı dışarıya doğrudan açılmaz.
 */
public class Watchlist implements Iterable<Content> {

    private final List<Content> contents = new ArrayList<>();

    /** İzleme listesine içerik ekler. */
    public void addContent(Content content) {
        contents.add(content);
    }

    /** İzleme listesinden içerik kaldırır. */
    public boolean removeContent(Content content) {
        return contents.remove(content);
    }

    /** İzleme listesindeki toplam içerik sayısını döndürür. */
    public int size() {
        return contents.size();
    }

    /** İzleme listesinin boş olup olmadığını kontrol eder. */
    public boolean isEmpty() {
        return contents.isEmpty();
    }

    /**
     * Özel WatchlistIterator döndürür.
     * Bu sayede iç List yapısı dışarıya açılmadan sıralı erişim sağlanır.
     */
    @Override
    public Iterator<Content> iterator() {
        return new WatchlistIterator(new ArrayList<>(contents));
    }
}
