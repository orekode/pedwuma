
import { useRef } from 'react';

export default function ({ children , showBlur=false}) {
  const scrollRef = useRef();

  const handleScroll = (direction = 'left') => {
    let sign = direction == 'left' ? -1 : 1;
    scrollRef.current.scrollLeft += sign * 500;
  }


  return (
    <div className="relative">
        <div onClick={() => handleScroll()} className={`absolute ${showBlur ? 'backdrop-blur-lg' : ''} top-0 left-0 h-full w-[70px] flex items-center justify-center z-10`}>
            <div className={`flex items-center justify-center rounded-full h-[40px] w-[40px] ${showBlur ? 'bg-white' : 'bg-white'} bg-opacity-40 backdrop-blur shadow-xl `}>
                <i className="bi bi-chevron-left"></i>
            </div>
        </div>
        <div onClick={() => handleScroll('right')} className={`absolute ${showBlur ? 'backdrop-blur-lg' : ''} top-0 right-0 h-full w-[70px] flex items-center justify-center z-10`}>
            <div className={`flex items-center justify-center rounded-full h-[40px] w-[40px] ${showBlur ? 'bg-white' : 'bg-white'} bg-opacity-40 backdrop-blur shadow-xl  `}>
                <i className="bi bi-chevron-right"></i>
            </div>
        </div>
        <div ref={scrollRef} className="overflow-x-scroll overflow-y-visible relative z-0 scrollbar scrollbar-thin scrollbar-rounded scroll-smooth">
            <div className={`w-max flex  gap-4 py-2 ${showBlur ? 'px-[0px]' : 'mx-auto px-[0px]'}`}>
                {children}
            </div>
        </div>
    </div>
  )
}

