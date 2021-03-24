import {gql} from 'apollo-server'
import {isAuthenticated} from '../auth';
import List from '../database_models/List'
import User from '../database_models/User';

export const typeDefs = gql`
  extend type Query {
    lists: [List]
  }
  extend type Mutation {
    createList(title: String!): CreateListMutationResponse!
    deleteList(listId: ID!): DeleteListMutationResponse!
    addListItem(listId: ID!, title: String!, url: String!): AddListItemMutationResponse!
    deleteListItem(listId: ID!, listItemId: ID!): DeleteListItemMutationResponse!
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
      const allList = await List.find({userId: user._id}).populate("user");
      return allList;
    })
  },
  Mutation: {
    createList: isAuthenticated(async (_, {title}, {user}) => {
      const list = await List.findOne({title});
      if (list) {
        return {
          code: "404",
          success: false,
          message: "duplicate list name",
        }
      }
      const newList = await List.create({
        title,
        userId: user
      });
      return {
        code: "201",
        success: true,
        message: "new list created",
        list: newList
      };
    }),
    deleteList: async (_, {listId}) => {
      await List.findByIdAndDelete(listId);
      return {
        code: "202",
        success: true,
        message: "list deleted successfully"
      }
    },
    addListItem: async (_, {listId, title, url}) => {
      const list = await List.findByIdAndUpdate(listId, {
        $push: {
          listItems: {
            title, url
          }
        }
      }, {new: true});
      const newListItem = list.listItems[list.listItems.length - 1];
      return {
        code: "201",
        success: true,
        message: "new listItem created",
        list: list,
        listItem: newListItem
      }
    },
    deleteListItem: async (_, {listId, listItemId}) => {
      const list = await List.findByIdAndUpdate(listId, {
        $pull: {
          listItems: {
            _id: listItemId
          }
        }
      }, {new: true});
      if (!list) {
        return {
          code: "404",
          success: false,
          message: "No list with the given listId"
        }
      }
      return {
        code: "202",
        success: true,
        message: "listitem delted successfully",
        list
      };
    }
  },
  List: {
    user: async (list) => {
      const user = await User.findById(list.userId).lean().exec();
      return user;
    }
  }
}
