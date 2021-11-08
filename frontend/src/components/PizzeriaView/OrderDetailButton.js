import { useState } from "react";
import Modal from "../Modal";
import OrderDetail from "./OrderDetail";

const OrderDetailButton = ({ orderNum, lineItems, total }) => {

    const [closedModal, setClosedModal] = useState(true)

    return (
        <>
            <button name="order-detail-button" onClick={() => setClosedModal(false)}>
                <b>. . .</b>
            </button>

            {   !closedModal &&
                    <Modal 
                        title={`Detalles del pedido ` + orderNum}
                        body={<OrderDetail 
                                lineItems={lineItems}
                                total={total}/>} 
                        handleClose={() => setClosedModal(true)}
                    />
            }
        </>
    );
}

export default OrderDetailButton;