import Layout from "components/Layout";
import UpdateUser from "components/modals/UpdateUser";
import { useEffect } from "react";
import { useUser } from "src/hooks/useUser";
import { useRouter } from "next/router";
import Head from "next/head";
import { useReportSale } from "src/hooks/useReports";
import ProductsAdmin from "components/ProductsAdmin";

function Profile(): JSX.Element {
  const { data, isLoading } = useUser();
  const { data: report } = useReportSale()
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("access-token");
    if (!token) {
      router.push("/store/products");
      return;
    }
  });

  if (isLoading || !data)
    return (
      <Layout>
        <p>Cargando informacion...</p>
      </Layout>
    );

  return (
    <Layout>
      <Head>
        <title>E-commerce - {data?.name}</title>
        <meta property="og:title" content={`${data?.name}`} key="title" />
      </Head>
      <div className="grid grid-cols-12 mt-10">
        <div className="col-start-3 col-span-4 p-4">
          <div className="text-left py-2">
            <h2 className="text-2xl">Tu información</h2>
          </div>
          <div className="flex flex-row gap-x-3">
            <label>Nombres: </label>
            <p>
              {data.name} {data.secondName}
            </p>
          </div>
          <div className="flex flex-row gap-x-3">
            <label>Apellidos: </label>
            <p>
              {data.surname} {data.secondSurname}
            </p>
          </div>
          <div className="flex flex-row gap-x-3">
            <label>Dirección: </label>
            <p>{data.address}</p>
          </div>
          <div className="text-left py-3">
            <h2 className="text-2xl">Credenciales de acceso</h2>
          </div>
          <div className="flex flex-row gap-x-3">
            <label>Email:</label>
            <p>{data.email}</p>
          </div>
          <div className="flex flex-row gap-x-3">
            <label>Rol de usuario: </label>
            <p>
              {data.role === "USER-ADMIN-STORE" ? "ADMINISTRADOR" : "CLIENTE"}
            </p>
          </div>
        </div>
        <div className="col-span-4 flex flex-col items-center justify-center">
          <UpdateUser user={data} />
        </div>
        {
          data.role === "USER-ADMIN-STORE" ?
            <>
              <div className="col-start-3 col-span-8 border border-indigo-900 mb-2 rounded-md py-1">
                <h2 className="text-center font-semibold text-2xl">
                  Total en ventas
                </h2>
                {!report ?
                  <p className="text-center text-lg animate-pulse">Calculando ventas...</p> :
                  <p className="text-center text-2xl">${Number(report)?.toFixed(2)}</p>

                }
              </div>
              <ProductsAdmin />
            </>
            :
            <div className=" col-start-3 col-span-8">
              <h2 className="text-center font-semibold text-2xl">
                Historial de compras
              </h2>
              {data.expenses && (
                <div className="text-center">
                  <div className="grid grid-cols-2">
                    <h2>Monto Gastado</h2>
                    <h2>Fecha de Compra</h2>
                  </div>
                  {data.expenses?.map((expense) => {
                    return (
                      <div className="grid grid-cols-2" key={expense.createAt}>
                        <p>{expense.expense}</p>
                        <p>{new Date(expense.createAt).toDateString()}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
        }
      </div>
    </Layout>
  );
}

export default Profile;
