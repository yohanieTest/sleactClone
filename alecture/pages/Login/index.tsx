import useInput from '@hooks/useInput';
import { Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
// import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import fetcher from '@utils/fetcher';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
    //revalidata - 원할 때 콜,
    //dedupingInterval 주기적으로 호출되지만 dedupingInterval 기간 내에는 캐시에서 불러옵니다.
    const { data, error, revalidate, mutate } = useSWR("http://localHost:3095/api/users", fetcher, {
        dedupingInterval: 100000,
    });
    const [logInError, setLogInError] = useState(false);
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');


    const onSubmit = useCallback((e) => {
        e.preventDefault();
        setLogInError(false);
        axios.post('http://localHost:3095/api/users/login',
            { email, password },
            {
                withCredentials: true
            }
        ).then((response) => {
            mutate(response.data, false);   //OPMISITIC UI
        }
        ).catch((error) => {
            setLogInError(error.respose?.data?.statusCode === 401);
        })

    }, [email, password]);

    if (data === undefined) {
        return <div>로딩중....</div>
    }


    if (data) {
        return <Redirect to={"/workspace/channel"} />
    }

    return (

        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                    </div>
                    {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
                </Label>
                <Button type="submit">로그인</Button>
            </Form>
            <LinkContainer>
                아직 회원이 아니신가요?&nbsp;
                <Link to="/signup">회원가입 하러가기</Link>
            </LinkContainer>
        </div>
    );
};

export default LogIn;
