package com.the_zone_sem2_2024.api.entity;


import lombok.Data;
import lombok.Getter;

@Data
public class ArticleDto {
    private SourceDto source;
    private String author;
    private String title;
    private String description;
    private String url;
    private String urlToImage;
    private String publishedAt;
    private String content;
}

