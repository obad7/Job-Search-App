import { GraphQLObjectType, GraphQLSchema } from "graphql";
import * as userController from "./User/graphql/user.graph.controller.js";

export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        description: "Main Application Query",
        fields: {
            ...userController.query,
        },
    }),
});
