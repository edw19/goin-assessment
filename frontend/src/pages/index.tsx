export default function Home(): JSX.Element {
  return <span>Page never displayed</span>;
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: "/store/products",
      permanent: false,
    },
  };
}
