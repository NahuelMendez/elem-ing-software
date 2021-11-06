const PizzeriaOrderDataRow = ({ orderNum, customerName, telephone, email, total, details, top }) => {
    return (
        <>
            <div className="container" >
                <div className="row">
                    <div className={top ? "col" : "col oders-table-top"}>
                        {orderNum}
                    </div>
                    <div className={top ? "col" : "col oders-table-top"}>
                        {customerName}
                    </div>
                    <div className={top ? "col" : "col oders-table-top"}>
                        {telephone}
                    </div>
                    <div className={top ? "col" : "col oders-table-top"}>
                        {email}
                    </div>
                    <div className={top ? "col" : "col oders-table-top"}>
                        {total}
                    </div>
                    <div className={top ? "col" : "col oders-table-top"}>
                        {details}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PizzeriaOrderDataRow; 