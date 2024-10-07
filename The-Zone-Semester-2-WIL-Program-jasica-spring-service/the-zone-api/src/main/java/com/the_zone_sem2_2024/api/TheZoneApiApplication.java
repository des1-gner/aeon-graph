package com.the_zone_sem2_2024.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

@SpringBootApplication
@EnableReactiveMongoRepositories
public class TheZoneApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(TheZoneApiApplication.class, args);
	}
}
