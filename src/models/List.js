import {gql} from 'apollo-server'
import {isAuthenticated} from '../auth';
import User from '../database_models/User';

export const typeDefs = gql`
  extend type Query {
    lists: [List]
  }
  extend type Mutation {
    createList(title: String!): CreateListMutationResponse!
    deleteList(listId: ID!): DeleteListMutationResponse!
    addListItem(input: AddListItemInput!): AddListItemMutationResponse!
    deleteListItem(listId: ID!, listItemId: ID!): DeleteListItemMutationResponse!
  }
  input AddListItemInput {
    listId: ID!
    title: String!
    url: String!
    externalId: String!
    mediaType: String!
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
  type CreateListMutationResponse implements MutationResponse{
    code: String!
    success: Boolean!
    message: String!
    list: List
  }
  type AddListItemMutationResponse implements MutationResponse{
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
`;

export const resolvers = {
  Query: {
    lists: isAuthenticated(async (_, __, {user}) => {
      return user.lists;
    })
  },
  Mutation: {
    createList: isAuthenticated(async (_, {title}, {user}) => {
      const list = user.lists.find(list => list.title === title);
      if (list) {
        return {
          code: "400",
          success: false,
          message: "duplicate list name",
        }
      }
      const updatedUser = await User.findByIdAndUpdate(user._id, {
        $push: {
          lists: {title}
        }
      }, {new: true})
      const newList = updatedUser.lists[updatedUser.lists.length - 1];
      return {
        code: "201",
        success: true,
        message: "new list created",
        list: newList
      };
    }),
    deleteList: isAuthenticated(async (_, {listId}, {user}) => {
      const list = user.lists.find(list => list._id.toString() === listId);
      if (!list) {
        return {
          code: '404',
          success: false,
          message: 'list not found'
        }
      }
      await User.findByIdAndUpdate(user._id, {
        $pull: {
          lists: {
            _id: list._id
          }
        }
      });
      return {
        code: "202",
        success: true,
        message: "list deleted successfully"
      }
    }),
    addListItem: isAuthenticated(async (_, {input}, {user}) => {
      const {listId, title, url, category, externalId} = input;
      const list = user.lists.find(list => list._id.toString() === listId);
      if (!list) {
        return {
          code: '404',
          success: false,
          message: 'list not found'
        }
      }
      const updatedUser = await User.findOneAndUpdate({
        _id: user._id,
        'lists._id': listId
      }, {
        $push: {
          'lists.$.listItems': {title, url, category, externalId}
        }
      }, {new: true});
      const updatedList = updatedUser.lists.find(list => list._id.toString() === listId);
      const newListItem = updatedList.listItems[updatedList.listItems.length - 1];
      return {
        code: "201",
        success: true,
        message: "new listItem created",
        list: updatedList,
        listItem: newListItem
      }
    }),
    deleteListItem: isAuthenticated(async (_, {listId, listItemId}, {user}) => {
      const list = user.lists.find(list => list._id.toString() === listId);
      if (!list) {
        return {
          code: '404',
          success: false,
          message: 'list not found'
        }
      }
      const listItem = list.listItems.find(listItem => listItem._id.toString() === listItemId);
      if (!listItem) {
        return {
          code: '404',
          success: false,
          message: 'listItem not found'
        }
      }
      const updatedUser = await User.findOneAndUpdate({
        _id: user._id,
        'lists._id': listId
      }, {
        $pull: {
          'lists.$.listItems': {_id: listItemId}
        }
      }, {new: true});
      const updatedList = updatedUser.lists.find(list => list._id.toString() === listId);
      return {
        code: "202",
        success: true,
        message: "listitem delted successfully",
        list: updatedList
      };
    })
  },
  List: {
    id: (list) => list._id,
    user: async (_, __, {user}) => {
      return user;
    }
  },
  ListItem: {
    id: (list) => list._id
  }
}
