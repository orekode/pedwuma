

export default function({ image, classname="h-max", children, imageClass="object-cover", childrenClass, ...props}) {
    return (
        <div className={`${classname} relative`} {...props}>
            <div className="absolute top-0 left-0 h-full w-full z-0">
                <img src={image} className={`${imageClass} h-full w-full`} />
            </div>

            <div className={`relative z-10`}>
                {children}
            </div>
        </div>
    );
}