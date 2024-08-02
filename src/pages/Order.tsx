import { Link } from 'react-router-dom'
import Button from '../components/Button'

const Order = () => {
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

{/* meny komponent */}

    <article className="bg-secondary-300 h-auto flex-grow">
            <div className="flex flex-row justify-between">
                <h2 className="text-primary-400 text-22 font-bold font-fira-sans">KARLSTAD</h2>
                <h2 className="text-primary-400 text-22 font-bold font-fira-sans">70 SEK</h2>
            </div>
            
           {/* Lägg till komponent */}
            
            <div className='flex flex-row items-end gap-2'>
                <div className='bg-primary-500 rounded-full w-4 h-4 flex justify-center items-center transition duration-300 ease-in-out transform hover:bg-primary-400 cursor-pointer'>
                    <i className="fa-solid fa-plus text-white text-[8px]"></i>
                </div>
                    
                    <p className='text-primary-400 text-[12px] mt-2 font-fira-sans'>3 stycken</p>
                
                <div className='bg-primary-500 rounded-full w-4 h-4 flex justify-center items-center transition duration-300 ease-in-out transform hover:bg-primary-400 cursor-pointer'>
                <i className="fa-solid fa-minus text-white text-[8px]"></i>
                </div>
            </div>
            
            {/* Lägg till komponent slut */}
           
            
            <div className="border-t-2 border-dotted border-primary-400 mt-4"></div>
        </article>

        {/* Meny komponent slut*/}

        {/* TOTALT */}

        <article className='bg-primary-600 flex flex-row justify-between items-center p-4 my-4 rounded-md'>
        <div className='flex flex-col'>
        <h2 className="text-primary-400 text-22 font-bold font-fira-sans">TOTALT</h2>
        <p className='text-primary-400 text-[12px] mt-2 font-fira-sans'>inkl 20% moms</p>
        </div>    
        
        <h2 className="text-primary-400 text-28 font-bold font-fira-sans">101 sek</h2>
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