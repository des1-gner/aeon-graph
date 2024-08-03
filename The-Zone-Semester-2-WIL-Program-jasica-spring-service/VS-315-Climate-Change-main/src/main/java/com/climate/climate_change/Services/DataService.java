package com.climate.climate_change.Services;
import java.util.List;

import com.climate.climate_change.Records.*;


public interface DataService {
    List<Article> getData(String jsonResponseString);

    String saveArticles(List<Article> newArticles);

    List<Article> getArticles();
    
} 
