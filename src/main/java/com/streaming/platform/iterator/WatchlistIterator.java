package com.streaming.platform.iterator;

import com.streaming.platform.model.Content;

import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Iterator Pattern — İzleme listesi için özel iterator.
 *
 * İç veri yapısını (List) dışarıya gizleyerek,
 * yalnızca hasNext() / next() ile sıralı erişim sağlar.
 */
public class WatchlistIterator implements Iterator<Content> {

    private final List<Content> items;
    private int currentIndex = 0;

    public WatchlistIterator(List<Content> items) {
        this.items = items;
    }

    @Override
    public boolean hasNext() {
        return currentIndex < items.size();
    }

    @Override
    public Content next() {
        if (!hasNext()) {
            throw new NoSuchElementException("İzleme listesinin sonuna ulaşıldı.");
        }
        return items.get(currentIndex++);
    }
}
