const RankingCard = ({ name, pizzeriaName, rankingNumber, pizzaImage }) => {

  return (
    <div className="card mt-0 mr-0 w-2/3 h-64 product-container ranking-card">
      <div className="flex justify-end">
        <div className="ranking-image-container">
          <img className="ranking-image" src={pizzaImage}></img>
        </div>
        <div className="bg-principal mt-2 mr-2 rounded-full flex items-center justify-center w-10 h-10">
          <p name="ranking-number" className="text-white text-xl font-bold m-0 p-0 text-center">{rankingNumber}</p>
        </div>
      </div>
      <div className="card-body">
        <h2 name="product-ranking-name" className="card-tittle">{name}</h2>
        <p name="product-ranking-pizzeriaName" className="card-text text-secondary">{pizzeriaName}</p>
      </div>
    </div>
  )
}

export default RankingCard;