const PizzeriaOrderDataRow = ({ orderNum, customerName, telephone, email, total, details, top }) => {

    const ordersTableTop = "col oders-table-top text-center";
    const orderTableCell = "col oders-table-cell text-center"

    return (
        <>
            <div className={top ? "container mt-10" : "container"} >
                <div className="row shadow-2xl">
                    <div className={top ? ordersTableTop + " left-t-top" : orderTableCell}>
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
                    <div className={top ? ordersTableTop + " right-t-top" : orderTableCell}>
                        {details}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PizzeriaOrderDataRow; 