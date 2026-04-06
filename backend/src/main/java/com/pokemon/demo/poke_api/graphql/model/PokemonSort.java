package com.pokemon.demo.poke_api.graphql.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PokemonSort {

    private PokemonSortField field;
    private SortDirection direction;

}

