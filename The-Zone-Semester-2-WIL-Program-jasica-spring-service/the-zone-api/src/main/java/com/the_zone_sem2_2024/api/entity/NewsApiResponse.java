package com.the_zone_sem2_2024.api.entity;

import lombok.Data;
import java.util.List;

@Data
public class NewsApiResponse {
    private String status;
    private int totalResults;
    private List<ArticleDto> articles;
}
