package com.pokemon.demo.poke_api;

import com.pokemon.demo.poke_api.provider.PokemonProvider;
import com.pokemon.demo.poke_api.service.PokemonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PokeApiApplication {

//	@Autowired
//	private static PokemonProvider provider;

	public static void main(String[] args) throws Exception {

		SpringApplication.run(PokeApiApplication.class, args);
//		var ctx = SpringApplication.run(PokeApiApplication.class, args);
//		var provider = ctx.getBean(PokemonProvider.class);
//		var service =  ctx.getBean(PokemonService.class);

//		System.out.println(provider.findAll());
//		System.out.println(provider.findByName("Bulbasaur"));
//		System.out.println(service.getAllPokemon());
	}

}
