package com.pokemon.demo.poke_api.graphql;

import com.pokemon.demo.poke_api.domain.Pokemon;
import com.pokemon.demo.poke_api.domain.PokemonStats;
import com.pokemon.demo.poke_api.graphql.service.PokemonGraphqlService;
import com.pokemon.demo.poke_api.service.PokemonService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.graphql.GraphQlTest;
import org.springframework.context.annotation.Import;
import org.springframework.graphql.test.tester.GraphQlTester;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.assertj.core.api.Assertions.assertThat;

@GraphQlTest(PokemonQueryResolver.class)
@Import({
        PokemonGraphqlService.class,
        PokemonFieldResolver.class
})
class PokemonQueryResolverGraphQlTest {

    @Autowired
    private GraphQlTester graphQlTester;

    @MockitoBean
    private PokemonService pokemonService;

    private List<Pokemon> sample;

    @BeforeEach
    void setUp() {
        sample = List.of(
                pokemon(1, "Bulbasaur", List.of("grass", "poison"), stats(45, 49, 49, 65, 65, 45)),
                pokemon(4, "Charmander", List.of("fire"), stats(39, 52, 43, 60, 50, 65)),
                pokemon(6, "Charizard", List.of("fire", "flying"), stats(78, 84, 78, 109, 85, 100)),
                pokemon(7, "Squirtle", List.of("water"), stats(44, 48, 65, 50, 64, 43)),
                pokemon(25, "Pikachu", List.of("electric"), stats(35, 55, 40, 50, 50, 90)),
                pokemon(16, "Pidgey", List.of("normal", "flying"), stats(40, 45, 40, 35, 35, 56))
        );

        given(pokemonService.getAllPokemon()).willReturn(sample);
    }

    @Test
    void shouldFilterByTypesAll_fireAndFlying() {
        graphQlTester.document("""
                query {
                  pokemons(filter: { typesAll: ["fire", "flying"] }, limit: 50) {
                    id
                    name
                    types
                  }
                }
                """)
                .execute()
                .path("pokemons[*].name")
                .entityList(String.class)
                .satisfies(names -> assertThat(names).containsExactly("Charizard"));
    }

    @Test
    void shouldSortBySpeedDesc() {
        graphQlTester.document("""
                query {
                  pokemons(sort: { field: SPEED, direction: DESC }, limit: 10) {
                    name
                    stats { speed }
                  }
                }
                """)
                .execute()
                .path("pokemons[*].stats.speed")
                .entityList(Integer.class)
                .satisfies(speeds -> {
                    assertThat(speeds).isNotEmpty();
                    for (int i = 0; i < speeds.size() - 1; i++) {
                        assertThat(speeds.get(i)).isGreaterThanOrEqualTo(speeds.get(i + 1));
                    }
                });
    }

    @Test
    void shouldPaginateWithLimitAndOffset() {
        graphQlTester.document("""
                query {
                  pokemons(sort: { field: ID, direction: ASC }, limit: 2, offset: 2) {
                    id
                    name
                  }
                }
                """)
                .execute()
                .path("pokemons[*].id")
                .entityList(Integer.class)
                .satisfies(ids -> {
                    assertThat(ids).containsExactly(6, 7);
                });
    }

    @Test
    void shouldReturnCorrectImageUrl() {
        var result = graphQlTester.document("""
            query {
              pokemons(limit: 1) {
                name
                imageUrl
              }
            }
            """)
                .execute();

        result.path("pokemons[0].name")
                .entity(String.class)
                .isEqualTo("Bulbasaur");

        result.path("pokemons[0].imageUrl")
                .entity(String.class)
                .isEqualTo("https://img.pokemondb.net/sprites/black-white/normal/bulbasaur.png");
    }

    private Pokemon pokemon(int id, String name, List<String> types, PokemonStats stats) {
        return Pokemon.builder()
                .id(id)
                .name(name)
                .types(types)
                .stats(stats)
                .build();
    }

    private PokemonStats stats(int hp, int attack, int defense, int specialAttack, int specialDefense, int speed) {
        return PokemonStats.builder()
                .hp(hp)
                .attack(attack)
                .defense(defense)
                .specialAttack(specialAttack)
                .specialDefense(specialDefense)
                .speed(speed)
                .build();
    }
}
