import React from 'react'
import Button from '../components/UI/Button'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
      <div className='h-[100dvh] w-screen flex bg-slate-100 items-center'>

        <div className='flex flex-col mx-5 sm:ml-20 md:ml-48 lg:ml-96 lg:w-2/5 ' >
          <h1 className=' text-6xl font-bold text-slate-800 mb-12 ' >Uppsss... 404</h1>
          <h3  className='text-3xl my-6 text-slate-800 ' >Pagina no encontrada</h3>
          <span className='text-lg text-slate-800 ' >
            Compruebe si el término de búsqueda es correcto. Si cree que se trata de un error, póngase en contacto con el 
            <a href="mailto:niko2000gb@gmail.com" className='underline hover:text-primary-500' > desarrollador. </a> <br />
            <span className='text-primary-400 font-bold ' > ¡Gracias! </span>
          </span>
          <Link to="/" >
            <Button
              className="mt-6"
              label="Ir al inicio"
            />
          </Link>
        </div>

      </div>
    </>
  )
}

export default NotFound