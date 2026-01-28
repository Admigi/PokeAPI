package com.pokemon.demo.poke_api.resource;

import com.pokemon.demo.poke_api.domain.Pokemon;
import com.pokemon.demo.poke_api.service.PokemonService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Validated
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
    public Pokemon getById(
            @PathVariable
            @Min(value = 1, message = "id must be >= 1")
            final int id) {
        return pokemonService.findById(id);
    }

    @GetMapping(value = "/pokemon", params = "name")
    public List<Pokemon> getByName(
            @RequestParam
            @NotBlank(message = "name must not be blank")
            String name) {
        return pokemonService.findByName(name);
    }

    @GetMapping(value = "/pokemon", params = "type")
    public List<Pokemon> getByType(
            @RequestParam
            @NotBlank(message = "type must not be blank")
            String type) {
        return pokemonService.findByType(type);
    }
}
