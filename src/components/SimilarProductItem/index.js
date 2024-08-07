import './index.css'

const SimilarProductItem = props => {
  const {eachItem} = props
  const {brand, imageUrl, price, rating, title} = eachItem
  return (
    <li className="similar-product-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <p className="product-title">{title}</p>
      <p className="product-brand">by {brand}</p>
      <div className="price-and-ratings-container">
        <p className="price similar-price">Rs.{price}/-</p>
        <div className="smr-products-rating-container">
          <p className="rating-text">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
