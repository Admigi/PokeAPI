package com.pokemon.demo.poke_api.graphql;

import com.pokemon.demo.poke_api.domain.Pokemon;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

@Controller
public class PokemonFieldResolver {

    @SchemaMapping(typeName = "Pokemon", field = "imageUrl")
    public String imageUrl(Pokemon pokemon) {
        return "https://img.pokemondb.net/sprites/black-white/normal/"
                + pokemon.getName().toLowerCase()
                + ".png";
    }
}
