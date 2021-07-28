import { Dispatch, SetStateAction, useCallback, useState } from "react"

type ReturnType<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];

const useInput = <T = any>(initData: T): ReturnType<T> => {
    const [value, setValue] = useState(initData);
    const handler = useCallback((e: any) => {
        setValue(e.target.value);
    }, []);
    return [value, handler, setValue];
};

export default useInput;


//any 대신 ChangeEvent<HTMLInputElement>,
//e.target.value 대신 e.target.value as unKnown as T 넣으면 해결