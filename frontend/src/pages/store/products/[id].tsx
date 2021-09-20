import { request } from "graphql-request";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Image from "next/image";
import Layout from "components/Layout";
import { useUser } from "src/hooks/useUser";
import UpdateProduct from "components/modals/UpdateProduct";
import DeleteProduct from "components/modals/DeleteProduct";
import { useShoppinCardDispatch } from "components/context/ShoppingCartProvider";
import { ADD_PRODUCT_TO_SHOPPING_CART } from "components/context/ShoppingCartActions";
import { GET_PRODUCT } from "src/graphql/queries";
import { URI_GRAPHQL } from "src/graphql/constants";
import Head from "next/head";

async function fetcherGetProduct(id: string) {
  if (!id) return;
  const data = await request(URI_GRAPHQL, GET_PRODUCT, {
    id,
  });
  return data.getProduct;
}

function Index(): JSX.Element {
  const router = useRouter();
  const { dispatch } = useShoppinCardDispatch();
  const { data: user } = useUser();
  const { data, isLoading } = useQuery(
    ["getProduct", router.query.id as string],
    async ({ queryKey }) => await fetcherGetProduct(queryKey[1])
  );

  if (isLoading || !data) return <Layout> Cargando Producto...</Layout>;

  const handlerAddToShoppingCart = () => {
    dispatch({
      type: ADD_PRODUCT_TO_SHOPPING_CART,
      payload: {
        id: data.id,
        name: data.name,
        units: 1,
        price: data.price,
        image: data.image,
      },
    });
    alert(`Producto agregado al carrito ${data.name}`);
  };

  return (
    <Layout>
      <Head>
        <title>E-commerce - {data?.name}</title>
        <meta property="og:title" content={`${data?.name}`} key="title" />
      </Head>
      <div className="grid grid-cols-8">
        <div className="rounded-md col-start-2 col-span-4">
          <Image
            src={data.image}
            placeholder="blur"
            height={200}
            width={200}
            blurDataURL={data.image}
            layout="responsive"
            objectFit="contain"
          />
        </div>
        <div className="flex flex-col items-center justify-center col-span-2">
          <p>Nombre: {data.name}</p>
          <p>
            Unidades Disponibles{" "}
            <span className="text-green-500">{data.stock}</span>
          </p>
          <p className="pt-3">
            Precio <span className="text-blue-500">$ {data.price}</span>
          </p>
          {user?.role === "USER-ADMIN-STORE" ? (
            <>
              <UpdateProduct product={data} />
              <DeleteProduct id={data.id} />
            </>
          ) : <button
            onClick={handlerAddToShoppingCart}
            className="bg-green-400  text-white rounded-md px-2 py-1"
          >
            Agregar al carrito
          </button>}
        </div>
      </div>
    </Layout>
  );
}

export default Index;
