import { Modal } from "react-responsive-modal";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLClient } from "graphql-request";
import { URI_GRAPHQL } from "src/graphql/constants";
import { CREATE_CATEGORY } from "src/graphql/mutations";

async function fetcherNewProduct(variables: any) {
  const token = window.localStorage.getItem("access-token");
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  const data = await graphqlClient.request(CREATE_CATEGORY, variables);
  return data.createCategory;
}

function NewCategory(): JSX.Element {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const mutate = useMutation("newCategory", fetcherNewProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("getCategories");
    },
  });
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);


  const handlerSubmitNewProduct = async (
    event: React.FormEvent<EventTarget>
  ) => {
    event.preventDefault();

    if (!name) {
      return alert("Debes dar un nombre a la categoría");
    }
    try {
      await mutate.mutateAsync({ name });
      setName("");
      onCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="hover:text-indigo-700 " onClick={onOpenModal}>
        Nueva Categoría
      </button>
      <Modal open={open} onClose={onCloseModal} center>
        <h2>Nueva Categoría</h2>
        <form
          onSubmit={handlerSubmitNewProduct}
          className="grid grid-cols-1 gap-y-3 gap-x-3"
        >
          <input
            type="text"
            className="py-4 px-4 mt-5 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Nombre Categoría"
            autoFocus
            onChange={(e) => setName(e.target.value)}
            value={name}
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
            Crear
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default NewCategory;
