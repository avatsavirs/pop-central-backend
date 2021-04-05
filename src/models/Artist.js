import {gql} from 'apollo-server';

export const typeDefs = gql`

  extend type Query {
    artist(artistId: ID!): Artist
    popularArtists: [Artist!]
  }

  type Artist {
    id: ID
    gender: Gender
    credits: [ArtistCredit]
    department: String
    name: String
    photo(imgSize: ImgSize!): String
    birthday: String
    deathday: String
    bornIn: String
    biography: String
    mediaType: String!
  }

  type ArtistCredit {
    project: Project
    role: String
  }

  enum Gender {
    MALE
    FEMALE
  }

  union Project = Movie | TV
`;

export const resolvers = {
  Query: {
    artist: async (_, {artistId}, {dataSources}) => {
      return dataSources.artistAPI.getArtistById(artistId);
    },
    popularArtists: async (_, __, {dataSources}) => {
      return dataSources.artistAPI.getPopular();
    }
  },
  Artist: {
    department: (artist) => {
      return artist.known_for_department;
    },
    credits: (artist, _, {dataSources}) => {
      if (artist.credits) return artist.credits;
      return dataSources.artistAPI.getArtistCredits(artist);
    },
    gender: (artist) => {
      switch (artist.gender) {
        case 1:
          return "FEMALE";
        case 2:
          return "MALE";
        default:
          return null;
      }
    },
    photo: (artist, {imgSize}) => {
      if (!artist.profile_path) return null;
      return `https://image.tmdb.org/t/p/${imgSize}${artist.profile_path}`
    },
    birthday: (artist, _, {dataSources}) => {
      return dataSources.artistAPI.getBirthday(artist);
    },
    deathday: (artist, _, {dataSources}) => {
      return dataSources.artistAPI.getDeathDay(artist);
    },
    bornIn: (artist, _, {dataSources}) => {
      return dataSources.artistAPI.getBornIn(artist);
    },
    biography: (artist, _, {dataSources}) => {
      return dataSources.artistAPI.getBio(artist);
    },
    mediaType: () => "artist"
  },
  ArtistCredit: {
    project: (artistCredit) => {
      return artistCredit;
    },
    role: (artistCredit) => {
      return artistCredit.character || artistCredit.job
    }
  },
  Project: {
    __resolveType: (project) => {
      switch (project.media_type) {
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
