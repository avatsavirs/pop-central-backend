import {gql} from 'apollo-server';

export const typeDefs = gql`

  extend type Query {
    tv(tvId: ID!): TV
    popularTv: [TV]
  }

  type TV {
    id: ID
    title: String
    creadedBy: [Person]
    firstAirDate: String
    genres: [String]
    website: String
    inProduction: Boolean
    languages: [String]
    networks: [String]
    overview: String
    poster(imgSize: ImgSize!): String
    backdropImage: String
    productionCompanies: [String]
    seasons: [Season]
    tagline: String
    rating: Float
    voteCount: Int
    related: [TV]
    mediaType: String!
    credits: [TvCredit]
  }

  type Season {
    airDate: String
    episodes: [Episode]
    seasonNumber: Int
    overview: String
    poster(imgSize: ImgSize!): String
  }

  type Episode {
    name: String
    airDate: String
    episodeNumber: Int
    overview: String
  }

  type TvCredit {
    person: Person
    role: String
  }
`;

export const resolvers = {
  Query: {
    tv: async (_, {tvId}, {dataSources}) => {
      return dataSources.tvAPI.getTvById(tvId);
    },
    popularTv: (_, __, {dataSources}) => {
      return dataSources.tvAPI.getPopular();
    }
  },
  TV: {
    title: (tv) => tv.name,
    creadedBy: (tv, _, {dataSources}) => {
      return dataSources.tvAPI.getCreatedBy(tv);
    },
    firstAirDate: (tv) => {
      return tv.first_air_date;
    },
    genres: (tv, _, {dataSources}) => {
      return dataSources.tvAPI.getGenres(tv);
    },
    website: (tv, _, {dataSources}) => {
      return dataSources.tvAPI.getWebsite(tv);
    },
    inProduction: (tv, _, {dataSources}) => {
      return dataSources.tvAPI.getIsInProduction(tv);
    },
    languages: (tv, _, {dataSources}) => {
      return dataSources.tvAPI.getLanguages(tv);
    },
    networks: (tv, _, {dataSources}) => {
      return dataSources.tvAPI.getNetworks(tv);
    },
    poster: (tv, {imgSize}) => {
      if (!tv.poster_path) return null;
      return `https://image.tmdb.org/t/p/${imgSize}${tv.poster_path}`
    },
    backdropImage: (tv) => {
      if (!tv.backdrop_path) return null;
      return `https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${tv.backdrop_path}`
    },
    productionCompanies: (tv, _, {dataSources}) => {
      return dataSources.tvAPI.getProductionCompanies(tv);
    },
    tagline: (tv, _, {dataSources}) => {
      return dataSources.tvAPI.getTagline(tv);
    },
    rating: (tv) => {
      return tv.vote_average;
    },
    voteCount: (tv) => {
      return tv.vote_count;
    },
    seasons: async (tv, _, {dataSources}) => {
      return (await dataSources.tvAPI.getSeasons(tv)).map(season => ({...season, tvId: tv.id}));
    },
    related: async (tv, _, {dataSources}) => {
      return dataSources.tvAPI.getRelated(tv);
    },
    credits: async (tv, _, {dataSources}) => {
      const result = await dataSources.tvAPI.getCredits(tv.id);
      return result;
    },
    mediaType: () => "tv"
  },
  Season: {
    airDate: (season) => {
      return season.air_date;
    },
    seasonNumber: (season) => {
      return season.season_number;
    },
    poster: (season, {imgSize}) => {
      return `https://image.tmdb.org/t/p/${imgSize}${season.poster_path}`
    },
    episodes: (season, _, {dataSources}) => {
      return dataSources.tvAPI.getEpisodes(season.tvId, season.season_number);
    }
  },
  Episode: {
    airDate: (episode) => episode.air_date,
    episodeNumber: (episode) => episode.episode_number
  },
  TvCredit: {
    person: (movieCredit) => {
      return movieCredit;
    },
    role: (movieCredit) => {
      return movieCredit.character || movieCredit.job
    }
  }
}
