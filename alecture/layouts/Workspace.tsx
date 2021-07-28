import React, { FC, useCallback } from "react";
import useSWR, { mutate } from "swr";
import fetcher from '@utils/fetcher';
import axios from "axios";
import { Redirect } from "react-router";

//children 을 안 쓰면 타입은 VFC로 
const Workspace: FC = ({ children }) => {
    const { data, error, revalidate, mutate } = useSWR("http://localHost:3095/api/users", fetcher, {
        dedupingInterval: 100000,
    });

    const onLogOut = useCallback(() => {
        axios.post('http://localHost:3095/api/users/logout', null, {
            withCredentials: true
        }).then((response) => {
            mutate(false, false);
        })
    }, [])


    if (!data) {
        return <Redirect to={"/login"} />
    }

    return (
        <div>
            <button onClick={onLogOut}>로그아웃</button>
            {children}
        </div>

    )
};

export default Workspace