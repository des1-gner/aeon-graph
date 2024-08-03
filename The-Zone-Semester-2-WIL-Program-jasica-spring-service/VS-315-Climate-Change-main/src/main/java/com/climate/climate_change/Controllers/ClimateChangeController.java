package com.climate.climate_change.Controllers;

import com.climate.climate_change.Services.*;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.climate.climate_change.Records.*;

@RestController
@RequestMapping(value = "/v1")
public class ClimateChangeController { 

    private final DataService dataService;

    @Autowired
    public ClimateChangeController(DataService dataService){
        this.dataService = dataService;
    }

    @GetMapping("/getData")
    public List<Article> getData(String jsonResponseString){
        return dataService.getData(jsonResponseString);
    }

    @PostMapping("/save-articles")
    public String saveArticles(@RequestBody List<Article> newArticles) {
        return dataService.saveArticles(newArticles);
    }

    @GetMapping("/get-articles")
    public List<Article> getArticles() throws IOException {
        return dataService.getArticles(); 
    }
    
}
