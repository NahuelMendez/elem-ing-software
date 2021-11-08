const OrderDetail = ({ lineItems, total }) => {

    return (
        <div name="order-detail" className="mt-4">
            {lineItems.map((item) => 
                <table className="border-bottom margin-2 text-left order-table-dtl">
                    <tr>
                        <th>Producto: </th>
                        <td className="text-right">{item.productName}</td>
                    </tr>
                    <tr>
                        <th>Cantidad: </th>
                        <td className="text-right">{item.quantity}</td>
                    </tr>
                    <tr>
                        <th>Precio Por unidad: </th>
                        <td className="text-right">${item.price}</td>
                    </tr>
                </table>
            )}
            <p className="mt-4"><b>TOTAL: ${total}</b></p>
        </div>
    );

}

export default OrderDetail;