# Pop Central

## Summary
Pop Central is a pop culture hub where users can view, review and rate movies, music, podcasts etc.
This is a graphQL API which acts a a middle layer between various REST services for data aggregation as well as a Mongo database for managing user information.

## TechStack
Node.js
Apollo Server
MongoDB

## Instructions
```bash
  git clone git@github.com:avatsavirs/pop-central-backend.git
  cd pop-central-backend
  npm install
  npm run dev
```

## Schema

```graphQL
  type Query {
    _empty: String
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
```
