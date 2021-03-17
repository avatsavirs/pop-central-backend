import {MockList} from 'apollo-server'

const mocks = {
  Query: () => ({
    search: () => new MockList([2, 5]),
    user: (_, {email}) => ({
      displayName: "Kartik",
      email: email,
      list: MockList([5, 7])
    })
  }),
  SearchResult: (_, {query}) => ({
    name: () => query,
    releaseDate: () => '17/02/1998',
    releaseStatus: () => 'released',
    image: () => 'www.google.com',
    mediaType: () => 'movie'
  }),
  List: () => ({
    title: 'myList',
    listItems: MockList([5, 7])
  }),
  ListItem: () => ({
    title: 'Castaway',
    url: '/movie/castaway'
  })
};

export default mocks;
