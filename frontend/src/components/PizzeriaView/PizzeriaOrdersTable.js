import PizzeriaOrderDataRow from "./PizzeriaOrderDataRow";

const PizzeriaOrdersTable = () => {
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
        </>
    );
}

export default PizzeriaOrdersTable;
