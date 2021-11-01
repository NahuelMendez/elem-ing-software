const NoOrdersMessage = () =>
    <div>Aun no realizaste pedidos</div>

const OrdersHistoryListItem = ({pizzeriaName, total}) =>
    <li className="card">
        <div className="card-body">
            <div className="p-1"><strong>Pizzeria:</strong> { pizzeriaName }</div>
            <div className="p-1"><strong>Precio total:</strong> ${ total }</div>
        </div>
    </li>

const OrdersHistoryList = ({ ordersHistory }) =>
    <ul>
        { ordersHistory.map(OrdersHistoryListItem) }
    </ul>


const OrdersHistory = ({ ordersHistory }) =>
    <div name="orders-history" className="flex flex-column items-center">
        <h2>Orders history</h2>
        { ordersHistory.length === 0
                ? <NoOrdersMessage />
                : <OrdersHistoryList ordersHistory={ordersHistory}/> }
    </div>

export default OrdersHistory