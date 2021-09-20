import { useEffect, useState } from "react";
import {
  DELETE_PRODUCTS_FROM_SHOPPING_CART,
  DELETE_PRODUCTS_WITH_STOCK_ZERO,
  DELETE_PRODUCT_FROM_SHOPPING_CART,
} from "components/context/ShoppingCartActions";
import {
  useShoppinCard,
  useShoppinCardDispatch,
} from "components/context/ShoppingCartProvider";
import Layout from "components/Layout";
import Image from "next/image";
import { useUser } from "src/hooks/useUser";
import Link from "next/link";
import Head from "next/head";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLClient } from "graphql-request";
import { URI_GRAPHQL } from "src/graphql/constants";
import { CREATE_BUY } from "src/graphql/mutations";
import jsPDF from "jspdf";
import 'jspdf-autotable'

async function fetcherCreateBuy(variables) {
  const token = window.localStorage.getItem("access-token");
  if (!token) return null;
  const headers = {
    headers: {
      authorization: `Bearer ${token ? token : ""}`,
    },
  };
  const graphqlClient = new GraphQLClient(URI_GRAPHQL, headers);
  const data = await graphqlClient.request(CREATE_BUY, variables);
  return data.createBuy;
}

function Shopping(): JSX.Element {
  const queryClient = useQueryClient();
  const { dispatch } = useShoppinCardDispatch();
  const [error, setError] = useState<string[]>();
  const products = useShoppinCard();
  const { data } = useUser();
  const mutate = useMutation<any, Error, any>("createBuy", fetcherCreateBuy, {
    onSuccess: async (data) => {
      if (data) {
        dispatch({
          type: DELETE_PRODUCTS_WITH_STOCK_ZERO,
          payload: data.map((d: any) => d.id),
        });
        await queryClient.invalidateQueries("getProducts");
        setError(data);
        return;
      }
      dispatch({
        type: DELETE_PRODUCTS_FROM_SHOPPING_CART,
      });
      setError(null);
    },
  });

  const handlerBuy = async () => {
    try {
      const variables = {
        products: products.map((product) => ({
          id: product.id,
          units: product.units,
        })),
        total: handlerTotal(),
      };
      generatePdf()
      await mutate.mutateAsync(variables);
    } catch (error) {
      alert("hubo un error en la compra");
    }
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12)
    doc.text("aBc Store", 25, 25);
    doc.text(new Date().toDateString(), 150, 25);

    doc.setLineWidth(0.2);
    doc.rect(25, 35, 165, 45);
    // client 
    doc.text("Client:", 30, 45)
    doc.text(`${data.name + " " + data.surname}`, 50, 45)
    doc.text("Email:", 120, 45)
    doc.text(`${data.email}`, 140, 45)
    doc.text("Fecha:", 30, 55)
    doc.text(new Date().toDateString(), 50, 55)
    doc.text("SubTotal:", 30, 65)
    doc.text((Number(handlerTotal()) / 1.12).toFixed(2), 60, 65)
    doc.text("Total:", 30, 75)
    doc.text(handlerTotal(), 50, 75)

    doc.setLineWidth(0.2);
    doc.rect(25, 93, 165, 0);
    // PRODUCTS
    //@ts-ignore
    doc.autoTable({
      html: "#shopping",
      margin: { top: 90 },
    })

    doc.save(`Factura.${data.name + " " + data.secondName}.pdf`)
  };

  const handlerTotal = () => {
    const totalByProducts = products.map(
      (product) => product.units * Number(product.price)
    );

    const total = totalByProducts.reduce(
      (preValue, currentValue) => preValue + currentValue,
      0
    );

    return total.toFixed(2);
  };

  return (
    <Layout>
      <Head>
        <title>E-commerce - carrito de compras</title>
        <meta property="og:title" content="E-commerce - carrito de compras" key="title" />
      </Head>
      <h2 className="text-center text-2xl py-4 font-bold">
        Carrito de Compras
      </h2>
      <div className="grid grid-cols-12">
        {products.map((product, index) => {
          return (
            <li
              className="col-start-3 col-span-8 text-center  grid grid-flow-col items-center list-none rounded-md hover:bg-blue-400 hover:text-white py-2 px-2"
              key={product.name + index}
            >
              <Image
                src={product.image}
                width={50}
                height={50}
                layout="responsive"
                className="rounded-md"
              />
              <p className="ml-5">{product.name}</p>
              <p>Unidades {product.units}</p>
              <p>Precio {product.price}</p>
              <p>Total {Number(product.price) * product.units}</p>
              <button
                className="hover:text-red-500"
                onClick={() =>
                  dispatch({
                    type: DELETE_PRODUCT_FROM_SHOPPING_CART,
                    payload: { id: product.id },
                  })
                }
              >
                Eliminar
              </button>
            </li>
          );
        })}
      </div>
      {error && (
        <div className="flex flex-row items-center justify-center mt-2">
          <div className="grid grid-cols-1 rounded-md border-2 p-4">
            {error?.map((err: any, index) => {
              return (
                <li className="list-none" key={err.name + index}>
                  El producto{" "}
                  <span className="text-red-500 font-semibold">{err.name}</span>{" "}
                  ha removido de la lista, porque se su stock es 0
                </li>
              );
            })}
          </div>
        </div>
      )}


      <table className="hidden" id="shopping">
        <thead>
          <tr className="">
            <th>Código</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Unidades</th>
          </tr>
        </thead>
        <tbody>
          {
            products.map(product => {
              return <tr key={product.id} >
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.units}</td>
              </tr>
            })
          }
        </tbody>
      </table>
      <div className="flex flex-row items-center justify-center mt-2">
        <p>Total a pagar: {handlerTotal()}</p>
        {data ? (
          <button
            onClick={handlerBuy}
            className="bg-green-400 ml-5 px-2 py-2 rounded-md text-white"
          >
            Comprar
          </button>
        ) : (
          <Link href="/signin">
            <a className="ml-5 underline font-semibold">Iniciar Sesión</a>
          </Link>
        )}
      </div>
    </Layout>
  );
}

export default Shopping;
