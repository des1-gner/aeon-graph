package com.the_zone_sem2_2024.api.controller;

import com.the_zone_sem2_2024.api.entity.Article;
import com.the_zone_sem2_2024.api.service.ArticleService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@AllArgsConstructor
@RequestMapping(value = "/v1/articles")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PostMapping("/news-api")
    public Flux<Article> fetchAndSaveApiArticles(@RequestParam String query) {
        return articleService.fetchAndSaveApiArticles(query);
    }

    @GetMapping("/")
    public Flux<Article> getArticles(@RequestParam(defaultValue = "100") int limit) {
        return articleService.getArticles(limit);
    }

    @GetMapping("/urls")
    public Flux<String> getUrls(@RequestParam(defaultValue = "100") int limit) {
        return articleService.getUrls(limit);
    }
}
