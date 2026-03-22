package com.streaming.platform.proxy;

import com.streaming.platform.model.Content;
import com.streaming.platform.model.User;
import com.streaming.platform.model.interfaces.Playable;

/**
 * Proxy Pattern — Yaş kısıtlaması kontrolü.
 *
 * Gerçek Playable nesnesini sarmalayarak, kullanıcı yaşı
 * içeriğin requiredAge değerinden küçükse oynatmayı engeller.
 */
public class ContentPlayProxy implements Playable {

    private final Playable realContent;
    private final Content contentInfo;
    private final User user;

    /**
     * @param realContent gerçek Playable içerik nesnesi
     * @param contentInfo içerik meta verisi (requiredAge kontrolü için)
     * @param user        oynatma isteğinde bulunan kullanıcı
     */
    public ContentPlayProxy(Playable realContent, Content contentInfo, User user) {
        this.realContent = realContent;
        this.contentInfo = contentInfo;
        this.user = user;
    }

    /**
     * Yaş kontrolünden geçerse içeriği oynatır,
     * geçemezse erişim engeli mesajı döndürür.
     */
    @Override
    public String play() {
        if (user.getAge() < contentInfo.getRequiredAge()) {
            return "⛔ Erişim Engellendi! \""
                    + contentInfo.getTitle()
                    + "\" içeriği için minimum yaş: "
                    + contentInfo.getRequiredAge()
                    + ". Kullanıcı yaşı: " + user.getAge() + ".";
        }
        return realContent.play();
    }
}
