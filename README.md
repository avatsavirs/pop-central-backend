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

```graphQL
type Query {
  _empty: String
  search(query: String!): [SearchResult]
  movie(movieId: ID!): Movie
  person(personId: ID!): Person
  lists: [List]
}

type Mutation {
  _empty: String
  createList(title: String!): CreateListMutationResponse!
  deleteList(listId: ID!): DeleteListMutationResponse!
  addListItem(
    listId: ID!
    title: String!
    url: String!
  ): AddListItemMutationResponse!
  deleteListItem(listId: ID!, listItemId: ID!): DeleteListItemMutationResponse!
}

interface MutationResponse {
  code: String!
  success: Boolean!
  message: String!
}

type SearchResult {
  id: ID!
  name: String!
  release_date: String
  poster_url(imgSize: ImgSize!): String
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
  poster_url(imgSize: ImgSize!): String
  backdrop_url(imgSize: ImgSize!): String
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
  profile_pic_url(imgSize: ImgSize!): String
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

enum ImgSize {
  XXSM
  XSM
  SM
  M
  L
  XL
  XXL
  O
}

type List {
  id: ID
  title: String
  listItems: [ListItem!]
}

type ListItem {
  id: ID!
  title: String!
  url: String!
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
```
