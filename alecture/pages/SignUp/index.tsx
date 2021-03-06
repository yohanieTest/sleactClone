import useInput from "@hooks/useInput";
import React, { useState, useCallback } from "react";
import { Form, Label, Input, LinkContainer, Button, Header, Error, Success } from "./styles";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import useSWR from "swr";
import fetcher from "@utils/fetcher";

const SignUp = () => {
    const { data, error, revalidate } = useSWR("http://localHost:3095/api/users", fetcher, {
        dedupingInterval: 1000,
    });

    const [email, onChangeEmail] = useInput('');
    const [nickname, setNickName] = useState('');
    const [password, , setPassword] = useInput('');
    const [passwordCheck, , setPasswordCheck] = useInput('')
    const [mismatchError, setMismatchError] = useState(false);
    const [signUpError, setSignUpError] = useState('');
    const [signUpSuccess, setSignUpSuccess] = useState(false);
    const [nickNameError, setNickNameError] = useState(false);

    const onChangeNickname = useCallback((e) => {
        setNickName(e.target.value);
        setNickNameError(false);
    }, [])

    const onChangePassword = useCallback((e) => {
        setPassword(e.target.value);
        if (passwordCheck) {
            setMismatchError(e.target.value !== passwordCheck);
        }
    }, [passwordCheck]);

    const onChangePasswordCheck = useCallback((e) => {
        setPasswordCheck(e.target.value);
        setMismatchError(e.target.value !== password);
    }, [password]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        setSignUpError('');
        setSignUpSuccess(false);
        if (!nickname) {
            setNickNameError(true);
        }

        if (!mismatchError && nickname) {
            axios.post('http://localHost:3095/api/users', {
                email,
                nickname,
                password,
            }).then((response) => {
                setSignUpSuccess(true);
            }).catch((error) => {
                setSignUpError(error.response.data);
            }).finally(() => { });
        }
    }, [email, nickname, password, passwordCheck]);


    if (data === undefined) {
        return <div>?????????....</div>
    }

    if (data) {
        return <Redirect to={"/workspace/sleact/channel/??????"} />
    }

    return (
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>????????? ??????</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
                    </div>
                </Label>
                <Label id="nickname-label">
                    <span>?????????</span>
                    <div>
                        <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>????????????</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                    </div>
                </Label>
                <Label id="password-check-label">
                    <span>???????????? ??????</span>
                    <div>
                        <Input
                            type="password"
                            id="password-check"
                            name="password-check"
                            value={passwordCheck}
                            onChange={onChangePasswordCheck}
                        />
                    </div>
                    {mismatchError && <Error>??????????????? ???????????? ????????????.</Error>}
                    {nickNameError && <Error>???????????? ??????????????????.</Error>}
                    {signUpError && <Error>{signUpError}</Error>}
                    {signUpSuccess && <Success>???????????????????????????! ?????????????????????.</Success>}
                </Label>
                <Button type="submit">????????????</Button>
            </Form>
            <LinkContainer>
                ?????? ???????????????????&nbsp;
                <Link to="/login">????????? ????????????</Link>
            </LinkContainer>
        </div>
    )
}

export default SignUp;