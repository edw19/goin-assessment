import { Modal } from "react-responsive-modal";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLClient } from "graphql-request";
import { URI_GRAPHQL } from "src/graphql/constants";
import { UPDATE_PRODUCT } from "src/graphql/mutations";

interface IUpdateProduct {
  id: string;
  name: string;
  price: string;
  stock: number;
  category: string
}

async function fetcherNewProduct(variables) {
  const token = window.localStorage.getItem("access-token");
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  const data = await graphqlClient.request(UPDATE_PRODUCT, variables);
  return data;
}

function UpdateProduct({ product }): JSX.Element {
  console.log(product, "jjsjs")
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [updateImage, setUpdateImage] = useState(null);
  const [updateProduct, setUpdateProduct] = useState<IUpdateProduct>({
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    category: product.category
  });

  const mutate = useMutation("updateProduct", fetcherNewProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("getProduct");
    },
  });
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateProduct({
      ...updateProduct,
      [event.target.name]:
        event.target.type === "number"
          ? parseInt(event.target.value)
          : event.target.value,
    });
  };
  const handlerChangeUpdateImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdateImage(event.target.files[0]);
  };

  const handlerSubmitNewProduct = async (
    event: React.FormEvent<EventTarget>
  ) => {
    event.preventDefault();
    const { name, price, stock } = updateProduct

    const empty = !name || !price || !stock;

    if (empty) {
      return alert("debes llenar todos los campos");
    }
    try {
      await mutate.mutateAsync({ product: updateProduct, image: updateImage });
      onCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="bg-yellow-500 rounded-md text-white px-2 py-3 mt-5"
        onClick={onOpenModal}
      >
        Actualizar Producto
      </button>
      <Modal open={open} onClose={onCloseModal} center>
        <h2>Actualizar Producto</h2>
        <form
          onSubmit={handlerSubmitNewProduct}
          className="grid grid-cols-2 gap-y-3 gap-x-3"
        >
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Nombre del producto"
            onChange={handlerChange}
            value={updateProduct.name}
            name="name"
          />
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="pricio del producto"
            onChange={handlerChange}
            value={updateProduct.price}
            name="price"
          />
          <input
            type="number"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="pricio del producto"
            onChange={handlerChange}
            value={updateProduct.stock}
            name="stock"
          />
          <input
            type="file"
            onChange={handlerChangeUpdateImage}
            accept="image/*"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
          />
          <button className="flex flex-row items-center justify-center bg-blue-400 col-span-2 px-2 py-2 text-white">
            {mutate.isLoading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            Actualizar Producto
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default UpdateProduct;
