const OrderDetail = ({ lineItems, total }) => {

    return (
        <div>
            {lineItems.map((item) => 
                <div>
                    <p>{item.productName}</p>
                    <p>{item.quantity}</p>
                    <p>{item.price}</p>
                    <p>{total}</p>
                </div>
            )}
        </div>
    );

}

export default OrderDetail;