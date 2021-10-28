const NoOrdersMessage = () =>
    <div>'Aun no realizaste pedidos'</div>

const OrdersHistoryListItem = ({pizzeriaName, total}) =>
    <li className="flex flex-inline">
        <div className="p-1"><strong>Pizzeria:</strong> { pizzeriaName }</div>
        <div className="p-1"><strong>Precio total:</strong> ${ total }</div>
    </li>

const OrdersHistoryList = ({ ordersHistory }) =>
    <ul>
        { ordersHistory.map(OrdersHistoryListItem) }
    </ul>


const OrdersHistory = ({ ordersHistory }) =>
    <div name="orders-history">
        { ordersHistory.length === 0
                ? <NoOrdersMessage />
                : <OrdersHistoryList ordersHistory={ordersHistory}/> }
    </div>

export default OrdersHistory