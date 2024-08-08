package com.the_zone_sem2_2024.api.repository;

import com.the_zone_sem2_2024.api.entity.Article;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface ArticleRepository extends ReactiveMongoRepository<Article, String> {}
