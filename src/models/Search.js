import {ApolloError, gql} from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    search(query: String!): [SearchResult]
    searchMovie(query: String!): [Movie]
    searchTv(query: String!): [TV]
    searchPerson(query: String!): [Person]
  }
  union SearchResult = Person | Movie | TV
`;

export const resolvers = {
  Query: {
    search: async (_, {query}, {dataSources}) => {
      return dataSources.searchAPI.searchAll(query);
    },
    searchMovie: async (_, {query}, {dataSources}) => {
      return dataSources.searchAPI.searchMovies(query);
    },
    searchTv: async (_, {query}, {dataSources}) => {
      return dataSources.searchAPI.searchTv(query);
    },
    searchPerson: async (_, {query}, {dataSources}) => {
      return dataSources.searchAPI.searchPerson(query);
    }
  },
  SearchResult: {
    __resolveType: (searchResult) => {
      switch (searchResult.media_type) {
        case 'person':
          return "Person";
        case 'movie':
          return 'Movie';
        case 'tv':
          return 'TV'
        default:
          throw new ApolloError(`Unhandled searchResult type: ${searchResult.media_type}`);
      }
    }
  }
}

