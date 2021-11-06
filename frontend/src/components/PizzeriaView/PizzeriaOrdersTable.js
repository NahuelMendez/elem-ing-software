import Modal from "../Modal";
import OrderDetail from "./OrderDetail";
import OrderDetailButton from "./OrderDetailButton";
import PizzeriaOrderDataRow from "./PizzeriaOrderDataRow";

const PizzeriaOrdersTable = ({ orders }) => {
    return (
        <>
            <PizzeriaOrderDataRow 
                orderNum="Numero De Pedido"
                customerName="Nombre Del Cliente"
                telephone="Telefono"
                email="Email"
                total="TOTAL"
                details="Detalles"
                top={true}
            />
            {
                orders.map(order => 
                    <PizzeriaOrderDataRow 
                        key={order.orderNumber}
                        orderNum={order.orderNumber}
                        customerName={order.consumerName}
                        telephone={order.telephone}
                        email={order.email}
                        total={order.total}
                        details={<OrderDetailButton
                                    lineItems={order.lineItems}
                                    total={order.total}
                                />}
                        top={false}
                    />
                )
            }
        </>
    );
}

export default PizzeriaOrdersTable;
