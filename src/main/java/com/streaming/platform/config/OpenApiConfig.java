package com.streaming.platform.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger / OpenAPI yapılandırması.
 * Swagger UI üzerinde görüntülenecek API meta bilgilerini tanımlar.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI streamingPlatformOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Streaming Platform API")
                        .description("""
                                Abonelik tabanlı dijital içerik (streaming) platformu REST API.

                                **Uygulanan Tasarım Desenleri:**
                                - 🎯 **Strategy Pattern** — Abonelik yönetimi (Basic / Standard / Premium)
                                - 🛡️ **Proxy Pattern** — Yaş kısıtlaması kontrolü (18+ içerik koruması)
                                - 🔄 **Iterator Pattern** — İzleme listesi gezinme mekanizması

                                **OOP Prensipleri:**
                                - Abstract class kalıtımı (Content → Movie, Series, Documentary, Podcast)
                                - Interface implementasyonu (Playable, Downloadable)
                                - Polimorfizm ve Enkapsülasyon
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Streaming Platform Team"))
                        .license(new License()
                                .name("MIT License")));
    }
}
