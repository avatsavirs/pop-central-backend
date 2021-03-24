# Pop Central

## Summary
Pop Central is a pop culture hub where users can view, review and rate movies, music, podcasts etc.
This is a graphQL API which acts a a middle layer between various REST services for data aggregation as well as a Mongo database for managing user information.

## TechStack
- Node.js
- Apollo Server
- MongoDB

## Instructions
```bash
  git clone git@github.com:avatsavirs/pop-central-backend.git
  cd pop-central-backend
  npm install
  npm run dev
```

## Schema

type Query {
  _empty: String
  movie(movieId: ID!): Movie
  popularMovies: [Movie]
  lists: [List]
  me: User!
  search(query: String!): [SearchResult]
  tv(tvId: ID!): TV
  popularTv: [TV]
  artist(artistId: ID!): Artist
}

type Mutation {
  _empty: String
  createList(title: String!): CreateListMutationResponse!
  deleteList(listId: ID!): DeleteListMutationResponse!
  addListItem(
    listId: ID!
    title: String!
    url: String!
    externalId: String!
    category: String!
  ): AddListItemMutationResponse!
  deleteListItem(listId: ID!, listItemId: ID!): DeleteListItemMutationResponse!
}

interface MutationResponse {
  code: String!
  success: Boolean!
  message: String!
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
  languages: [String]
  budget: Float
  revenue: Float
  runtime: Int
  website: String
  credits: [MovieCredit]
  directors: [Artist]
  productionCompanies: [String]
  related: [Movie]
}

type MovieCredit {
  artist: Artist
  role: String
}

enum ImgSize {
  # w92
  XXSM

  # w154
  XSM

  # w185
  SM

  # w342
  M

  # w500
  L

  # w780
  XL

  # 1280
  XXL

  # original
  O
}

type List {
  id: ID
  title: String
  listItems: [ListItem!]
  user: User!
}

type ListItem {
  id: ID!
  title: String!
  url: String!
  category: String!
  externalId: String!
}

type CreateListMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
  list: List
}

type AddListItemMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
  list: List
  listItem: ListItem
}

type DeleteListMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
}

type DeleteListItemMutationResponse implements MutationResponse {
  code: String!
  success: Boolean!
  message: String!
  list: List
}

type User {
  id: String!
  name: String
  email: String
  image: String
  lists: [List!]
}

union SearchResult = Artist | Movie | TV

type TV {
  id: ID
  title: String
  creadedBy: [Artist]
  firstAirDate: String
  genres: [String]
  website: String
  inProduction: Boolean
  languages: [String]
  networks: [String]
  overview: String
  poster(imgSize: ImgSize!): String
  backdropImage(imgSize: ImgSize!): String
  productionCompanies: [String]
  seasons: [Season]
  tagline: String
  rating: Float
  voteCount: Int
  related: [TV]
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
