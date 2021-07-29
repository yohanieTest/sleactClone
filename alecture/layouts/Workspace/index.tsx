import React, { FC, useCallback, useState } from "react";
import useSWR from "swr";
import fetcher from '@utils/fetcher';
import axios from "axios";
import { Redirect, Route, Switch } from "react-router";
import { Header, ProfileImg, RightMenu, WorkspaceWrapper, Workspaces, Channels, Chats, WorkspaceName, MenuScroll, ProfileModal, LogOutButton } from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
import Menu from "@components/Menu";
//children 을 안 쓰면 타입은 VFC로 


const Channle = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC = ({ children }) => {
    const [showUserMenu, SetShowUserMenu] = useState(false);

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

    const onClickuserProfile = useCallback(() => {
        SetShowUserMenu((prev) => !prev)
    }, [])


    if (!data) {
        return <Redirect to={"/login"} />
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickuserProfile}>
                        <ProfileImg src={gravatar.url(data.nickname, { s: '28px', d: 'retro' })} alt={data.nickname} />
                        {showUserMenu &&
                            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickuserProfile}>
                                <ProfileModal>
                                    <img src={gravatar.url(data.nickname, { s: '36px', d: 'retro' })} alt={data.nickname} />
                                    <div>
                                        <span id="profile-name">{data.nickname}</span>
                                        <span id="profile-active">Active</span>
                                    </div>
                                </ProfileModal>
                                <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
                            </Menu>
                        }
                    </span>
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>워크페이스</Workspaces>
                <Channels>
                    <WorkspaceName>sleact</WorkspaceName>
                    <MenuScroll>menu Scroll</MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/channel" component={Channle} />
                        <Route path="/workspace/dm" component={DirectMessage} />
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            {children}
        </div>

    )
};

export default Workspace