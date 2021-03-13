import {gql} from 'apollo-server';

const typeDefs = gql`
  extend type Query {
    search(query: String): [SearchResult]
  }
  type SearchResult {
    id: ID!
    name: String!
    release_date: String
    poster_url: String
    media_type: String!
  }
  type Movie {
    id: ID
    title: String
    overview: String
    genere: [Int]
    media_type: String
    release_date: String
    poster: String
    rating: Float
    vote_count: Int
    language: String
  }
`;

const resolvers = {
  Query: {
    search: async (_, {query}, {dataSources}) => {
      return dataSources.movieAPI.searchByName(query);
    }
  },
  SearchResult: {
    name: (result) => {
      switch (result.media_type) {
        case 'movie':
          return result.title
        case 'tv':
        case 'person':
          return result.name
      }
    },
    poster_url: (result) => {
      switch (result.media_type) {
        case 'movie':
        case 'tv':
          return result.poster_path
        case 'person':
          return result.profile_path
      }
    }
  }
}

export {
  typeDefs,
  resolvers
};
