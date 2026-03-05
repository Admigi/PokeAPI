package com.pokemon.demo.poke_api.graphql.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PokemonFilter {
    private Integer id;
    private String name;
    private String type;
    private List<String> typesAll;
    private List<String> typesAny;

}

