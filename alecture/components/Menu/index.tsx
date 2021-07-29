import { CloseModalButton, CreateMenu } from "./styled"
import React, { FC, useCallback } from "react"
import { CSSProperties } from "react";

interface Props {
    show: boolean;
    onCloseModal: () => void;
    style: CSSProperties;
    closeButton?: boolean;
}

const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {

    const stopPropagation = useCallback((e) => {
        e.stopPropagation();
    }, [])

    return (
        <CreateMenu onClick={onCloseModal}>
            <div style={style} onClick={stopPropagation}>
                {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
                {children}
            </div>
        </CreateMenu>
    );
};

// props 기본값
Menu.defaultProps = {
    closeButton: true,
};

export default Menu;