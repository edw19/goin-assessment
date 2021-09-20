import { useState } from "react";
import { Modal } from "react-responsive-modal";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLClient } from "graphql-request";
import { URI_GRAPHQL } from "src/graphql/constants";
import { UPDATE_USER } from "src/graphql/mutations";

async function fetcherUpdateUser(user) {
  const token = window.localStorage.getItem("access-token");
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  const data = await graphqlClient.request(UPDATE_USER, { user });
  return data;
}

function UpdateUser({ user }): JSX.Element {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [updateUser, setUpdateUser] = useState(user);
  const [password, setPassword] = useState<string>("");
  const mutate = useMutation("updateUser", fetcherUpdateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("getUser");
    },
  });

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateUser({ ...updateUser, [event.target.name]: event.target.value });
  };

  // the password is optional to update
  const handlerChangePassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const handlerSubmitUpdate = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const { name, secondName, surname, secondSurname, address, role } =
      updateUser;

    const empty =
      !name || !secondName || !surname || !secondSurname || !address || !role;

    if (empty) {
      return alert("debes llenar todos los campos");
    }
    try {
      delete updateUser.expenses;
      await mutate.mutateAsync({ ...updateUser, password });
      setPassword("");
      onCloseModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-400 px-2 py-2 rounded-md text-white"
        onClick={onOpenModal}
      >
        Actualizar Información
      </button>
      <Modal open={open} onClose={onCloseModal} center>
        <h2>Actualizar Información</h2>
        <form
          onSubmit={handlerSubmitUpdate}
          className="grid grid-cols-2 gap-y-3 gap-x-3"
        >
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Ingresa tu email"
            onChange={handlerChange}
            value={updateUser.email}
            name="email"
          />
          <input
            type="password"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Contraseña (opcional )"
            onChange={handlerChangePassword}
            value={password}
            name="password"
          />
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Ingresa tu nombre"
            onChange={handlerChange}
            value={updateUser.name}
            name="name"
          />
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Ingresa tu segundo nombre"
            onChange={handlerChange}
            value={updateUser.secondName}
            name="secondName"
          />
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Ingresa tu apellido"
            onChange={handlerChange}
            value={updateUser.surname}
            name="surname"
          />
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Ingresa tu segundo apellido"
            onChange={handlerChange}
            value={updateUser.secondSurname}
            name="secondSurname"
          />
          <input
            type="text"
            className="py-3 px-2 bg-gray-50 placeholder-blue-900 rounded-md"
            placeholder="Ingresa tu dirección"
            onChange={handlerChange}
            value={updateUser.address}
            name="address"
          />
          <button className="bg-blue-400 col-span-2 px-2 py-2 text-white">
            Actualizar
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default UpdateUser;
