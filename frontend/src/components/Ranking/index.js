import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import api from "../../Api/ApiObject";
import RankingCard from "./RankingCard";

const Ranking = () => {
  const [rankingResult, setRankingResult] = useState([])

  useEffect(() => {
    api.getRanking().then(res => {
      setRankingResult(res.data)
    })
  }, [])

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1
    }
  };

  return (
    <div className="w-full mt-8 flex justify-center">
      {rankingResult.length !== 0 &&
        <div name="carousel-ranking" className="w-2/3">
          <Carousel
            swipeable={false}
            draggable={false}
            responsive={responsive}
            autoPlaySpeed={1000}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
          >
            {rankingResult.map((rankPosition, index) => {
              console.log(rankPosition.product)
              return (
              <RankingCard 
                key={index} 
                name={rankPosition.product.name} 
                pizzeriaName={rankPosition.pizzeria.name} 
                rankingNumber={index + 1} 
                pizzaImage={rankPosition.product.imageURL}
              />
            )})}
          </Carousel>
        </div>
      }
    </div>
  )
}

export default Ranking