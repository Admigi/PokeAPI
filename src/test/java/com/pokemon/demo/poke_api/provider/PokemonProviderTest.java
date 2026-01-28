package com.pokemon.demo.poke_api.provider;

import com.pokemon.demo.poke_api.domain.Pokemon;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PokemonProviderTest {

    @Autowired
    PokemonProvider provider;

    @Test
    void loadsPokemonJson_fromClasspath() {
        List<Pokemon> all = provider.findAll();

        assertNotNull(all);
        assertFalse(all.isEmpty(), "pokemon.json should not be empty");
        assertNotNull(all.get(0).getName(), "First pokemon should have a name");
    }

    @Test
    void findAll_returnsSameCachedListInstance() {
        List<Pokemon> first = provider.findAll();
        List<Pokemon> second = provider.findAll();

        assertSame(first, second);
    }

    @Test
    void findAll_returnsUnmodifiableList() {
        List<Pokemon> all = provider.findAll();

        assertThrows(UnsupportedOperationException.class, () -> all.add(null));
    }
}
