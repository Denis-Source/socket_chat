import React from 'react';
import {RoomModel} from "../../../Molels/Room.model";
import {useDispatch, useSelector} from "react-redux";
import Item from "../Item/Item";
import {RoomStatements} from "../../../StatementsTypes/RoomStatements";
import useWebSocket from "react-use-websocket";
import {WSS_FEED_URL} from "../../../api";
import {leave} from "../../../Reducers/Room";

const List = () => {
    const {sendJsonMessage} = useWebSocket(WSS_FEED_URL, {
        share: true
    });

    const rooms: RoomModel[] = useSelector((state: any) => state.room.list);
    const current: RoomModel = useSelector((state: any) => state.room.current);
    const dispatch = useDispatch()

    return (
        <div>
            <h3>{current?.name || "no room selected"}{current &&
                <button onClick={async()=> {
                    dispatch(leave())
                    await sendJsonMessage({
                        type: "call",
                        payload: {
                            message: RoomStatements.LeaveRoom,
                        }
                    })
                }
                }>
                    leave
                </button>
            }</h3>
            <div>
                {rooms.map(room =>
                    <Item key={room.uuid} room={room}/>
                )}
            </div>
            <button onClick={async () => {
                await sendJsonMessage({
                    type: "call",
                    payload: {
                        message: RoomStatements.CreateRoom,
                    }
                })
            }}>
                create
            </button>
        </div>

    );
};

export default List;