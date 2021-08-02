import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import axios from 'axios';
import { string } from 'prop-types';
import React, { VFC, useState } from 'react';
import { useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IChannel, IUser } from "@typings/db";
import fetcher from '@utils/fetcher';


interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
    //파라미터를 useparams로 가져올 수 있다.
    const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

    const { data: userData, error, revalidate, mutate } = useSWR<IUser | false>("http://localHost:3095/api/users", fetcher, {
        dedupingInterval: 1000,
    });

    const { data: channelData, revalidate: revalidateChannel } = useSWR<IChannel[]>(userData ? `http://localHost:3095/api/workspaces/${workspace}/channels` : null, fetcher,);

    const onCreateChannel = useCallback((e) => {
        e.preventDefault();
        axios.post(`http://localHost:3095/api/workspaces/${workspace}/channels`, {
            name: newChannel,
        }, {
            withCredentials: true,
        }).then(() => {
            revalidateChannel();
            setShowCreateChannelModal(false);
            setNewChannel('');
        }).catch((error) => {
            console.dir(error);
            toast.error(error.response?.data, { position: 'bottom-center' })
        })
    }, [newChannel]);



    return (
        <Modal show={show} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="workspace-label">
                    <span>채널</span>
                    <Input id="workspace" value={newChannel} onChange={onChangeNewChannel} />
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    )
};

export default CreateChannelModal;