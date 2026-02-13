package com.pokemon.demo.poke_api.graphql.service;

import com.pokemon.demo.poke_api.domain.Pokemon;
import com.pokemon.demo.poke_api.graphql.model.PokemonFilter;
import com.pokemon.demo.poke_api.graphql.model.PokemonSort;
import com.pokemon.demo.poke_api.graphql.model.PokemonSortField;
import com.pokemon.demo.poke_api.graphql.model.SortDirection;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
public class PokemonGraphqlService {

    private static final int DEFAULT_LIMIT = 30;
    private static final int MAX_LIMIT = 100;

    public List<Pokemon> applyQuery(
            List<Pokemon> base,
            PokemonFilter filter,
            PokemonSort sort,
            Integer limit,
            Integer offset
    ) {
        List<Pokemon> filtered = applyFilter(base, filter);
        List<Pokemon> sorted = applySort(filtered, sort);
        return paginate(sorted, limit, offset);
    }

    private List<Pokemon> applyFilter(List<Pokemon> list, PokemonFilter filter) {
        if (filter == null) return list;

        List<Pokemon> result = new ArrayList<>(list);

        if (filter.getName() != null && !filter.getName().isBlank()) {
            String q = filter.getName().toLowerCase(Locale.ROOT);
            result.removeIf(p ->
                    p.getName() == null || !p.getName().toLowerCase(Locale.ROOT).contains(q)
            );
        }

        if (filter.getType() != null && !filter.getType().isBlank()) {
            String q = filter.getType().toLowerCase(Locale.ROOT);
            result.removeIf(p ->
                    p.getTypes() == null || p.getTypes().stream()
                            .map(t -> t == null ? "" : t.toLowerCase(Locale.ROOT))
                            .noneMatch(t -> t.contains(q))
            );
        }

        if (filter.getTypesAll() != null && !filter.getTypesAll().isEmpty()) {
            List<String> required = filter.getTypesAll().stream()
                    .filter(s -> s != null && !s.isBlank())
                    .map(s -> s.toLowerCase(Locale.ROOT))
                    .toList();

            if (!required.isEmpty()) {
                result.removeIf(p -> !hasAllTypes(p, required));
            }
        }

        if (filter.getTypesAny() != null && !filter.getTypesAny().isEmpty()) {
            List<String> any = filter.getTypesAny().stream()
                    .filter(s -> s != null && !s.isBlank())
                    .map(s -> s.toLowerCase(Locale.ROOT))
                    .toList();

            if (!any.isEmpty()) {
                result.removeIf(p -> !hasAnyType(p, any));
            }
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
}
