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
    releaseDate: String
    image(imgSize: ImgSize!): String
    mediaType: String!
  }
  type Movie {
    id: ID
    title: String
    tagline: String
    overview: String
    genres: [Genere]
    releaseDate: String
    releaseStatus: String
    poster(imgSize: ImgSize!): String
    backdropImage(imgSize: ImgSize!): String
    rating: Float
    voteCount: Int
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
    photo(imgSize: ImgSize!): String
    birthday: String
    deathday: String
    bornIn: String
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
  enum ImgSize {
    XXSM #w92
    XSM #w154
    SM #w185
    M #w342
    L #w500
    XL #w780
    XXL #1280
    O #original
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
    image: (result, {imgSize}) => {
      switch (result.media_type) {
        case 'movie':
        case 'tv':
          return `https://image.tmdb.org/t/p/${imgSize}${result.poster_path}`
        case 'person':
          return `https://image.tmdb.org/t/p/${imgSize}${result.profile_path}`
      }
    },
    mediaType: (result) => {
      return result.media_type;
    },
    releaseDate: (result) => {
      return result.release_date
    }
  },
  Movie: {
    title: (movie) => {
      return movie.title || movie.name
    },
    releaseStatus: (movie) => {
      return movie.status
    },
    poster: (movie, {imgSize}) => {
      return `https://image.tmdb.org/t/p/${imgSize}${movie.poster_path}`
    },
    backdropImage: (movie, {imgSize}) => {
      return `https://image.tmdb.org/t/p/${imgSize}${movie.backdrop_path}`
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
    },
    photo: (person, {imgSize}) => {
      return `https://image.tmdb.org/t/p/${imgSize}${person.profile_path}`
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
  },
  ImgSize: {
    XXSM: 'w92',
    XSM: 'w154',
    SM: 'w185',
    M: 'w342',
    L: 'w500',
    XL: 'w780',
    XXL: 'w1280',
    O: 'original'
  }
}

export {
  typeDefs,
  resolvers
};
