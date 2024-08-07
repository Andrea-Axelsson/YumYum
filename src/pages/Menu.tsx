import { useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../app/store'
import { fetchMenu } from '../slices/menuSlice'
import { addToOrder, fetchOrders, removeOrder} from '../slices/orderSlice'
import { DishItem } from '../slices/menuSlice'


const Menu: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const menuItems = useSelector((state: RootState) => state.menu.items)
  const menuStatus = useSelector((state: RootState) => state.menu.status)
  const orderItemsDb = useSelector((state: RootState) => state.order.items)
  const orderStatus = useSelector((state: RootState) => state.order.status)
  const totalPrice = useSelector((state: RootState) => state.order.totalSum)
  const totalItems = useSelector((state: RootState) => state.order.totalQuantity)
  /* const [checkedValue, setcheckedValue] = useState<string[]>([]) */
  const [cartIsEmpty, setCartIsEmpty] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)

console.log("totalPrice", totalPrice)

  useEffect(() => {
    console.log("Checking menuStatus:", menuStatus);
    if (menuStatus === 'idle') {
      console.log("Fetching menu...");
      dispatch(fetchMenu());
    }
  }, [menuStatus, dispatch]);

  useEffect(() => {
    console.log("menuItems", menuItems);
  }, [menuItems]);
  
  useEffect(() => {
    if (orderStatus === 'idle'){
        dispatch(fetchOrders())
    }
  })

    /* useEffect(() => {

        if (checkedValue){
            console.log("checkedValue", checkedValue)
        }

    }, [checkedValue]) */
    

/*     const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        if (checked){
            setcheckedValue(prev => [...prev, value])
        }else{
            setcheckedValue(prev => prev.filter(v => v !==value))
        }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(checkedValue);

  }; */

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

  
const handleCartClick = (e:any) => {
  if (totalItems <= 0){
    setCartIsEmpty(true)
    setIsVisible(true)

    setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCartIsEmpty(false)
      }, 500)
    }, 3000)
    e.preventDefault()

  }else{
    navigate('/order')
  }
}

console.log("Cart is empty?", cartIsEmpty)

  return (
    <>
    <section 
    className="bg-primary-100 h-full flex justify-center"
    style={{
        backgroundImage: 'url("/assets/pattern.png")',
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
    }}
    >
       
    <section className="w-full max-w-[500px] m-8">

        {/* Navbar */}

        <nav className='flex flex-row justify-between'>
                <img src="/assets/logo-2.svg" className='pb-4 w-12 h-12'/>
                
                
                
                
                {cartIsEmpty && (
                  <div className={`bg-white rounded-md h-6 flex justify-center items-center transition-opacity ${isVisible ? 'animate-fade-in' : 'animate-fade-out'}`}><p className=' text-red-500 text-[12px] font-fira-sans p-2 font-bold'>Lägg till något i kundvagnen</p></div>
                )}



{/* {showWarning && (
        <div
          className={`bg-white rounded-md h-6 flex justify-center items-center transition-opacity ${
            isVisible ? 'animate-fade-in' : 'animate-fade-out'
          }`}
        >
          <p className="text-red-500 text-[12px] font-fira-sans p-2 font-bold">
            Lägg till något i kundvagnen
          </p>
        </div>
      )} */}

                
                <Link to={"order"} onClick={handleCartClick}>
                  <div className='bg-secondary-300 w-8 h-8 rounded-md flex justify-center items-center relative'>
                  {totalItems > 0 && <div className='w-4 h-4 bg-orange-600 rounded-lg flex justify-center items-center absolute bottom-6 left-6'>
                    <p className='text-[10px] font-bold font-fira-sans text-white'>{totalItems}</p>
                    </div> }
                  <img src="/assets/cart.png" className='w-4 h-4'/>
                  </div>
                  
                </Link>
        </nav>
        

        <article className="bg-primary-300 h-auto py-4 px-4 rounded-tl-md rounded-tr-md">
            <h1 className="text-white text-28 font-bold font-fira-sans">MENY</h1>
        </article>

        {menuItems.map(item => {
        // Hitta motsvarande orderItem baserat på item.id
        const orderItem = orderItemsDb.find(order => order.dishname === item.dishname)

        return (
          <article key={item.id} className="bg-primary-300 h-auto px-4">
            <div className="flex flex-row justify-between">
              <h2 className="text-white text-22 font-bold font-fira-sans">{item.dishname.toUpperCase()}</h2>
              <h2 className="text-white text-22 font-bold font-fira-sans">{item.price} SEK</h2>
            </div>

            <div className='flex flex-row items-end gap-2'>
              <div
                className='bg-primary-500 rounded-full w-4 h-4 flex justify-center items-center transition duration-300 ease-in-out transform hover:bg-primary-400 cursor-pointer'
                onClick={() => handleRemoveOrder(item)}
              >
                <i className="fa-solid fa-minus text-white text-[8px]"></i>
              </div>

              <p className='text-white text-[12px] mt-2 font-fira-sans'>
                {orderItem ? orderItem.quantity : 0}
              </p>

              <div
                className='bg-primary-500 rounded-full w-4 h-4 flex justify-center items-center transition duration-300 ease-in-out transform hover:bg-primary-400 cursor-pointer'
                onClick={() => handleAddToOrder(item)}
              >
                <i className="fa-solid fa-plus text-white text-[8px]"></i>
              </div>
            </div>

            <p className="text-white text-14 mt-2 font-fira-sans">{item.description}</p>
            <div className="border-t-2 border-dotted border-secondary-300 py-2 mt-4"></div>
          </article>
        );
      })}

       
        
        {/* DIPPSÅS */}
        
       {/*  <article className="bg-primary-300 h-auto p-4 rounded-bl-md rounded-br-md">
            <div className="flex flex-row justify-between">
                <h2 className="text-white text-22 font-bold ">DIPSÅS</h2>
                <h2 className="text-white text-22 font-bold">19 SEK</h2>
            </div>
           
            <form onSubmit={handleSubmit} className='flex flex-wrap gap-3 py-3'>
                <label className="inline-flex items-center">
                    <input
                    type="checkbox"
                    name="checkbox1"
                    value="sweet chili"
                    checked={checkedValue.includes("sweet chili")}
                    onChange={handleChange}
                    className="hidden"
                    />
                    <span className={`font-fira-sans rounded-md text-14 px-3 cursor-pointer text-center transition duration-300 ease-in-out transform
                        ${checkedValue.includes("sweet chili") ? 'bg-primary-400 text-white hover:bg-secondary-700' : 'bg-primary-500 text-white hover:bg-secondary-600'}
                        `}>
                            sweet chili
                        </span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="checkbox"
                    name="checkbox1"
                    value="sweet & sour"
                    checked={checkedValue.includes("sweet & sour")}
                    onChange={handleChange}
                    className="hidden"
                    />
                    <span className={`font-fira-sans rounded-md text-14 px-3 cursor-pointer text-center transition duration-300 ease-in-out transform
                        ${checkedValue.includes("sweet & sour") ? 'bg-primary-400 text-white hover:bg-secondary-700' : 'bg-primary-500 text-white hover:bg-secondary-600'}
                        `}>
                            sweet & sour
                        </span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="checkbox"
                    name="checkbox1"
                    value="guacamole"
                    checked={checkedValue.includes("guacamole")}
                    onChange={handleChange}
                    className="hidden"
                    />
                    <span className={`font-fira-sans rounded-md text-14 px-3 cursor-pointer text-center transition duration-300 ease-in-out transform
                        ${checkedValue.includes("guacamole") ? 'bg-primary-400 text-white hover:bg-secondary-700' : 'bg-primary-500 text-white hover:bg-secondary-600'}
                        `}>
                            guacamole
                        </span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="checkbox"
                    name="checkbox1"
                    value="wonton"
                    checked={checkedValue.includes("wonton")}
                    onChange={handleChange}
                    className="hidden"
                    />
                    <span className={`font-fira-sans rounded-md text-14 px-3 cursor-pointer text-center transition duration-300 ease-in-out transform
                        ${checkedValue.includes("wonton") ? 'bg-primary-400 text-white hover:bg-secondary-700' : 'bg-primary-500 text-white hover:bg-secondary-600'}
                        `}>
                            wonton
                        </span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="checkbox"
                    name="checkbox1"
                    value="hot mango"
                    checked={checkedValue.includes("hot mango")}
                    onChange={handleChange}
                    className="hidden"
                    />
                    <span className={`font-fira-sans rounded-md text-14 px-3 cursor-pointer text-center transition duration-300 ease-in-out transform
                        ${checkedValue.includes("hot mango") ? 'bg-primary-400 text-white hover:bg-secondary-700' : 'bg-primary-500 text-white hover:bg-secondary-600'}
                        `}>
                            hot mango
                        </span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="checkbox"
                    name="checkbox1"
                    value="chili mayo"
                    checked={checkedValue.includes("chili mayo")}
                    onChange={handleChange}
                    className="hidden"
                    />
                    <span className={`font-fira-sans rounded-md text-14 px-3 cursor-pointer text-center transition duration-300 ease-in-out transform
                        ${checkedValue.includes("chili mayo") ? 'bg-primary-400 text-white hover:bg-secondary-700' : 'bg-primary-500 text-white hover:bg-secondary-600'}
                        `}>
                            chili mayo
                        </span>
                </label>

            </form>
        </article> */}
        
    </section>    
    </section>
    </>
    
  )
}

export default Menu