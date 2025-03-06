import {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLNonNull,
} from "graphql";
import * as userService from "./user.query.service.js";

export const query = {
    getAllUsers: {
        type: new GraphQLObjectType({
            name: "getAllUsers",
            fields: {
                message: { type: GraphQLString },
                statusCode: { type: GraphQLInt },
                data: {
                    type: new GraphQLList(new GraphQLObjectType({
                        name: "users",
                        fields: {
                            firstName: { type: GraphQLString },
                            lastName: { type: GraphQLString },
                            email: { type: GraphQLString },
                            provider: { type: GraphQLString },
                            gender: { type: GraphQLString },
                            role: { type: GraphQLString },
                            DOB: { type: GraphQLString },
                            isConfirmed: { type: GraphQLBoolean },
                            deletedAt: { type: GraphQLString },
                            bannedAt: { type: GraphQLString },
                        },
                    })),
                },
            },
        }),
        args: {
            authorization: { type: new GraphQLNonNull(GraphQLString) },
        },

        resolve: userService.getAllUsers,
    },

    getAllCompanies: {
        type: new GraphQLObjectType({
            name: "getAllCompanies",
            fields: {
                message: { type: GraphQLString },
                statusCode: { type: GraphQLInt },
                data: {
                    type: new GraphQLList(new GraphQLObjectType({
                        name: "companies",
                        fields: {
                            companyName: { type: GraphQLString },
                            description: { type: GraphQLString },
                            industry: { type: GraphQLString },
                            address: { type: GraphQLString },
                            numberOfEmployees: { type: GraphQLString },
                            companyEmail: { type: GraphQLString },
                            createdBy: { type: GraphQLID },
                            logo: {
                                type: new GraphQLObjectType({
                                    name: "CompanyLogo",
                                    fields: {
                                        secure_url: { type: GraphQLString },
                                        public_id: { type: GraphQLString },
                                    },
                                }),
                            },
                            coverPic: {
                                type: new GraphQLObjectType({
                                    name: "CompanyCoverPic",
                                    fields: {
                                        secure_url: { type: GraphQLString },
                                        public_id: { type: GraphQLString },
                                    },
                                }),
                            },
                            HRs: { type: new GraphQLList(GraphQLID) },
                            bannedAt: { type: GraphQLString },
                            deletedAt: { type: GraphQLString },
                            legalAttachment: {
                                type: new GraphQLObjectType({
                                    name: "CompanyLegalAttachment",
                                    fields: {
                                        secure_url: { type: GraphQLString },
                                        public_id: { type: GraphQLString },
                                    },
                                }),
                            },
                            approvedByAdmin: { type: GraphQLBoolean },
                        },
                    })),
                },
            },
        }),
        args: {
            authorization: { type: new GraphQLNonNull(GraphQLString) },
        },

        resolve: userService.getAllCompanies,
    },
}
