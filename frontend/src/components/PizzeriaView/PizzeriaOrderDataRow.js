const PizzeriaOrderDataRow = ({ orderNum, customerName, telephone, email, total, details, top }) => {

    const ordersTableTop = "col oders-table-top text-center";
    const orderTableCell = "col oders-table-cell text-center"

    return (
        <>
            <div className={top ? "container mt-10" : "container"} >
                <div className="row order-data-row">
                    <div className={top ? ordersTableTop : orderTableCell}>
                        {orderNum}
                    </div>
                    <div className={top ? ordersTableTop : orderTableCell}>
                        {customerName}
                    </div>
                    <div className={top ? ordersTableTop : orderTableCell}>
                        {telephone}
                    </div>
                    <div className={top ? ordersTableTop : orderTableCell}>
                        {email}
                    </div>
                    <div className={top ? ordersTableTop : orderTableCell}>
                        {total}
                    </div>
                    <div className={top ? ordersTableTop : orderTableCell}>
                        {details}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PizzeriaOrderDataRow; 