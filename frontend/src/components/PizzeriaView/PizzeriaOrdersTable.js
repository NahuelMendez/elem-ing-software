import OrderDetailButton from "./OrderDetailButton";
import PizzeriaOrderDataRow from "./PizzeriaOrderDataRow";

const PizzeriaOrdersTable = ({ orders }) => {

    if (orders.length == 0) {
        return ( <h2 name="no-orders" className="text-center mt-10">Todavia no recibiste pedidos.</h2> );
    } else {
        return (
            <div name="orders-table">
                <PizzeriaOrderDataRow 
                    orderNum="Numero De Pedido"
                    customerName="Nombre Del Cliente"
                    telephone="Telefono"
                    email="Email"
                    total="TOTAL"
                    details="Detalles"
                    top={true}
                />
                <div name="orders-recieved">
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
                                            orderNum={order.orderNumber}
                                            lineItems={order.lineItems}
                                            total={order.total}
                                        />}
                                top={false}
                            />
                        )
                    }
                </div>
            </div>
        );
    }
}

export default PizzeriaOrdersTable;
