package com.pokemon.demo.poke_api.graphql;

import com.pokemon.demo.poke_api.domain.Pokemon;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

@Controller
public class PokemonFieldResolver {

    @SchemaMapping(typeName = "Pokemon", field = "imageUrl")
    public String imageUrl(Pokemon pokemon) {
        String slug = toSpriteSlug(pokemon.getName());

        return "https://img.pokemondb.net/sprites/brilliant-diamond-shining-pearl/normal/"
                + slug + ".png";
    }

    private String toSpriteSlug(String name) {
        return name.toLowerCase()
                .replace("♀", "-f")
                .replace("♂", "-m")
                .replace(".", "")
                .replace(" ", "-");
    }
}
