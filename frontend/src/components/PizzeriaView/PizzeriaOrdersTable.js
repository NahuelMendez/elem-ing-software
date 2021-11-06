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
                        orderNum={order.orderNumber}
                        customerName={order.consumerName}
                        telephone={order.telephone}
                        email={order.email}
                        total={order.total}
                        details={order.orderNumber}
                        top={false}
                    />
                )
            }
        </>
    );
}

export default PizzeriaOrdersTable;
