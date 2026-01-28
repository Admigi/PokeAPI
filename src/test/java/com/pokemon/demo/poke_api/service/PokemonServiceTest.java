package com.pokemon.demo.poke_api.service;

import com.pokemon.demo.poke_api.domain.Pokemon;
import com.pokemon.demo.poke_api.exception.PokemonNotFoundException;
import com.pokemon.demo.poke_api.provider.PokemonProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PokemonServiceTest {

    @Mock
    PokemonProvider pokemonProvider;

    PokemonService pokemonService;

    @BeforeEach
    void setUp() {
        pokemonService = new PokemonService(pokemonProvider);
    }

    private Pokemon pokemon(int id, String name, List<String> types) {
        return Pokemon.builder()
                .id(id)
                .name(name)
                .types(types)
                .build();
    }

    @Test
    void getAllPokemon_returnsProviderList() {
        List<Pokemon> data = List.of(
                pokemon(1, "Bulbasaur", List.of("Grass", "Poison")),
                pokemon(4, "Charmander", List.of("Fire"))
        );
        when(pokemonProvider.findAll()).thenReturn(data);

        List<Pokemon> result = pokemonService.getAllPokemon();

        assertSame(data, result);
        verify(pokemonProvider).findAll();
    }

    @Test
    void findById_existing_returnsPokemon() {
        List<Pokemon> data = List.of(
                pokemon(1, "Bulbasaur", List.of("Grass", "Poison")),
                pokemon(4, "Charmander", List.of("Fire"))
        );
        when(pokemonProvider.findAll()).thenReturn(data);

        Pokemon result = pokemonService.findById(4);

        assertEquals(4, result.getId());
        assertEquals("Charmander", result.getName());
        verify(pokemonProvider).findAll();
    }

    @Test
    void findById_missing_throwsPokemonNotFoundException() {
        when(pokemonProvider.findAll()).thenReturn(List.of(
                pokemon(1, "Bulbasaur", List.of("Grass", "Poison"))
        ));

        PokemonNotFoundException ex = assertThrows(
                PokemonNotFoundException.class,
                () -> pokemonService.findById(999)
        );

        assertTrue(ex.getMessage().contains("999"));
        verify(pokemonProvider).findAll();
    }

    @Test
    void findByName_isCaseInsensitive_andUsesContains() {
        when(pokemonProvider.findAll()).thenReturn(List.of(
                pokemon(25, "Pikachu", List.of("Electric")),
                pokemon(26, "Raichu", List.of("Electric")),
                pokemon(1, "Bulbasaur", List.of("Grass", "Poison"))
        ));

        // "pika" should match Pikachu (contains + case-insensitive)
        List<Pokemon> result = pokemonService.findByName("pIkA");

        assertEquals(1, result.size());
        assertEquals("Pikachu", result.getFirst().getName());
        verify(pokemonProvider).findAll();
    }

    @Test
    void findByName_noMatches_returnsEmptyList() {
        when(pokemonProvider.findAll()).thenReturn(List.of(
                pokemon(1, "Bulbasaur", List.of("Grass", "Poison"))
        ));

        List<Pokemon> result = pokemonService.findByName("zzz");

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(pokemonProvider).findAll();
    }

    @Test
    void findByType_isCaseInsensitive_andMatchesAnyTypeByContains() {
        when(pokemonProvider.findAll()).thenReturn(List.of(
                pokemon(1, "Bulbasaur", List.of("Grass", "Poison")),
                pokemon(4, "Charmander", List.of("Fire")),
                pokemon(6, "Charizard", List.of("Fire", "Flying"))
        ));

        List<Pokemon> result = pokemonService.findByType("fIr");

        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(p -> p.getName().equals("Charmander")));
        assertTrue(result.stream().anyMatch(p -> p.getName().equals("Charizard")));
        verify(pokemonProvider).findAll();
    }

    @Test
    void findByType_noMatches_returnsEmptyList() {
        when(pokemonProvider.findAll()).thenReturn(List.of(
                pokemon(4, "Charmander", List.of("Fire"))
        ));

        List<Pokemon> result = pokemonService.findByType("water");

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(pokemonProvider).findAll();
    }
}

