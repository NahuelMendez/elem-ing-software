const OrderDetail = ({ lineItems, total }) => {

    return (
        <div>
            {lineItems.map((item) => 
                <div className="border">
                    <p><b>Producto: </b>{item.productName}</p>
                    <p><b>Cantidad: </b>{item.quantity}</p>
                    <p><b>Precio Por unidad: </b>{item.price}</p>
                </div>
            )}
            <p><b>TOTAL: </b>{total}</p>
        </div>
    );

}

export default OrderDetail;