import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useSelector} from 'react-redux'
import { RootState } from '../app/store'
const Receipt = () => {


  const orderItemsDb = useSelector((state: RootState) => state.order.items)
  const totalPrice = useSelector((state: RootState) => state.order.totalSum)

  const excludedId = "fbSwmKPeCJt1L8ghUm17"
  const filteredOrder = orderItemsDb.filter(item => item.id !== excludedId)

  return (
    <>
     <section className='bg-primary-300 h-screen flex justify-center'>
     <section className="w-full max-w-[500px] m-8 flex flex-col">

        {/* Navbar */}

        <nav className='flex flex-row justify-between items-center mb-6'>
        <Link to={"/"}>
        <img src="/assets/logo-2.svg" className='pb-4 w-12 h-12'/>
        </Link>
    </nav>
        
        <article className="bg-secondary-300 h-auto py-4 px-4 flex flex-col rounded-tl-md rounded-tr-md">

        <img src="/assets/logo.png" className='pb-4 w-12 h-15 flex self-center'/>
        <h2 className="text-primary-400 text-28 font-bold text-center font-fira-sans">KVITTO</h2>
        <p className="text-primary-400 font-bold font-fira-sans text-center mb-4">#4kjwsdf234k</p>
        

{filteredOrder.map((item) => (
  <article className="bg-secondary-300 h-auto flex-grow">
  <div className="flex flex-row justify-between">
      <h2 className="text-primary-400 text-22 font-bold font-fira-sans">{item.dishname.toUpperCase()}</h2>
      <h2 className="text-primary-400 text-22 font-bold font-fira-sans">{item.price * item.quantity} SEK</h2>
  </div>
          <p className='text-primary-400 text-[12px] font-fira-sans'>{item.quantity} stycken</p>

  
</article>
))}
        
        </article>  
 {/* TOTALT */}

 <article className='bg-primary-600 flex flex-row justify-between items-center p-4 mb-10 rounded-bl-md rounded-br-md'>
        <div className='flex flex-col'>
        <h2 className="text-primary-400 text-22 font-bold font-fira-sans">TOTALT</h2>
        <p className='text-primary-400 text-[12px] mt-2 font-fira-sans'>inkl 20% moms</p>
        </div>    
        
        <h2 className="text-primary-400 text-28 font-bold font-fira-sans">{totalPrice} SEK</h2>
</article>

        <Link to={"/"}>
            <Button
            variant="dark"
            >
            BESTÄLL MER
            </Button>
        </Link>

    </section>    
    </section>
    </>
  )
}

export default Receipt