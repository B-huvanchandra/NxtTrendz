import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const jwtToken = Cookies.get('jwt_token')

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: [],
    apiRequestStatus: apiStatusConstants.initial,
    count: 1,
  }

  componentDidMount() {
    this.getProductInfo()
  }

  getProductInfo = async () => {
    const {match} = this.props
    const {params} = match

    this.setState({apiRequestStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/products/${params.id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok) {
      const {title, description, brand, rating, availability, price} = data
      const updatedData = {
        title,
        imageUrl: data.image_url,
        description,
        brand,
        totalReviews: data.total_reviews,
        rating,
        availability,
        price,
        similarProducts: data.similar_products.map(eachItem => ({
          brand: eachItem.brand,
          id: eachItem.id,
          imageUrl: eachItem.image_url,
          price: eachItem.price,
          rating: eachItem.rating,
          title: eachItem.title,
        })),
      }
      this.setState({
        productDetails: updatedData,
        apiRequestStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiRequestStatus: apiStatusConstants.failure})
    }
  }

  increaseCount = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  decreaseCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState({count: count - 1})
    }
  }

  continueShoppingBtn = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderproductsDetails = () => {
    const {productDetails, count} = this.state
    console.log(productDetails)
    const {
      imageUrl,
      title,
      price,
      totalReviews,
      rating,
      description,
      availability,
      brand,
      similarProducts,
    } = productDetails

    return (
      <>
        <div className="product-item-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div>
            <h1 className="title">{title}</h1>
            <p className="price">Rs.{price}/-</p>
            <div className="ratings-and-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>
              <p>{totalReviews} reviews</p>
            </div>
            <p className="description-text">{description}</p>
            <span className="availabitlity-info">
              Availability:
              <p className="availability-status">{availability}</p>
            </span>
            <span className="availabitlity-info">
              Brand: <p className="availability-status">{brand}</p>
            </span>
            <hr className="end-line" />

            <div className="add-or-remove-container">
              <button
                data-testid="plus"
                type="button"
                className="square-btn"
                aria-label="Increase Count"
                onClick={this.increaseCount}
              >
                <BsPlusSquare className="cart-btn" />
              </button>

              <p className="count">{count}</p>
              <button
                data-testid="minus"
                className="square-btn"
                type="button"
                aria-label="Decrease Count"
                onClick={this.decreaseCount}
              >
                <BsDashSquare className="cart-btn" />
              </button>
            </div>
            <button type="button" className="add-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-product-list">
          {similarProducts !== undefined
            ? similarProducts.map(eachItem => (
                <SimilarProductItem eachItem={eachItem} key={eachItem.id} />
              ))
            : ''}
        </ul>
      </>
    )
  }

  renderLoadingPage = () => (
    <div data-testid="loader" className="loader-style">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailurePage = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1 className="not-found-text">Product Not Found</h1>
      <button
        className="continue-btn"
        type="button"
        onClick={this.continueShoppingBtn}
      >
        Continue Shopping
      </button>
    </div>
  )

  displayProductDetailsPage = () => {
    const {apiRequestStatus} = this.state
    console.log(apiRequestStatus === apiStatusConstants.success)

    switch (apiRequestStatus) {
      case apiStatusConstants.success:
        console.log(apiRequestStatus)
        return this.renderproductsDetails()
      case apiStatusConstants.failure:
        return this.renderFailurePage()
      case apiStatusConstants.inProgress:
        return this.renderLoadingPage()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="details-bg-container">
          {this.displayProductDetailsPage()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
