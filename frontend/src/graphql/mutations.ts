import { gql } from "graphql-request";

export const SIGNIN = gql`
  mutation signin($credentials: InputSignInCredentials!) {
    signin(credentials: $credentials)
  }
`;

export const CREATE_CATEGORY = gql`
  mutation createCategory($name: String!) {
    createCategory(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($user: InputUpdateUser!) {
    updateUser(user: $user) {
      id
      name
      secondName
      surname
      secondSurname
      address
      role
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation createProduct($product: InputCreateProduct!, $image: Upload!) {
    createProduct(product: $product, image: $image) {
      id
      name
      price
      stock
      image
      category
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProduct($product: InputUpdateProduct!, $image: Upload) {
    updateProduct(product: $product, image: $image) {
      id
      name
      price
      stock
      image
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

export const SIGNUP = gql`
  mutation signup($user: InputCreateUser!) {
    signup(user: $user)
  }
`;

export const CREATE_BUY = gql`
  mutation createBuy($products: [InputProductsBuy!]!, $total: String!) {
    createBuy(products: $products, total: $total) {
      id
      name
    }
  }
`;
