import {ApolloError, gql} from 'apollo-server';

export const typeDefs = gql`
  extend type Query {
    search(query: String!): [SearchResult]
  }
  union SearchResult = Person | Movie | TV
`;

export const resolvers = {
  Query: {
    search: async (_, {query}, {dataSources}) => {
      return dataSources.searchAPI.searchByName(query);
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

