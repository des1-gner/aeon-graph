package com.the_zone_sem2_2024.api.service;

import com.the_zone_sem2_2024.api.entity.Article;
import com.the_zone_sem2_2024.api.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    public Mono<Article> findByUrl(String url){
        return articleRepository.findByUrl(url);
    }

}
