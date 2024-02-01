import Swal from "sweetalert2";


export const errorAlert = ({title="", text="", ...props}) => {

    return Swal.fire({
        icon: 'error',
        ...props,
        title: '<div class="orb">' + title + '</div>',
        text: text,
        confirmButtonColor: '#0064ff',
    })
}


export const deleteAlert = async () => {
    const result = await errorAlert({
        icon: 'warning',
        title: "Are You Sure",
        text: "This action can't be reverted",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    return result.isConfirmed;
}