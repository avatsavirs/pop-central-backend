import {gql} from 'apollo-server';

export const typeDefs = gql`

  extend type Query {
    movie(movieId: ID!): Movie
  }

  type Movie {
    id: ID
    title: String
    tagline: String
    overview: String
    genres: [String]
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
    directors: [Artist]
    productionCompanies: [String]
  }

  type MovieCredit {
    artist: Artist
    role: String
  }

  enum ImgSize {
    "w92"
    XXSM 
    "w154"
    XSM 
    "w185"
    SM 
    "w342"
    M 
    "w500"
    L 
    "w780"
    XL
    "1280"
    XXL
    "original"
    O 
  }

`;

export const resolvers = {
  Query: {
    movie: async (_, {movieId}, {dataSources}) => {
      return dataSources.movieAPI.getMovieById(movieId);
    },
  },
  Movie: {
    title: (movie) => {
      return movie.title || movie.name
    },
    tagline: async (movie, _, {dataSources}) => {
      if (movie.tagline) return movie.tagline;
      const tagline = await dataSources.movieAPI.getMovieTagline(movie);
      return tagline;
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
  MovieCredit: {
    artist: (movieCredit) => {
      return movieCredit;
    },
    role: (movieCredit) => {
      return movieCredit.character || movieCredit.job
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
