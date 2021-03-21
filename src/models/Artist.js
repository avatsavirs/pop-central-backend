import {gql} from 'apollo-server';

export const typeDefs = gql`

  extend type Query {
    artist(artistId: ID!): Artist
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
  }

  type ArtistCredit {
    movie: Movie
    role: String
  }

  enum Gender {
    MALE
    FEMALE
  }


`;

export const resolvers = {
  Query: {
    artist: async (_, {artistId}, {dataSources}) => {
      return dataSources.movieAPI.getArtistById(artistId);
    }
  },
  Artist: {
    department: (artist) => {
      return artist.known_for_department;
    },
    credits: (artist, _, {dataSources}) => {
      if (artist.credits) return artist.credits;
      return dataSources.movieAPI.getArtistCredits(artist.id);
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
      return `https://image.tmdb.org/t/p/${imgSize}${artist.profile_path}`
    }
  },
  ArtistCredit: {
    movie: (artistCredit) => {
      return artistCredit;
    },
    role: (artistCredit) => {
      return artistCredit.character || artistCredit.job
    }
  },
}
