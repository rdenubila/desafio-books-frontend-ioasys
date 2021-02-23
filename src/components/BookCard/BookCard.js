import React from 'react';
import PropTypes from 'prop-types';
import styles from './BookCard.module.scss';
import placeholder from '../../assets/image_placeholder.png';

const BookCard = (props) => {

  function clickCard() {
    if(props) {
      props.clickFn(props.data.id);
    }
  }
  
  return (
    <div onClick={clickCard} className={styles.BookCard}>
      
        { props.data ? 
          <React.Fragment>
            <div className={styles.bookCover}>
              { props.data.imageUrl ? 
                <img src={ props.data.imageUrl } width="100%" />
              :
                <img src={ placeholder } width="100%" />
              }
            </div>
            <div className={styles.bookContents}>
              <div>
                <h2>{props.data.title}</h2>
                <ul className={styles.authors}>
                  { props.data.authors.map(author=>
                    <li>{ author }</li>
                  )}
                </ul>
              </div>

              <ul className={styles.infos}>
                <li>{ props.data.pageCount } páginas</li>
                <li>{ props.data.publisher }</li>
                <li>Publicado em { props.data.published }</li>
              </ul>

            </div>
          </React.Fragment>
        : 
        <React.Fragment>
          <div className={styles.bookCover}>
            <div className="animated-background cover"></div>
          </div>
          <div className={styles.bookContents}>
            <div>
              <h2 className="animated-background title"></h2>
              <ul className={styles.authors}>
                <li className="animated-background w85"></li>
              </ul>
            </div>

            <ul className={styles.infos}>
              <li className="animated-background w75"></li>
              <li className="animated-background w75"></li>
              <li className="animated-background w75"></li>
            </ul>

          </div>
        </React.Fragment>
        }

    </div>
)};

BookCard.propTypes = {};

BookCard.defaultProps = {};

export default BookCard;
