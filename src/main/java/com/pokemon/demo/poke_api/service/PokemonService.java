package com.pokemon.demo.poke_api.service;

import com.pokemon.demo.poke_api.domain.Pokemon;
import com.pokemon.demo.poke_api.exception.PokemonNotFoundException;
import com.pokemon.demo.poke_api.provider.PokemonProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PokemonService {

    private final PokemonProvider pokemonProvider;

    @Autowired
    public PokemonService(final PokemonProvider pokemonProvider) {
        this.pokemonProvider = pokemonProvider;
    }

    public List<Pokemon> getAllPokemon() {
        return pokemonProvider.findAll();
    }

    public Pokemon findById(int id) {
        return pokemonProvider.findAll().stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElseThrow(() -> new PokemonNotFoundException(id));
    }

    public List<Pokemon> findByName(String name) {
        String lowerName = name.toLowerCase();

        return pokemonProvider.findAll().stream()
                .filter(p -> p.getName().toLowerCase().contains(lowerName))
                .collect(Collectors.toList());
    }

    public List<Pokemon> findByType(String type) {
        String lowerType = type.toLowerCase();

        return pokemonProvider.findAll().stream()
                .filter(p -> p.getTypes().stream()
                        .anyMatch(t -> t.toLowerCase().contains(lowerType)))
                .collect(Collectors.toList());
    }
}
