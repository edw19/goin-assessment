import { useCategories } from "src/hooks/useCategories";
import { useProducts } from "src/hooks/useProducts";
import Product from "./Product";

function ProductsList({ products }): JSX.Element {
  const { data } = useCategories();
  const { productsList, filterByCategory, categorySelected } = useProducts({ initialData: products });

  return (
    <>
      <ul className="flex flex-row justify-center gap-x-4 bg-indigo-300 py-2 my-3 font-semibold">
        <li onClick={() => filterByCategory({})} className={`${categorySelected === "Todas las categorías" && "bg-white"} hover:bg-indigo-400 hover:text-white cursor-pointer py-1 px-2 rounded-md`}>Todas las categorías</li>
        {
          data?.map(category => {
            return <li
              key={category.id}
              onClick={() => filterByCategory({ id: category.id, name: category.name })}
              className={` ${categorySelected === category.name && "bg-white"} hover:bg-indigo-400 hover:text-white cursor-pointer py-1 px-2 rounded-md`}>
              {category.name}
            </li>
          })
        }
      </ul>{
        productsList.length === 0 || !productsList ? <div className="flex flex-col items-center mt-20">
          <h2 className="text-4xl font-light">Sin productos</h2>
        </div> :
          <div className="flex justify-center">
            <div className=" grid grid-cols-12  gap-4 px-4">
              {productsList?.map((product, index) => {
                return <Product key={index} product={product} />;
              })}
            </div>
          </div>
      }
    </>
  );
}

export default ProductsList;
