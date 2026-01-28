package com.pokemon.demo.poke_api.exception;

public class PokemonNotFoundException extends RuntimeException {
    public PokemonNotFoundException(int id) {
        super("Pokemon with id " + id + " not found");
    }
}
