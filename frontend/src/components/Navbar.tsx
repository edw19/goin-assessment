import Link from "next/link";
import { useUser } from "src/hooks/useUser";
import NewProduct from "./modals/NewProduct";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { GraphQLClient } from "graphql-request";
import { URI_GRAPHQL } from "src/graphql/constants";
import { LOGOUT } from "src/graphql/mutations";
import { useShoppinCard } from "./context/ShoppingCartProvider";
import NewCategory from "./modals/NewCategory";

async function fetcherLogout() {
  const token = window.localStorage.getItem("access-token");
  if (!token) {
    throw new Error("no tienes un token de acceso");
  }
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  const data = await graphqlClient.request(LOGOUT);
  return data.logout;
}

function Navbar(): JSX.Element {
  const { data } = useUser();
  const router = useRouter();
  const products = useShoppinCard();
  const mutate = useMutation("logout", fetcherLogout);
  const queryClient = useQueryClient();

  const handlerLogout = async () => {
    try {
      await mutate.mutateAsync();
      window.localStorage.removeItem("access-token");
      queryClient.invalidateQueries();
      router.push("/store/products");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="grid grid-cols-5 py-3">
      <Link href="/store/products">
        <a className="font-bold w-1/6 flex flex-row  col-start-2 border-b-2">
          <p className="font-medium text-3xl text-indigo-900">a</p>
          <p className="font-medium text-3xl uppercase text-indigo-700">b</p>
          <p className="font-medium text-3xl text-indigo-200">c</p>
        </a>
      </Link>
      <ul className="flex flex-row justify-center items-center col-span-3 gap-x-3">
        {data?.role === "USER-ADMIN-STORE" ? <>
        <NewCategory />
          <NewProduct />
        </> : <li>
          <Link href="/shopping">
            <a className="relative">
              <svg className="w-6 h-6 text-indigo-200" data-darkreader-inline-fill="" data-darkreader-inline-stroke="" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="absolute -top-3  left-6 bg-indigo-700 text-white px-2 rounded-full">
                {products.length}
              </span>
            </a>
          </Link>
        </li>}
        {data ? (
          <>
            <li className="px-6">
              <Link href="/profile">
                <a className="">
                  {data.name + " "} {data.surname}
                </a>
              </Link>
            </li>
            <li className="cursor-pointer" onClick={handlerLogout}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </li>
          </>
        ) : (
          <li className="ml-8">
            <Link href="/signin">
              <a>Iniciar Sesión</a>
            </Link>
          </li>
        )}
        <li></li>
      </ul>
    </nav>
  );
}

export default Navbar;
