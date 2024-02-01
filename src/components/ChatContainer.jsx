




export default function ({ active=false, extraClass="h-full w-full overflow-y-scroll scrollbar-thin", addClass, children}) {
    return (

        <div className={`${active ? "left-0" : "-left-[300vw]"} top-0 absolute ${extraClass} ${addClass} z-20  bg-blue-50 scrollbar-thin`}>
            {children}
        </div>
    );
    
}