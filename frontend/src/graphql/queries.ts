import { gql } from "graphql-request";


export const CREATE_CATEGORY = gql`
  mutation createCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`;

export const GET_CATEGORIES = gql` 
  query getCategories {
    getCategories {
      id
      name
    }
  }
`
export const GET_REPORTS = gql` 
  query getReportSales {
    getReportSales
  }
`

export const GET_PRODUCT = gql`
  query getProduct($id: String!) {
    getProduct(id: $id) {
      id
      name
      stock
      price
      image
      category
    }
  }
`;

export const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      name
      id
      price
      stock
      image
      category
    }
  }
`;

export const GET_USER = gql`
  query getUser {
    getUser {
      id
      name
      secondName
      surname
      secondSurname
      address
      email
      role
      expenses {
        expense
        createAt
      }
    }
  }
`;
