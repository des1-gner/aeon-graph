package com.the_zone_sem2_2024.api.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "articles")
public class Article {

    @Id
    private String id;
    private String sourceName;
    private String author;
    private String title;
    private String description;
    @Indexed(unique = true)
    private String url;
    private String imageUrl;
    private String publishedAt;
    private String content;
}
