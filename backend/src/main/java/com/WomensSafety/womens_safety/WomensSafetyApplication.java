package com.WomensSafety.womens_safety;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WomensSafetyApplication {

	public static void main(String[] args) {
		SpringApplication.run(WomensSafetyApplication.class, args);
	}
}