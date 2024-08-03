package com.climate.climate_change.Services;

import com.climate.climate_change.Repository.*;

import java.util.List;

import org.springframework.stereotype.Service;

import com.climate.climate_change.Records.*;


@Service
public class DataServiceImpl implements DataService{

    private final DataRepository dataRepository;

    public DataServiceImpl(DataRepository dataRepository){
        this.dataRepository = dataRepository;
    } 

    @Override
    public List<Article> getData(String jsonResponseString) {
        return dataRepository.getData(jsonResponseString);
    }

    @Override
    public String saveArticles(List<Article> newArticles) {
        return dataRepository.saveArticles(newArticles);
    }

    @Override
    public List<Article> getArticles(){
        return dataRepository.getArticles();
    }

}
