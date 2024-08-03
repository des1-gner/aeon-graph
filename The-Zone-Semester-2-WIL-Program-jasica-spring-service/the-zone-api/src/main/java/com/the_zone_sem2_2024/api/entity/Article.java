package com.the_zone_sem2_2024.api.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "articles")
@Data
public class Article {

    @Id
    private String id;
    private String sourceName;
    private String author;
    private String title;
    private String description;
    private String url;
    private String imageUrl;
    private String publishedAt;
    private String content;
}
