import {ApolloError} from 'apollo-server'
import {gql} from 'apollo-server';

export const typeDefs = gql`

  extend type Query {
    person(personId: ID!): Person
    popularPersons: [Person!]
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
    mediaType: String!
  }

  type PersonCredit {
    project: Project
    roles: [String]
  }

  enum Gender {
    MALE
    FEMALE
  }

  union Project = Movie | TV
`;

export const resolvers = {
  Query: {
    person: async (_, {personId}, {dataSources}) => {
      return dataSources.personAPI.getPersonById(personId);
    },
    popularPersons: async (_, __, {dataSources}) => {
      return dataSources.personAPI.getPopular();
    }
  },
  Person: {
    department: (person) => {
      return person.known_for_department;
    },
    credits: (person, _, {dataSources}) => {
      if (person.credits) return person.credits;
      return dataSources.personAPI.getPersonCredits(person);
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
      if (!person.profile_path) return null;
      return `https://image.tmdb.org/t/p/${imgSize}${person.profile_path}`
    },
    birthday: (person, _, {dataSources}) => {
      return dataSources.personAPI.getBirthday(person);
    },
    deathday: (person, _, {dataSources}) => {
      return dataSources.personAPI.getDeathDay(person);
    },
    bornIn: (person, _, {dataSources}) => {
      return dataSources.personAPI.getBornIn(person);
    },
    biography: (person, _, {dataSources}) => {
      return dataSources.personAPI.getBio(person);
    },
    mediaType: () => "person"
  },
  PersonCredit: {
    project: (personCredit) => {
      return personCredit;
    },
    roles: (personCredit) => {
      const roles = personCredit.jobs || [personCredit.character];
      return roles;
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
          throw new ApolloError(`Unhandled project type: ${project.media_type} for ${project.id}`);
      }
    }
  }
}
