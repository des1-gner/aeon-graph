package com.the_zone_sem2_2024.api.controller;

import com.the_zone_sem2_2024.api.entity.Article;
import com.the_zone_sem2_2024.api.service.ArticleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/v1/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping("/fetch-and-save-articles")
    public Flux<Article> fetchAndSaveArticles(@RequestParam String query) {
        return articleService.fetchAndSaveRecentArticles(query);
    }

    @GetMapping("/recent-articles")
    public Flux<Article> fetchArticles(@RequestParam(defaultValue = "100") int limit) {
        return articleService.fetchRecentArticles(limit);
    }

    @GetMapping("/recent-urls")
    public Flux<String> getRecentUrls(@RequestParam(defaultValue = "100") int limit) {
        return articleService.findRecentUrls(limit);
    }
}
