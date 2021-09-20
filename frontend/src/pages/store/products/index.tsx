import Layout from "components/Layout";
import ProductsList from "components/ProductsList";
import { fetcherGetProducts } from "src/hooks/useProducts";
import Head from "next/head";

function Index({ products }): JSX.Element {
  return (
    <Layout>
      <Head>
        <title>aBc</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="E-commerce" key="title" />
      </Head>
      <ProductsList products={products} />
    </Layout>
  );
}

export async function getStaticProps() {
  const products = await fetcherGetProducts();
  return { props: { products } };
}

export default Index;
