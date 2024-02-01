

export default function({ icon = "chat", extraClass="h-[40px] w-[40px]", color="bg-gray-50", ...props}) {

    return (
        <i className={`bi bi-${icon} ${extraClass} rounded-full ${color} shadow flex items-center justify-center`} {...props}></i>
    );
}