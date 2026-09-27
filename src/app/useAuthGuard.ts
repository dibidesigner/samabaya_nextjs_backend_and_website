// hooks/useAuthGuard.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch,useAppSelector } from "@/redux/hook/hooks";
import { tokenSliceapicall } from "@/redux/token";

export const useAuthGuard = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { token, tokenloading} = useAppSelector((state) => state.tokenSlice);


  useEffect(() => {
    dispatch(tokenSliceapicall());
  }, [dispatch]);

  
  useEffect(() => {
    if (!token?.success) {
      router.replace("/");
    }
  }, [token, router]);

  return { token, tokenloading};
};
