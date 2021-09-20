import { useQuery, useQueryClient } from "react-query";
import { request } from "graphql-request";
import { GET_PRODUCTS } from "../graphql/queries";
import { URI_GRAPHQL } from "src/graphql/constants";
import { useState } from "react";

export async function fetcherGetProducts() {
  const data = await request(URI_GRAPHQL, GET_PRODUCTS);
  return data.getProducts;
}

export function useProducts({ initialData }: { initialData?: any }) {
  const [products, setProducts] = useState([])
  const [categorySelected, setCategorySelected] = useState("Todas las categorías")
  const { data } = useQuery("getProducts", fetcherGetProducts, {
    initialData,
    onSuccess() {
      setProducts(initialData)
    }
  });
  const { data: productsAdmin, isLoading } = useQuery("getProductAdmin", fetcherGetProducts);

  const filterByCategory = ({ id, name }: { id?: string, name?: string }) => {
    if (!id) {
      setProducts(data)
      setCategorySelected("Todas las categorías")
      return
    }
    const result = data.filter(product => product.category === id)
    setCategorySelected(name)
    return setProducts(result)
  }

  return {
    productsList: products,
    filterByCategory,
    categorySelected,
    productsAdmin,
    isLoading
  }
}
