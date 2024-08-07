import { Link } from 'react-router-dom'
import Button from '../components/Button'

import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../app/store'
import { deleteOrderFirebase} from '../slices/orderSlice'

const EtaScreen = () => {

  const dispatch = useDispatch<AppDispatch>();
  const orderItemsDb = useSelector((state: RootState) => state.order.items)

  //Exclude the test document in firebase order collection so it wont get rendered.
  const excludedId = "fbSwmKPeCJt1L8ghUm17"
  const filteredOrder = orderItemsDb.filter(item => item.id !== excludedId)

  const handleDeleteOrder = () => {
    dispatch(deleteOrderFirebase(filteredOrder))
  }

  return (
    <>
    <section className='bg-primary-300 h-screen flex justify-center'>
    <section className="w-full max-w-[500px] m-8 flex flex-col">

{/* navbar */}

    <nav className='flex flex-row justify-between items-center'>
        <Link to={"/"} onClick={handleDeleteOrder}>
        <img src="/assets/logo-2.svg" className='pb-4 w-12 h-12'/>
        </Link>
    </nav>

        <img src="/assets/boxtop 1.png" className='pb-4 w-56 flex self-center'/>

        <h1 className="text-white text-28 text-center font-bold font-fira-sans mb-2">DINA WONTONS TILLAGAS!</h1>
        <h2 className="text-white text-22 font-bold font-fira-sans text-center mb-4">ETA 5 min</h2>
        <p className="text-white text-14 font-bold font-fira-sans text-center mb-4">#4kjwsdf234k</p>

      <Link 
      onClick={handleDeleteOrder}
      to={"/"}>
        <Button
        variant="dark"
        >
        BESTÄLL MER
        </Button>
      </Link>
        
        <Link to={"/receipt"}>
        <Button
        variant="border"
        >
        SE KVITTO
        </Button>
        </Link>
        

    </section>
    </section>
    </>

  )
}

export default EtaScreen