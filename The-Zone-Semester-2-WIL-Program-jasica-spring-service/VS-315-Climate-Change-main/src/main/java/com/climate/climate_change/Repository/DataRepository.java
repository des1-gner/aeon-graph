package com.climate.climate_change.Repository;
import java.util.List;

import com.climate.climate_change.Records.*;

public interface DataRepository{

    public List<Article> getData(String jsonResponseString);

    public String saveArticles(List<Article> newArticles);

    public List<Article> getArticles();
    
}
