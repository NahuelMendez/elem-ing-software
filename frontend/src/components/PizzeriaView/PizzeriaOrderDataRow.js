const PizzeriaOrderDataRow = ({ orderNum, customerName, telephone, email, total, details, top }) => {

    const ordersTableTop = "col oders-table-top text-center";
    const orderTableCell = "col oders-table-cell text-center"

    return (
        <>
            <table className={top ? "container mt-10" : "container"} >
                <tr className="row shadow-2xl">
                    <td className={top ? ordersTableTop + " left-t-top" : orderTableCell}>
                        {orderNum}
                    </td>
                    <td className={top ? ordersTableTop : orderTableCell}>
                        {customerName}
                    </td>
                    <td className={top ? ordersTableTop : orderTableCell}>
                        {telephone}
                    </td>
                    <td className={top ? ordersTableTop : orderTableCell}>
                        {email}
                    </td>
                    <td className={top ? ordersTableTop : orderTableCell}>
                        {total}
                    </td>
                    <td className={top ? ordersTableTop + " right-t-top" : orderTableCell}>
                        {details}
                    </td>
                </tr>
            </table>
        </>
    );
}

export default PizzeriaOrderDataRow; 