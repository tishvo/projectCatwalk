import React from 'react';
import axios from 'axios';

import RPCard from './RPCard.jsx';
import Arrow from './Arrow.jsx';

class RelatedProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProduct: {},

      allRelated: [],
      visibleRelated: [],
      firstCard: 0,
      lastCard: 4,
      lastIndex: 0
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(this.props.currentItem !== prevProps.currentItem) { this.componentDidMount(); }
  }

  componentDidMount() {
    var itemId = this.props.currentItem['id'];
    // get those items
    axios.get(`/products/${itemId}/related`)
      .then(res => {

        this.setState({
          allRelated: res.data,
          lastIndex: res.data.length,
          currentProduct: this.props.currentItem,
          firstCard: 0,
          lastCard: 4
        }, () => {
          // console.log(this.state);
          this.setState({
            visibleRelated: this.state.allRelated.slice(this.state.firstCard, this.state.lastCard)
          })
        })
      })
      .catch(err => {
        console.log('/RELATED GET ERROR: ', err)
      })

  }
  // Arrow Functionality
  previousSlide () {
    // console.log('clicked previous slide');
    const lastIndex = this.state.allRelated.length - 1;
    if (this.state.firstCard > 0) {
      this.setState({
        firstCard: this.state.firstCard -1,
        lastCard: this.state.lastCard -1
      }, () => {
        this.setState({
          visibleRelated: this.state.allRelated.slice(this.state.firstCard, this.state.lastCard)
        });
      });
    }
  }
  // Arrow Functionality
  nextSlide () {
    // console.log('clicked next slide');
    const lastIndex = this.state.allRelated.length - 1;
    if (this.state.lastCard <= lastIndex) {
      this.setState({
        firstCard: this.state.firstCard +1,
        lastCard: this.state.lastCard +1,
      }, () => {
        this.setState({
          visibleRelated: this.state.allRelated.slice(this.state.firstCard, this.state.lastCard),
        });
      });
    }
  }

  renderList () {
    return (
      this.state.visibleRelated.map( (relatedItem, index) =>
        <RPCard itemId={relatedItem} key={index} click={this.props.click} currentProduct={this.state.currentProduct} />
      )
    )
  }

  render() {
    if (this.state.firstCard === 0 && this.state.lastIndex <= 4) {
      return (
        <div>
          <h2>Related Products</h2>
          <div className='rr-row-container' >

            { this.renderList() }

          </div>
        </div>
      )
    } else if (this.state.firstCard === 0) {
      return (
        <div>
          <h2>Related Products</h2>
          <div className='rr-row-container' >

            { this.renderList() }

            <div className="rr-carousel-arrow">
              <Arrow
                direction="right"
                clickFunction={ this.nextSlide }
              />
            </div>
          </div>
        </div>
      )
    } else if (this.state.lastCard === this.state.lastIndex) {
      return (
        <div>
          <h2>Related Products</h2>
          <div className='rr-row-container' >

            <div className="rr-carousel-arrow" >
              <Arrow
                direction="left"
                clickFunction={ this.previousSlide }
              />
            </div>

            { this.renderList() }

          </div>
        </div>
      )
    }
    return (
      <div>
        <h2>Related Products</h2>
        <div className='rr-row-container' >

          <div className="rr-carousel-arrow">
            <Arrow
              direction="left"
              clickFunction={ this.previousSlide }
            />
          </div>

          { this.renderList() }

          <div className="rr-carousel-arrow">
            <Arrow
              direction="right"
              clickFunction={ this.nextSlide }
            />
          </div>

        </div>
      </div>
    )
  }
}

export default RelatedProducts;