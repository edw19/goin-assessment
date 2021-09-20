import Navbar from "./Navbar";

function Layout({ children }): JSX.Element {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
