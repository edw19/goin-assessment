import React from 'react'
import { useProducts } from 'src/hooks/useProducts'
import Image from 'next/image'
import { useRouter } from 'next/router'

function ProductsAdmin() {
    const { productsAdmin, isLoading } = useProducts({})
    const router = useRouter()

    if (isLoading) return <div className="col-start-3 py-40 col-span-8 text-center flex flex-col animate-pulse">
        <h2>Cargando Productos...</h2>
    </div>

    return (
        <div className=" col-start-3 col-span-8 flex flex-col">

            <div className="grid grid-cols-4 text-center py-2 bg-indigo-400 rounded-md text-white">
                <p>Nombre</p>
                <p>Price</p>
                <p>Stock</p>
                <p>Image</p>
            </div>

            {
                productsAdmin?.map(product => {
                    const lowStock = product.stock < 10
                    return <div
                        onClick={() =>
                            router.push({
                                pathname: `/store/products/${product.id}`,
                            })
                        }
                        key={product.id}
                        className="grid grid-cols-4 rounded-md cursor-pointer hover:bg-indigo-200 text-center py-1">
                        <p>{product.name}</p>
                        <p className={`${lowStock && "text-red-500"}`}>{product.stock} {lowStock && "pocas unidades"}</p>
                        <p>{product.price}</p>
                        <div>
                            <Image width={50} layout="intrinsic" height={50} src={product.image} />
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default ProductsAdmin
