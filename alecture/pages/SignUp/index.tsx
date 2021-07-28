import useInput from "@hooks/useInput";
import React, { useState, useCallback } from "react";
import { Form, Label, Input, LinkContainer, Button, Header, Error, Success } from "./styles";
import axios from "axios";

const SignUp = () => {
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
            axios.post('/api/users', {
                email,
                nickname,
                password,
            }).then((response) => {
                setSignUpSuccess(true);
            })
                .catch((error) => {
                    setSignUpError(error.response.data);
                })
                .finally(() => { });
        }
    }, [email, nickname, password, passwordCheck]);


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
                <Label id="nickname-label">
                    <span>닉네임</span>
                    <div>
                        <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
                    </div>
                </Label>
                <Label id="password-check-label">
                    <span>비밀번호 확인</span>
                    <div>
                        <Input
                            type="password"
                            id="password-check"
                            name="password-check"
                            value={passwordCheck}
                            onChange={onChangePasswordCheck}
                        />
                    </div>
                    {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
                    {nickNameError && <Error>닉네임을 입력해주세요.</Error>}
                    {signUpError && <Error>{signUpError}</Error>}
                    {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
                </Label>
                <Button type="submit">회원가입</Button>
            </Form>
            <LinkContainer>
                이미 회원이신가요?&nbsp;
                <a href="/login">로그인 하러가기</a>
            </LinkContainer>
        </div>
    )
}

export default SignUp;