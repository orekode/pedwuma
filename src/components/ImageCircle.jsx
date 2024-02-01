



export default function ({ image="/images/pedwuma.jpg", extraClass=" h-[50px] w-[50px] ", ...props}) {
    return (
        <div className={`${extraClass} rounded-full shadow overflow-hidden`} {...props}>
            <img src={image} className="h-full w-full object-cover" />
        </div>
    );
}