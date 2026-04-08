package com.pokemon.demo.poke_api.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Setter
@Getter
public class Pokemon {
    private int id;
    private String name;
    private List<String> types;
    private PokemonStats stats;
}
