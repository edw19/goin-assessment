import { useState } from "react";
import { request } from "graphql-request";
import { useRouter } from "next/router";
import Head from "next/head";
import { useMutation } from "react-query";
import { URI_GRAPHQL } from "src/graphql/constants";
import { SIGNUP } from "src/graphql/mutations";

interface INewUser {
  name: string;
  secondName: string;
  surname: string;
  secondSurname: string;
  address: string;
  email: string;
  password: string;
  role: string;
}

async function fetcherSignup(user) {
  const data = await request(URI_GRAPHQL, SIGNUP, {
    user: { ...user },
  });
  return data.signup;
}

function Signup(): JSX.Element {
  const router = useRouter();
  const [newUser, setNewUser] = useState<INewUser>({
    name: "",
    secondName: "",
    surname: "",
    secondSurname: "",
    address: "",
    email: "",
    password: "",
    role: "USER-ADMIN-STORE",
  });

  const mutate = useMutation<any, Error, INewUser>("signup", fetcherSignup);

  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [event.target.name]: event.target.value });
  };
  const handlerChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewUser({ ...newUser, [event.target.name]: event.target.value });
  };

  const handlerSubmitNewUser = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const {
      name,
      secondName,
      surname,
      secondSurname,
      address,
      email,
      password,
    } = newUser;

    const empty =
      !name ||
      !secondName ||
      !surname ||
      !secondSurname ||
      !address ||
      !email ||
      !password;
    if (empty) {
      return alert("Debes llenar los campos para registrarte");
    }
    if (password.length < 5) {
      return alert("Ingresa una contraseña más segura ");
    }
    try {
      await mutate.mutateAsync(newUser);
      router.push("/signin");
    } catch (error) {
      alert(
        error.response.errors[0].message.replace("ValidationError: Error:", "")
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>E-commerce - Registrarse</title>
        <meta
          property="og:title"
          content="E-commerce - Registrarse"
          key="title"
        />
      </Head>
      <div className="text-4xl flex flex-row justify-center py-3">
        <p>Registrarse en aBc</p>
      </div>
      <form
        onSubmit={handlerSubmitNewUser}
        action=""
        className="w-2/4 md:w-2/4 grid grid-cols-2"
      >
        <div className="col-span-2 grid grid-cols-1 gap-y-3">
          <h2>Tus credenciales</h2>
          <input
            type="text"
            className="py-3 px-2 bg-indigo-200 placeholder-indigo-900 rounded-md"
            placeholder="Ingresa tu email"
            onChange={handlerChange}
            value={newUser.email}
            name="email"
          />
          <input
            type="password"
            className="py-3 px-2 bg-indigo-200 placeholder-indigo-900 rounded-md"
            placeholder="Escribe una contraseña"
            onChange={handlerChange}
            value={newUser.password}
            name="password"
          />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-y-3 gap-x-3 mt-3">
          <h2 className="col-span-2">Tu información personal</h2>
          <input
            type="text"
            className="py-3 px-2 bg-indigo-200 placeholder-indigo-900 rounded-md"
            placeholder="Ingresa tu nombre"
            onChange={handlerChange}
            value={newUser.name}
            name="name"
          />
          <input
            type="text"
            className="py-3 px-2 bg-indigo-200 placeholder-indigo-900 rounded-md"
            placeholder="Ingresa tu segundo nombre"
            onChange={handlerChange}
            value={newUser.secondName}
            name="secondName"
          />
          <input
            type="text"
            className="py-3 px-2 bg-indigo-200 placeholder-blue-900 rounded-md"
            placeholder="Ingresa tu apellido"
            onChange={handlerChange}
            value={newUser.surname}
            name="surname"
          />
          <input
            type="text"
            className="py-3 px-2 bg-indigo-200 placeholder-indigo-900 rounded-md"
            placeholder="Ingresa tu segundo apellido"
            onChange={handlerChange}
            value={newUser.secondSurname}
            name="secondSurname"
          />
          <input
            type="text"
            className="py-3 px-2 bg-indigo-200 placeholder-indigo-900 rounded-md"
            placeholder="Ingresa tu dirección"
            onChange={handlerChange}
            value={newUser.address}
            name="address"
          />
          <select
            className="py-3 px-2 bg-indigo-200 text-indigo-900 rounded-md"
            placeholder="role de usuario"
            onChange={handlerChangeSelect}
            defaultValue={newUser.role}
            name="role"
          >
            <option value="USER-ADMIN-STORE">Administrador</option>
            <option value="USER-CLIENT">Client</option>
          </select>
          <button className=" flex flex-row items-center justify-center bg-indigo-900 col-span-2 py-2 text-white">
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
            Registrar Usuario
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
