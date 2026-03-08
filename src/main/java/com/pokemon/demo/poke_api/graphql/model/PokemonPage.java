package com.pokemon.demo.poke_api.graphql.model;

import com.pokemon.demo.poke_api.domain.Pokemon;
import java.util.List;

public record PokemonPage(List<Pokemon> items, int total) {}
