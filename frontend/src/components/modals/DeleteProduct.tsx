import { Modal } from "react-responsive-modal";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLClient } from "graphql-request";
import { URI_GRAPHQL } from "src/graphql/constants";
import { DELETE_PRODUCT } from "src/graphql/mutations";
import { useRouter } from "next/router";

async function fetcherNewProduct(id: string) {
  const token = window.localStorage.getItem("access-token");
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  const data = await graphqlClient.request(DELETE_PRODUCT, { id });
  return data;
}

function DeleteProduct({ id }): JSX.Element {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const mutate = useMutation("deleteProduct", fetcherNewProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("getProducts");
    },
  });
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handlerSubmitNewProduct = async (
    event: React.FormEvent<EventTarget>
  ) => {
    event.preventDefault();

    try {
      await mutate.mutateAsync(id);
      onCloseModal();
      router.push("/store/products");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="bg-red-500 rounded-md px-3 py-3 mt-5 text-white"
        onClick={onOpenModal}
      >
        Eliminar Producto
      </button>
      <Modal open={open} onClose={onCloseModal} center>
        <h2 className="mr-10">¿En realidad desea Eliminar este Producto?</h2>
        <form
          onSubmit={handlerSubmitNewProduct}
          className="grid grid-cols-3 mt-5"
        >
          <button className="col-start-2 col-span-1 flex flex-row items-center justify-center bg-red-500 px-2 py-2 text-white">
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
            Si
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default DeleteProduct;
