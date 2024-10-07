package com.climate.climate_change.Repository;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.climate.climate_change.Records.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class DataRepositoryImpl implements DataRepository {

    private final String FILE_PATH = "articles.json";
    private final ObjectMapper objectMapper = new ObjectMapper();


    @Override
    public List<Article> getData(String jsonResponseString) { // Pass JSON response string as parameter
        List<Article> articles = new ArrayList<>();

        try {
            // Parse the JSON response
            JSONObject jsonResponse = new JSONObject(jsonResponseString);

            // Check if status is "ok"
            if (jsonResponse.getString("status").equals("ok")) {

                // Get the "articles" array
                JSONArray articlesArray = jsonResponse.getJSONArray("articles");

                // Loop through each article object in the array
                for (int i = 0; i < articlesArray.length(); i++) {
                    JSONObject articleObject = articlesArray.getJSONObject(i);

                    // Extract relevant information about the article
                    String sourceName = articleObject.getJSONObject("source").getString("name");
                    String author = articleObject.getString("author");
                    String title = articleObject.getString("title");
                    String description = articleObject.getString("description");
                    String url = articleObject.getString("url");
                    String urlToImage = articleObject.optString("urlToImage", ""); // Handle null case
                    String publishedAt = articleObject.getString("publishedAt");
                    String content = articleObject.getString("content");

                    // Create an Article object and add it to the list
                    Article article = new Article(sourceName, author, title, description, url, urlToImage, publishedAt, content);
                    articles.add(article);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return articles;
    }

    @Override
    public String saveArticles(List<Article> newArticles) {
        List<Article> articles = new ArrayList<>();
    
        // Read existing articles from file
        try {
            File file = new File(FILE_PATH);
            if (file.exists()) {
                articles = objectMapper.readValue(file, new TypeReference<List<Article>>() {});
            }
    
            // Append only new articles that do not already exist in the list
            for (Article newArticle : newArticles) {
                if (!articles.contains(newArticle)) {
                    articles.add(newArticle);
                }
            }
    
            // Write updated articles back to file
            objectMapper.writeValue(file, articles);
    
            return "Articles saved successfully";
        } catch (IOException e) {
            e.printStackTrace();
            return "Error saving articles";
        }
    }


    // Gets the articles from JSON file
    @Override
    public List<Article> getArticles() {
        File file = new File(FILE_PATH);
        if (file.exists()) {
            try {
                return objectMapper.readValue(file, new com.fasterxml.jackson.core.type.TypeReference<List<Article>>() {});
            } catch (Exception e){
                e.printStackTrace();
            }

        } else {
            return List.of();
        }
        return null;
    }
    
}
