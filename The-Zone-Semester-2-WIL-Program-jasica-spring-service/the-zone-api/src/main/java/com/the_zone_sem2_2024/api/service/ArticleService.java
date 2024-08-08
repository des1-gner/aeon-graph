package com.the_zone_sem2_2024.api.service;

import com.the_zone_sem2_2024.api.entity.Article;
import com.the_zone_sem2_2024.api.entity.ArticleDto;
import com.the_zone_sem2_2024.api.entity.NewsApiResponse;
import com.the_zone_sem2_2024.api.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import static org.springframework.data.domain.Sort.*;
import static org.springframework.data.domain.Sort.Direction.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ArticleService {
    @Autowired
    private ArticleRepository articleRepository;
    private final String baseUrl = "https://newsapi.org/v2/" ;
    @Value("${news-api.key}")
    private String apiKey;
    private final WebClient webClient = WebClient.builder().baseUrl(baseUrl).build();

    public Flux<String> getUrls(int limit){
        return articleRepository
                .findAll(by(DESC, "publishedAt"))
                .map(Article::getUrl)
                .take(limit);
    }

    public Flux<Article> getArticles(int limit){
        return articleRepository
                .findAll(by(DESC, "publishedAt"))
                .take(limit);
    }

    public Flux<Article> fetchAndSaveApiArticles(String query) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/everything")
                        .queryParam("q", query)
                        .queryParam("apiKey", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(NewsApiResponse.class)
                .flatMapMany(newsApiResponse -> Flux.fromIterable(newsApiResponse.getArticles()))
                .map(this::convertToArticle)
                .flatMap(this::save)
                .doOnError(DuplicateKeyException.class, ex -> log.warn("Duplicate article detected: {}", ex.getMessage()));
    }

    private Mono<Article> save(Article article) {
        return articleRepository.save(article)
                .onErrorResume(DuplicateKeyException.class, ex -> Mono.empty());
    }

    private Article convertToArticle(ArticleDto dto) {
        return new Article(
                null, 
                dto.getSource().getName(),
                dto.getAuthor(),
                dto.getTitle(),
                dto.getDescription(),
                dto.getUrl(),
                dto.getUrlToImage(),
                dto.getPublishedAt(),
                dto.getContent());
    }
}
