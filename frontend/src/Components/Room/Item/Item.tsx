import React, {useState} from 'react';
import {RoomModel} from "../../../Molels/Room.model";
import {enter} from "../../../Reducers/Room";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "../../../api";
import {RoomStatements} from "../../../StatementsTypes/RoomStatements";
import {useDispatch} from "react-redux";

const Item = ({room}: { room: RoomModel }) => {
    const {sendJsonMessage} = useWebSocket(WSS_FEED_URL, {
        share: true
    });
    const [focus, setFocus] = useState<boolean>(false);
    const [enteredName, setEnteredName] = useState<string>(room.name);
    const dispatch = useDispatch()

    if (!focus && enteredName != room.name) {
        setEnteredName(room.name)
    }

    return (
        <div>
            <button onClick={async () => {
                dispatch(enter(room));
                await sendJsonMessage({
                    type: "call",
                    payload: {
                        message: RoomStatements.EnterRoom,
                        uuid: room.uuid
                    }
                });
            }}>
                enter
            </button>
            <input
                value={enteredName}
                onFocus={() => {
                    setFocus(true);
                }}
                onBlur={() => {
                    setFocus(false);
                }}
                onChange={async (event) => {
                    setEnteredName(event.target.value);
                    await sendJsonMessage({
                        type: "call",
                        payload: {
                            message: RoomStatements.ChangeRoomName,
                            uuid: room.uuid,
                            name: event.target.value
                        }
                    })
                }}/>
            <button onClick={async () => {
                await sendJsonMessage({
                    type: "call",
                    payload: {
                        message: RoomStatements.DeleteRoom,
                        uuid: room.uuid
                    }
                })
            }}
            >
                x
            </button>
        </div>
    );
};

export default Item;