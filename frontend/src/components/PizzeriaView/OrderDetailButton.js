import { useState } from "react";
import Modal from "../Modal";
import OrderDetail from "./OrderDetail";

const OrderDetailButton = ({ lineItems, total }) => {

    const [closedModal, setClosedModal] = useState(true)

    return (
        <>
            <button onClick={() => setClosedModal(false)}>
                . . .
            </button>

            {   !closedModal &&
                    <Modal 
                        title="Detalles"
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