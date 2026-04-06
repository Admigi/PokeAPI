export const GET_ALL_POKEMONS = `
  query GetPokemons($filter: PokemonFilter, $sort: PokemonSort, $limit: Int, $offset: Int) {
    pokemons(filter: $filter, sort: $sort, limit: $limit, offset: $offset) {
      total
      items {
        id
        name
        types
        imageUrl
        stats {
          hp
          attack
          defense
          specialAttack
          specialDefense
          speed
        }
      }
    }
  }
`;

export const GET_STAT_MAX = `
  query {
    maxStats {
      hp
      attack
      defense
      specialAttack
      specialDefense
      speed
    }
  }
`;

export const GET_POKEMON_BY_ID = `
  query GetPokemon($id: Int!) {
    pokemon(id: $id) {
      id
      name
      types
      imageUrl
      stats {
        hp
        attack
        defense
        specialAttack
        specialDefense
        speed
      }
    }
  }
`;
