import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Button from '../components/Button'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../app/store'
import { fetchOrders, removeOrder, addToOrder,} from '../slices/orderSlice'
import { DishItem } from '../slices/menuSlice'


const Order = () => {

    const dispatch = useDispatch<AppDispatch>();
    const orderItemsDb = useSelector((state: RootState) => state.order.items)
    const orderStatus = useSelector((state: RootState) => state.order.status)
    const totalPrice = useSelector((state: RootState) => state.order.totalSum)

    console.log("totalPrice", totalPrice)

    //Exclude the test document in firebase order collection so it wont get rendered.
    const excludedId = "fbSwmKPeCJt1L8ghUm17"
    const filteredOrder = orderItemsDb.filter(item => item.id !== excludedId)

    useEffect(() => {
        if (orderStatus === 'idle'){
            dispatch(fetchOrders())
        }
      })
    
      useEffect(() => {
        console.log("OrderDB", orderItemsDb)
      }, [orderItemsDb])

      const handleAddToOrder = (item: DishItem) => {
        console.log("Adding item to order", item)
        const orderItem = {...item, quantity: 1}
        dispatch(addToOrder(orderItem)); // Spara till Firestore
        
      }
      
      const handleRemoveOrder = (item: DishItem) => {
        console.log("Removing item to order", item)
        const orderItem = {...item, quantity: 1}
        dispatch(removeOrder(orderItem)); // Spara till Firestore
      }

  return (
    <>
    <section className='bg-secondary-300 h-screen flex justify-center'>
    <section className="w-full max-w-[500px] m-8 flex flex-col">

{/* navbar */}

    <nav className='flex flex-row justify-between items-center mb-6'>
        <Link to={"/"}>
        <img src="/assets/logo-dark.svg" className='pb-4 w-12 h-12'/>
        </Link>
                

                <img src="/assets/cart.png" className='w-4 h-4'/>
        </nav>


{filteredOrder.map((item) => (


<article className="bg-secondary-300 h-auto flex-grow" key={item.id}>
<div className="flex flex-row justify-between">
    <h2 className="text-primary-400 text-22 font-bold font-fira-sans">{item.dishname.toUpperCase()}</h2>
    <h2 className="text-primary-400 text-22 font-bold font-fira-sans">{item.price * item.quantity} SEK</h2>
</div>



<div className='flex flex-row items-end gap-2'>
    <div 
    className='bg-primary-500 rounded-full w-4 h-4 flex justify-center items-center transition 
    duration-300 ease-in-out transform hover:bg-primary-400 cursor-pointer'
    onClick={() => handleRemoveOrder(item)}
    >
        <i className="fa-solid fa-minus text-white text-[8px]"></i>
    </div>
        
        <p className='text-primary-400 text-[12px] mt-2 font-fira-sans'>{item.quantity} stycken</p>
    
    <div 
    className='bg-primary-500 rounded-full w-4 h-4 flex justify-center items-center transition duration-300 ease-in-out transform hover:bg-primary-400 cursor-pointer'
    onClick={() => handleAddToOrder(item)}
    >
    <i className="fa-solid fa-plus text-white text-[8px]"></i>
    </div>
</div>




<div className="border-t-2 border-dotted border-primary-400 mt-4"></div>
</article>



))}


        {/* TOTALT */}

        <article className='bg-primary-600 flex flex-row justify-between items-center p-4 my-4 rounded-md'>
        <div className='flex flex-col'>
        <h2 className="text-primary-400 text-22 font-bold font-fira-sans">TOTALT</h2>
        <p className='text-primary-400 text-[12px] mt-2 font-fira-sans'>inkl 20% moms</p>
        </div>    
        
        <h2 className="text-primary-400 text-28 font-bold font-fira-sans">{totalPrice} sek</h2>
        </article>

        {/* BUTTON */}
<Link to={"/eta"}>
<Button
        variant="dark"
        >
            TAKE MY MONEY!
        </Button>
</Link>
        

    </section>
    

    </section>
    </>
  )
}

export default Order