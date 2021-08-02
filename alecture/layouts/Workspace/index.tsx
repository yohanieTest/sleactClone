import React, { VFC, useCallback, useState } from "react";
import useSWR from "swr";
import fetcher from '@utils/fetcher';
import axios from "axios";
import { Redirect, Route, Switch, useParams } from "react-router";
import { Header, ProfileImg, RightMenu, WorkspaceWrapper, Workspaces, Channels, Chats, WorkspaceName, MenuScroll, ProfileModal, LogOutButton, WorkspaceButton, AddButton, Label, WorkspaceModal } from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
import Menu from "@components/Menu";
import { Link } from "react-router-dom";
import { IChannel, IUser } from "@typings/db";
import { Button, Input } from "@pages/SignUp/styles";
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";
import { toast } from 'react-toastify'
import CreateChannelModal from "@components/CreateChannelModal";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal";
import InviteChannelModal from "@components/InviteChannelModal";

//children 을 안 쓰면 타입은 VFC로 


const Channle = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: VFC = () => {
    const [showUserMenu, SetShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);

    const [showWorkrspaceModal, setShowWorkrspaceModal] = useState(false);
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkSpace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    const { workspace } = useParams<{ workspace: string }>();

    const { data: userData, error, revalidate, mutate } = useSWR<IUser | false>("http://localHost:3095/api/users", fetcher, {
        dedupingInterval: 1000,
    });

    const { data: channelData } = useSWR<IChannel[]>
        (userData ? `http://localHost:3095/api/workspaces/${workspace}/channels` : null, fetcher,);

    const onLogOut = useCallback(() => {
        axios.post('http://localHost:3095/api/users/logout', null, {
            withCredentials: true
        }).then((response) => {
            mutate(false, false);
        })
    }, []);

    const onCloseUserProfile = useCallback((e) => {
        e.stopPropagation();
        SetShowUserMenu((prev) => !prev)
    }, []);

    const onClickUserProfile = useCallback(() => {
        SetShowUserMenu((prev) => !prev)
    }, []);

    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    }, []);

    const onCreateWorkspace = useCallback((e) => {
        e.preventDefault();
        if (!newWorkspace || !newWorkspace.trim()) return;
        if (!newUrl || !newUrl.trim()) return;
        axios.post('http://localHost:3095/api/workspaces', {
            workspace: newWorkspace,
            url: newUrl
        }, {
            withCredentials: true                                   //프론트 백 쿠키확인
        })
            .then(() => {
                revalidate();
                setShowCreateWorkspaceModal(false);
                setNewWorkSpace('');
                setNewUrl('');
            })
            .catch((error) => {
                console.dir(error);
                toast.error(error.response?.data, { position: 'bottom-center' });
            })
    }, [newWorkspace, newUrl]);

    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    }, []);

    const toggleWorkspaceModal = useCallback((e) => {
        setShowWorkrspaceModal((prev) => !prev);
    }, [])

    const onClickAddChannel = useCallback((e) => {
        setShowCreateChannelModal(true);
    }, []);

    const onClickInviteWorkspace = useCallback((e) => {
        setShowInviteWorkspaceModal(true);
    }, []);

    const onClickInviteChannel = useCallback((e) => {
        setShowInviteChannelModal(true);
    }, []);

    if (!userData) {
        return <Redirect to={"/login"} />
    }

    return (
        <div>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        <ProfileImg src={gravatar.url(userData.nickname, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                        {showUserMenu &&
                            <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                                <ProfileModal>
                                    <img src={gravatar.url(userData.nickname, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                                    <div>
                                        <span id="profile-name">{userData.nickname}</span>
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
                <Workspaces>
                    {userData.Workspaces && userData?.Workspaces.map((ws) => {
                        return (
                            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        )
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>sleact</WorkspaceName>
                    <MenuScroll>
                        <Menu show={showWorkrspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                            <WorkspaceModal>
                                <h2>Sleact</h2>
                                <button onClick={onClickInviteWorkspace}>워크스페이스초대</button>
                                <button onClick={onClickInviteChannel}>채널초대</button>
                                <button onClick={onClickAddChannel}>채널만들기</button>
                                <button onClick={onLogOut}>로그아웃</button>
                            </WorkspaceModal>
                        </Menu>
                        {channelData?.map((v) => {
                            return (
                                <div key={v.id}>{v.name}</div>
                            )
                        })}
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Switch>
                        <Route path="/workspace/:workspace/channel/:channel" component={Channle} />
                        <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
                    </Switch>
                </Chats>
            </WorkspaceWrapper>
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>워크스페이 이름</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                    </Label>
                    <Label id="workspace-url-label">
                        <span>워크스페이 url</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
            <CreateChannelModal
                show={showCreateChannelModal}
                onCloseModal={onCloseModal}
                setShowCreateChannelModal={setShowCreateChannelModal}
            />
            <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModal} setShowInviteWorkspaceModal={setShowInviteWorkspaceModal} />
            <InviteChannelModal show={showInviteChannelModal} onCloseModal={onCloseModal} setShowInviteChannelModal={setShowInviteChannelModal} />
        </div >

    )
};

export default Workspace