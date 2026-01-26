package com.pokemon.demo.poke_api.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Builder
@Setter
@Getter
@ToString
public class Pokemon {
    private int id;
    private String name;
    private List<String> types;
    private PokemonStats stats;

}
