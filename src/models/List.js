import {ApolloError, AuthenticationError, gql} from 'apollo-server'
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
    addListItem(listId: ID!, title: String!, url: String!, externalId: String!, category: String!): AddListItemMutationResponse!
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
      const allList = await List.find({userId: user._id}).populate("user");
      return allList;
    })
  },
  Mutation: {
    createList: isAuthenticated(async (_, {title}, {user}) => {
      const list = await List.findOne({title}).lean().exec();
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
    deleteList: isAuthenticated(async (_, {listId}, {user}) => {
      const list = await List.findById(listId);
      if (!list) throw new ApolloError("List Not Found")
      if (list.userId.toString() !== user._id.toString()) {
        throw new AuthenticationError(`This list doesn't belong to you`);
      }
      await List.findByIdAndDelete(listId);
      return {
        code: "202",
        success: true,
        message: "list deleted successfully"
      }
    }),
    addListItem: isAuthenticated(async (_, {listId, title, url, category, externalId}, {user}) => {
      const list = await List.findById(listId);
      if (!list) throw new ApolloError("List Not Found");
      if (list.userId.toString() !== user._id.toString()) {
        throw new AuthenticationError(`This list doesn't belong to you`);
      }
      const updatedList = await List.findByIdAndUpdate(listId, {
        $push: {
          listItems: {
            title, url, category, externalId
          }
        }
      }, {new: true});
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
      const list = await List.findById(listId);
      if (!list) {
        throw new ApolloError("List Not Found")
      }
      if (list.userId.toString() !== user._id.toString()) {
        throw new AuthenticationError(`This list doesn't belong to you`);
      }
      const updatedList = await List.findByIdAndUpdate(listId, {
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
        list: updatedList
      };
    })
  },
  List: {
    user: async (list) => {
      const user = await User.findById(list.userId).lean().exec();
      return user;
    }
  }
}
