const NoOrdersMessage = () =>
  <p className="text-gray-500">Aún no realizaste pedidos</p>

const OrdersHistoryList = ({ ordersHistory }) =>
  <table className="mt-4 w-4/5">
    <tr className="border-b border-gray-500">
      <th className="p-2 text-center">Nombre de pizzeria</th>
      <th className="border-l border-gray-500 p-2 text-center">Precio total</th>
    </tr>
    {ordersHistory.map((order, index) => (
      <tr className={index !== ordersHistory.length - 1 && "border-b border-gray-500"}>
        <td align="center" className="p-2">{order.pizzeriaName}</td>
        <td align="center" className="border-l border-gray-500 p-2">{order.total}</td>
      </tr>
    ))}
  </table>

const OrdersHistory = ({ ordersHistory }) =>
  <div name="orders-history" className="flex flex-column items-center w-1/2 mt-8">
    <h2>Historial de pedidos</h2>
    {ordersHistory.length === 0
      ? <NoOrdersMessage />
      : <OrdersHistoryList ordersHistory={ordersHistory} />}
  </div>

export default OrdersHistory