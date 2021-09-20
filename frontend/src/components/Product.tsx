import Image from "next/image";
import { useRouter } from "next/router";
import { useUser } from "src/hooks/useUser";
import { ADD_PRODUCT_TO_SHOPPING_CART } from "./context/ShoppingCartActions";
import { useShoppinCardDispatch } from "./context/ShoppingCartProvider";

interface IProducts {
  product: {
    id: string;
    name: string;
    stock: number;
    price: number;
    image: string;
  };
}

function Product({
  product: { id, name, stock, image, price },
}: IProducts): JSX.Element {
  const router = useRouter();
  const { data: user } = useUser()
  const { dispatch } = useShoppinCardDispatch();
  return (
    <div
      onClick={() =>
        router.push({
          pathname: `/store/products/${id}`,
        })
      }
      className="col-span-2 cursor-pointer text-center hover:shadow-lg pb-2 hover:bg-indigo-400  hover:text-white  rounded-md">
      <Image
        src={image}
        width={100}
        height={100}
        placeholder="blur"
        layout='responsive'
        className="rounded-md"
        blurDataURL={image} />
      <p>{name}</p>
      <p>
        <span className="  mr-1">{stock}</span>
        Unidades
      </p>

      {
        user?.role !== "USER-ADMIN-STORE" &&
        <div className="flex flex-col items-center gap-x-3 justify-center px-8">
          <button
            onClick={(e) => {
              e.stopPropagation()
              dispatch({
                type: ADD_PRODUCT_TO_SHOPPING_CART,
                payload: { id, name, units: 1, price, image },
              });
              alert(`Producto agregado al carrito ${name}`);
            }}
            className=" hover:bg-indigo-700 hover:text-white  rounded-md px-2 py-1"
          >
            <span className=" font-extrabold mr-1">+</span>
            Agregar
          </button>
        </div>
      }
    </div>
  );
}

export default Product;
