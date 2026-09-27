import { useRouter } from "next/navigation";


const useProduct =()=>{
    const router = useRouter();


    const openSingleDetails=(itemid:any)=>{
        router.push(`/pages/Producdivetails/${itemid}`)
    }

    return {openSingleDetails}
}

export default useProduct