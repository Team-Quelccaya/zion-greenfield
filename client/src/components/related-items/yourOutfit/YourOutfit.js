import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import YourOutfitEntry from './YourOutfitEntry';
import AddOutfit from './AddOutfit';

const YourOutfit = ({ outfit, addOutfitHandler, deleteOutfitHandler }) => {
  let scroller = null;
  const handleRightClick = () => {
    scroller.scrollLeft += 650;
  };

  const handleLeftClick = () => {
    scroller.scrollLeft -= 650;
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const [rightButtonPosition, setRightButtonPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(scroller.scrollLeft);
  };

  const updateRightButtonPosition = () => {
    if (scroller !== null) {
      setRightButtonPosition(
        window.innerWidth - scroller.getBoundingClientRect().right
      );
    }
  };

  useEffect(() => {
    updateRightButtonPosition();
  });

  const handleResize = () => {
    updateRightButtonPosition();
  };

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  return (
    <div className="related-container">
      <p className="related-title">Your Outfit</p>
      <div
        className="related-card-container"
        ref={(el) => {
          scroller = el;
        }}
        onScroll={() => {
          handleScroll();
        }}
      >
        <button
          className={`related-gallery-button left ${
            scrollPosition < 10 ? 'hide-button' : ''
          }`}
          type="button"
          onClick={() => {
            handleLeftClick();
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          type="button"
          className={`related-gallery-button right ${
            scrollPosition > (outfit.length + 1) * 295 - 1130
              ? 'hide-button'
              : ''
          }`}
          style={{
            right: rightButtonPosition
          }}
          onClick={() => {
            handleRightClick();
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
        <div style={{ width: (outfit.length + 1) * 295 }}>
          <AddOutfit addOutfitHandler={addOutfitHandler} />
          {outfit.map((product) => {
            return (
              <YourOutfitEntry
                key={`${product.id}-${Math.random() * (1000 - 1)}`}
                productId={product.id}
                image={product.thumbnail_url}
                category={product.category}
                name={product.name}
                price={product.price}
                deleteOutfitHandler={deleteOutfitHandler}
                rating={product.rating}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YourOutfit;
