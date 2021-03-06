import {gql} from 'apollo-server';

export const typeDefs = gql`

  extend type Query {
    movie(movieId: ID!): Movie
    popularMovies: [Movie]
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
    backdropImage: String
    rating: Float
    voteCount: Int
    languages: [String]
    budget: Float
    revenue: Float
    runtime: Int
    website: String
    credits: [MovieCredit]
    directors: [Person]
    productionCompanies: [String]
    related: [Movie]
    mediaType: String!
  }

  type MovieCredit {
    person: Person
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
    popularMovies: (_, __, {dataSources}) => {
      return dataSources.movieAPI.getPopular();
    }
  },
  Movie: {
    title: (movie) => {
      return movie.title
    },
    tagline: async (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getTagline(movie);
    },
    poster: (movie, {imgSize}) => {
      if (!movie.poster_path) return null;
      return `https://image.tmdb.org/t/p/${imgSize}${movie.poster_path}`
    },
    backdropImage: (movie) => {
      if (!movie.backdrop_path) return null;
      return `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}`
    },
    rating: (movie) => {
      return movie.vote_average;
    },
    languages: (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getLanguages(movie);
    },
    website: (movie) => {
      return movie.homepage
    },
    credits: async (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getCredits(movie.id);
    },
    directors: async (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getDirectors(movie);
    },
    genres: async (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getGenres(movie);
    },
    releaseDate: (movie) => movie.release_date,
    releaseStatus: async (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getReleaseStatus(movie);
    },
    voteCount: (movie) => movie.vote_count,
    budget: (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getBudget(movie);
    },
    revenue: (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getRevenue(movie);
    },
    runtime: (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getRunTime(movie);
    },
    website: (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getWebsite(movie);
    },
    productionCompanies: (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getProductionCompanies(movie);
    },
    related: (movie, _, {dataSources}) => {
      return dataSources.movieAPI.getRelatedMovies(movie);
    },
    mediaType: () => "movie"
  },
  MovieCredit: {
    person: (movieCredit) => {
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
