package com.pokemon.demo.poke_api.graphql;

import com.pokemon.demo.poke_api.domain.Pokemon;
import com.pokemon.demo.poke_api.graphql.model.PokemonFilter;
import com.pokemon.demo.poke_api.graphql.model.PokemonPage;
import com.pokemon.demo.poke_api.graphql.model.PokemonSort;
import com.pokemon.demo.poke_api.graphql.service.PokemonGraphqlService;
import com.pokemon.demo.poke_api.service.PokemonService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class PokemonQueryResolver {

    private final PokemonService pokemonService;
    private final PokemonGraphqlService pokemonGraphqlService;

    public PokemonQueryResolver(PokemonService pokemonService, PokemonGraphqlService pokemonGraphqlService) {
        this.pokemonService = pokemonService;
        this.pokemonGraphqlService = pokemonGraphqlService;
    }

    @QueryMapping
    public Pokemon pokemon(@Argument int id) {
        return pokemonService.findById(id);
    }

    @QueryMapping
    public PokemonPage pokemons(
            @Argument PokemonFilter filter,
            @Argument PokemonSort sort,
            @Argument Integer limit,
            @Argument Integer offset
    ) {
        return pokemonGraphqlService.applyQuery(
                pokemonService.getAllPokemon(),
                filter,
                sort,
                limit,
                offset
        );
    }
}
