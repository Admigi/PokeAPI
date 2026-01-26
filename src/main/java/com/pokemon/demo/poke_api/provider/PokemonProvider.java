package com.pokemon.demo.poke_api.provider;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pokemon.demo.poke_api.domain.Pokemon;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;

@Component
public class PokemonProvider {

    private final List<Pokemon> pokemons;

    public PokemonProvider(ObjectMapper mapper) {
        try {
            // 1 → open from classpath
            InputStream is = getClass().getClassLoader().getResourceAsStream("data/pokemon.json");

            if (is == null) {
                throw new RuntimeException("pokemon.json not found in classpath!");
            }

            // 2 → parse JSON into List<Pokemon>
            this.pokemons = mapper.readValue(is, new TypeReference<List<Pokemon>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to load pokemon.json", e);
        }
    }

    // cache: just return the same list
    public List<Pokemon> findAll() {
        return Collections.unmodifiableList(pokemons);
    }

}
