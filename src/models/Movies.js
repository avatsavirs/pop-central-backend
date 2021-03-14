import {gql} from 'apollo-server';

const typeDefs = gql`
  extend type Query {
    search(query: String!): [SearchResult]
    movie(movieId: ID!): Movie
    person(personId: ID!): Person
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
    tagline: String
    overview: String
    genres: [Genere]
    release_date: String
    release_status: String
    poster_url: String
    backdrop_url: String
    rating: Float
    vote_count: Int
    language: String
    budget: Int
    revenue: Int
    runtime: Int
    website: String
    credits: [MovieCredit]
    directors: [Person]
  }
  type Person {
    id: ID
    gender: Gender
    credits: [PersonCredit]
    department: String
    name: String
    profile_path: String
    birthday: String
    deathday: String
    place_of_birth: String
    biography: String
  }
  type Genere {
    id: ID!
    name: String!
  }
  type MovieCredit {
    person: Person
    role: String
  }
  type PersonCredit {
    movie: Movie
    role: String
  }
  enum Gender {
    MALE
    FEMALE
  }
`;

const resolvers = {
  Query: {
    search: async (_, {query}, {dataSources}) => {
      return dataSources.movieAPI.searchByName(query);
    },
    movie: async (_, {movieId}, {dataSources}) => {
      return dataSources.movieAPI.getMovieById(movieId);
    },
    person: async (_, {personId}, {dataSources}) => {
      return dataSources.movieAPI.getPersonById(personId);
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
  },
  Movie: {
    title: (movie) => {
      return movie.title || movie.name
    },
    release_status: (movie) => {
      return movie.status
    },
    poster_url: (movie) => {
      return "https://image.tmdb.org/t/p/w500" + movie.poster_path
    },
    backdrop_url: (movie) => {
      return "https://image.tmdb.org/t/p/w500" + movie.backdrop_path
    },
    rating: (movie) => {
      return movie.vote_average;
    },
    language: (movie) => {
      return movie.original_language
    },
    website: (movie) => {
      return movie.homepage
    },
    credits: async (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getMovieCredits(movie.id);
    },
    directors: async (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getMovieDirectors(movie.id);
    }
  },
  Person: {
    department: (person) => {
      return person.known_for_department;
    },
    credits: (person, _, {dataSources}) => {
      if (person.credits) return person.credits;
      return dataSources.movieAPI.getPersonCredits(person.id);
    },
    gender: (person) => {
      switch (person.gender) {
        case 1:
          return "FEMALE";
        case 2:
          return "MALE";
        default:
          return null;
      }
    }
  },
  MovieCredit: {
    person: (movieCredit) => {
      return movieCredit;
    },
    role: (movieCredit) => {
      return movieCredit.character || movieCredit.job
    }
  },
  PersonCredit: {
    movie: (personCredit) => {
      return personCredit;
    },
    role: (personCredit) => {
      return personCredit.character || personCredit.job
    }
  }
}

export {
  typeDefs,
  resolvers
};
