package com.pokemon.demo.poke_api.graphql.service;

import com.pokemon.demo.poke_api.domain.Pokemon;
import com.pokemon.demo.poke_api.graphql.model.PokemonFilter;
import com.pokemon.demo.poke_api.graphql.model.PokemonSort;
import com.pokemon.demo.poke_api.graphql.model.PokemonSortField;
import com.pokemon.demo.poke_api.graphql.model.SortDirection;
import com.pokemon.demo.poke_api.graphql.model.PokemonPage;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

/**
 * GraphQL-specific query logic for Pokemon.
 *
 * Responsible for applying filtering, sorting and pagination
 * to in-memory Pokemon collections.
 *
 * Keeps the GraphQL resolver thin while leaving the core
 * PokemonService independent from GraphQL concerns.
 */


@Service
public class PokemonGraphqlService {

    private static final int DEFAULT_LIMIT = 30;
    private static final int MAX_LIMIT = 100;

    public PokemonPage applyQuery(
            List<Pokemon> base,
            PokemonFilter filter,
            PokemonSort sort,
            Integer limit,
            Integer offset
    ) {
        List<Pokemon> filtered = applyFilter(base, filter);
        List<Pokemon> sorted = applySort(filtered, sort);
        int total = sorted.size();
        List<Pokemon> paginated = paginate(sorted, limit, offset);
        return new PokemonPage(paginated, total);
    }

    private List<Pokemon> applyFilter(List<Pokemon> list, PokemonFilter filter) {
        if (filter == null) return list;

        List<Pokemon> result = new ArrayList<>(list);

        String nameQuery = normalize(filter.getName());
        String typeQuery = normalize(filter.getType());
        List<String> typesAll = normalizeList(filter.getTypesAll());
        List<String> typesAny = normalizeList(filter.getTypesAny());

        if (nameQuery != null) {
            result.removeIf(p ->
                    p.getName() == null ||
                            !p.getName().toLowerCase(Locale.ROOT).contains(nameQuery)
            );
        }

        if (typeQuery != null) {
            result.removeIf(p ->
                    p.getTypes() == null ||
                            p.getTypes().stream()
                                    .map(t -> t == null ? "" : t.toLowerCase(Locale.ROOT))
                                    .noneMatch(t -> t.contains(typeQuery))
            );
        }

        if (!typesAll.isEmpty()) {
            result.removeIf(p -> !hasAllTypes(p, typesAll));
        }

        if (!typesAny.isEmpty()) {
            result.removeIf(p -> !hasAnyType(p, typesAny));
        }

        if (filter.getId() != null) {
            result.removeIf(p -> !filter.getId().equals(p.getId()));
        }

        return result;
    }


    private boolean hasAllTypes(Pokemon p, List<String> requiredLowered) {
        if (p.getTypes() == null) return false;

        List<String> pokemonTypes = p.getTypes().stream()
                .filter(t -> t != null && !t.isBlank())
                .map(t -> t.toLowerCase(Locale.ROOT))
                .toList();

        return requiredLowered.stream().allMatch(req ->
                pokemonTypes.stream().anyMatch(pt -> pt.equals(req))
        );
    }

    private boolean hasAnyType(Pokemon p, List<String> anyLowered) {
        if (p.getTypes() == null) return false;

        return p.getTypes().stream()
                .filter(t -> t != null && !t.isBlank())
                .map(t -> t.toLowerCase(Locale.ROOT))
                .anyMatch(anyLowered::contains);
    }

    private List<Pokemon> applySort(List<Pokemon> list, PokemonSort sort) {
        Comparator<Pokemon> comparator;

        if (sort == null || sort.getField() == null) {
            comparator = Comparator.comparingInt(Pokemon::getId); // default
        } else {
            comparator = switch (sort.getField()) {
                case ID -> Comparator.comparingInt(Pokemon::getId);

                case NAME -> Comparator.comparing(
                        p -> p.getName() == null ? "" : p.getName().toLowerCase(Locale.ROOT)
                );

                case HP, ATTACK, DEFENSE, SPECIALATTACK, SPECIALDEFENSE, SPEED ->
                        Comparator.comparingInt(p -> statValue(p, sort.getField()));
            };
        }

        comparator = comparator.thenComparingInt(Pokemon::getId);

        if (sort != null && sort.getDirection() == SortDirection.DESC) {
            comparator = comparator.reversed();
        }

        return list.stream().sorted(comparator).toList();
    }

    private int statValue(Pokemon p, PokemonSortField field) {
        if (p.getStats() == null) return Integer.MIN_VALUE;

        return switch (field) {
            case HP -> p.getStats().getHp();
            case ATTACK -> p.getStats().getAttack();
            case DEFENSE -> p.getStats().getDefense();
            case SPECIALATTACK -> p.getStats().getSpecialAttack();
            case SPECIALDEFENSE -> p.getStats().getSpecialDefense();
            case SPEED -> p.getStats().getSpeed();
            default -> Integer.MIN_VALUE;
        };
    }

    private List<Pokemon> paginate(List<Pokemon> list, Integer limit, Integer offset) {
        int safeOffset = (offset == null) ? 0 : Math.max(0, offset);

        int safeLimit = (limit == null) ? DEFAULT_LIMIT : Math.max(0, limit);
        safeLimit = Math.min(safeLimit, MAX_LIMIT);

        if (safeOffset >= list.size()) return List.of();

        int toIndex = Math.min(list.size(), safeOffset + safeLimit);
        return list.subList(safeOffset, toIndex);
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.toLowerCase(Locale.ROOT);
    }

    private List<String> normalizeList(List<String> values) {
        if (values == null) {
            return List.of();
        }

        return values.stream()
                .filter(v -> v != null && !v.isBlank())
                .map(v -> v.toLowerCase(Locale.ROOT))
                .toList();
    }

}
