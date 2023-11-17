import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'

export default function Header(props) {

  const [top, setTop] = useState(true)
  const navigate = useNavigate()

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.scrollY > 10 ? setTop(false) : setTop(true)
  }  

  useEffect(() => {
    scrollHandler()
    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [top])

  return (
    <header className={`fixed w-full z-30 transition duration-300 ease-in-out ${!top ? 'backdrop-blur-xl shadow-lg' : 'backdrop-blur-sm'}`}>
      <div className="max-w-8xl">
        <div className={`flex items-center justify-between h-[10px] p-2 mx-[4rem] my-6 ${!top ? 'backdrop-blur-sm shadow-lg' : ''}`}>
          {/* Site branding */}
          <div className="flex align-center sm:align-start mx-auto">
            <svg className="w-7 h-7" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <defs>
              <radialGradient cx="21.152%" cy="86.063%" fx="21.152%" fy="86.063%" r="79.941%" id="footer-logo">
                <stop stopColor="#FFA500" offset="0%" />
                <stop stopColor="#FFA500" offset="25.871%" />
                <stop stopColor="#008080" offset="100%" />
              </radialGradient>
              </defs>
              <rect width="32" height="32" rx="16" fill="url(#footer-logo)" fillRule="nonzero" />
            </svg>
            <h1 className='ml-3 mb-1 text-lg font-extrabold text-white'>marcus.</h1>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex row grow justify-end flex-wrap items-center p-4">
            </ul>

          </nav>

          {/* <MobileMenu /> */}

        </div>
      </div>
    </header>
  )
}
