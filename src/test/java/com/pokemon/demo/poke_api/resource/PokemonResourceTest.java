package com.pokemon.demo.poke_api.resource;

import com.pokemon.demo.poke_api.exception.GlobalExceptionHandler;
import com.pokemon.demo.poke_api.exception.PokemonNotFoundException;
import com.pokemon.demo.poke_api.service.PokemonService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PokemonResource.class)
@Import(GlobalExceptionHandler.class) // ensures your @RestControllerAdvice is active in this slice test
class PokemonResourceTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    PokemonService pokemonService;

    @Test
    void getAll_returns200_andJsonArray() throws Exception {
        when(pokemonService.getAllPokemon()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/pokemon"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());

        verify(pokemonService).getAllPokemon();
    }

    @Test
    void getById_notFound_returns404_withApiErrorBody() throws Exception {
        int id = 9999;
        when(pokemonService.findById(id)).thenThrow(new PokemonNotFoundException(id));

        mockMvc.perform(get("/api/v1/pokemon/{id}", id))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(jsonPath("$.path").value("/api/v1/pokemon/" + id));

        verify(pokemonService).findById(id);
    }

    @Test
    void getById_idIsZero_returns400_andDoesNotCallService() throws Exception {
        mockMvc.perform(get("/api/v1/pokemon/{id}", 0))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.path").value("/api/v1/pokemon/0"));

        verifyNoInteractions(pokemonService);
    }

    @Test
    void getById_idIsNotANumber_returns400() throws Exception {
        mockMvc.perform(get("/api/v1/pokemon/abc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(jsonPath("$.path").value("/api/v1/pokemon/abc"));

        verifyNoInteractions(pokemonService);
    }

    @Test
    void getByName_valid_returns200() throws Exception {
        when(pokemonService.findByName("pikachu")).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/pokemon").param("name", "pikachu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        verify(pokemonService).findByName("pikachu");
    }

    @Test
    void getByName_blank_returns400_andDoesNotCallService() throws Exception {
        mockMvc.perform(get("/api/v1/pokemon").param("name", ""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.path").value("/api/v1/pokemon"));

        verifyNoInteractions(pokemonService);
    }

    @Test
    void getByType_valid_returns200() throws Exception {
        when(pokemonService.findByType("fire")).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/pokemon").param("type", "fire"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        verify(pokemonService).findByType("fire");
    }

    @Test
    void getByType_blank_returns400_andDoesNotCallService() throws Exception {
        mockMvc.perform(get("/api/v1/pokemon").param("type", ""))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.path").value("/api/v1/pokemon"));

        verifyNoInteractions(pokemonService);
    }
}

