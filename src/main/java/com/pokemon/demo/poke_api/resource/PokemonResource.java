package com.pokemon.demo.poke_api.resource;

import com.pokemon.demo.poke_api.domain.Pokemon;
import com.pokemon.demo.poke_api.service.PokemonService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class PokemonResource {

    private final PokemonService pokemonService;

    public PokemonResource(final PokemonService pokemonService) {
        this.pokemonService = pokemonService;
    }

    @GetMapping("/pokemon")
    public List<Pokemon> getAll() {
        return pokemonService.getAllPokemon();
    }

    @GetMapping("/pokemon/{id}")
    public Pokemon getById(@PathVariable final int id) {
        return pokemonService.findById(id);
    }

    @GetMapping(value = "/pokemon", params = "name")
    public List<Pokemon> getByName(@RequestParam String name) {
        return pokemonService.findByName(name);
    }

    @GetMapping(value = "/pokemon", params = "type")
    public List<Pokemon> getByType(@RequestParam String type) {
        return pokemonService.findByType(type);
    }
}
