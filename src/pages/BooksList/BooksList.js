import React, {useState} from 'react';
import PropTypes from 'prop-types';
import logo from '../../assets/logo-black.svg';
import styles from './BooksList.module.scss';
import BookCard from '../../components/BookCard/BookCard';
import {useHistory} from "react-router-dom";
import placeholder from '../../assets/image_placeholder.png';

const axios = require('axios');

const BooksList = () => {

  const history = useHistory();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [data, setData] = useState();
  const [pageInfo, setPageInfo] = useState();
  
  const [showModal, setShowModal] = useState();
  const [modalState, setModalState] = useState(styles.modalHidden);
  const [currentBook, setCurrentBook] = useState();
  
  React.useEffect(()=>{
    loadUser();
  }, [mounted]);
  
  function loadUser(){
    if(sessionStorage.getItem('authorization')){
      setCurrentUser(JSON.parse(sessionStorage.getItem('user')));
      axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('authorization');
      loadData();
    } else {
      history.push("/login");
    }
  }

  function logout(){
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authorization');
    sessionStorage.removeItem('refresh-token');
    history.push("/login");
  }

  function loadData(_page){
    const page = _page || 1;
    setData(null);
    axios.get("books?amount=12&page="+page).then((response)=>{
      setData(response.data);
      setPageInfo({
        currentPage: response.data.page,
        totalPages: Math.ceil(response.data.totalPages)
      });
    });
  }

  function nextPage(){
    loadData(pageInfo.currentPage+1);
  }

  function prevPage(){
    loadData(pageInfo.currentPage-1);
  }

  function showBook(id){
    console.log(id);
    showModalFn();
    axios.get("/books/"+id).then((response)=>{
      setCurrentBook(response.data);
    })
  }
  
  function showModalFn(){
    setShowModal(true);

    setTimeout(()=>{
      setModalState(styles.modalVisible);
    }, 10);
  }

  function closeModal(){
    setModalState(styles.modalHidden);
    setTimeout(()=>{
      setShowModal(false);
      setCurrentBook(null);
    }, 300)
  }
  
  return (
    <div className={styles.BooksList}>

      <div className={styles.modal +" "+ modalState + " " + (!showModal ? styles.modalNone : "")}>
        <div onClick={closeModal} className={styles.modalClick}></div>
        <div className={styles.modalButton}>
          <button onClick={closeModal} className="btn-round close"></button>
        </div>
        <div className={styles.modalContent}>

          { currentBook ? 
            <React.Fragment>
              <div className={styles.bookCover}>
                { currentBook.imageUrl ? 
                  <img src={ currentBook.imageUrl } width="100%" />
                :
                  <img src={ placeholder } width="100%" />
                }
              </div>
              <div className={styles.bookContents}>
                <div>
                  <h2>{currentBook.title}</h2>
                  <div className={styles.authors}>
                    { currentBook.authors.join(", ")}
                  </div>
                </div>

                <div>
                  <h3>Informações</h3>
                  <dl className={styles.infos}>
                    
                    <dt>Páginas</dt>
                    <dd>{ currentBook.pageCount }</dd>
                    
                    <dt>Editora</dt>
                    <dd>{ currentBook.publisher }</dd>
                    
                    <dt>Publicação</dt>
                    <dd>{ currentBook.published }</dd>
                    
                    <dt>Idioma</dt>
                    <dd>{ currentBook.language }</dd>
                    
                    <dt>Título Original</dt>
                    <dd>{ currentBook.title }</dd>
                    
                    <dt>ISBN-10</dt>
                    <dd>{ currentBook.isbn10 }</dd>
                    
                    <dt>ISBN-13</dt>
                    <dd>{ currentBook.isbn13 }</dd>
                  
                  </dl>
                </div>

                <div>
                  <h3>Resenha da Editora</h3>
                  <p>{ currentBook.description }</p>
                </div>

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
                  <div className="animated-background w85"></div>
                </div>

                <div>
                  <div className="animated-background"></div>
                  <div className="animated-background"></div>
                  <div className="animated-background"></div>
                  <div className="animated-background"></div>
                  <div className="animated-background"></div>
                  <div className="animated-background"></div>
                  <div className="animated-background"></div>
                </div>

                <div>
                  <h3>Resenha da Editora</h3>
                  <div className="animated-background w85"></div>
                  <div className="animated-background w85"></div>
                  <div className="animated-background w85"></div>
                  <div className="animated-background w85"></div>
                </div>

              </div>
            </React.Fragment>
          }
        </div>
      </div>

      { currentUser ? 
        <div className="bg bg-content">

          <div className="container">

              <header className="row middle-xs">

                <div className="col-xs-8">
                  <div className='logo'>
                    <img src={logo} alt="ioasys"/>Books
                  </div>
                </div>
                
                <div className="col-xs end-xs">
                  <span className="hidden-xs">Bem vindo, <strong>{ currentUser.name }</strong></span>
                  <button onClick={logout} className="btn-round logout"></button>
                </div>

              </header>

              <main>
                <div className="row">

                  { data ? 
                    <React.Fragment>
                      { data.data.map(el=>
                        <div className="col-xs-12 col-sm-6 col-md-3">
                        <BookCard data={el} clickFn={showBook}></BookCard>
                        </div>
                        ) }
                    </React.Fragment>
                  :
                    <React.Fragment>
                      { [...Array(12).keys()].map(el=>
                      <div className="col-xs-12 col-sm-6 col-md-3">
                      <BookCard></BookCard>
                      </div>
                      ) }
                    </React.Fragment>
                  }

                </div>

                { pageInfo ?
                  <div className={styles.paginator}>

                    <div className="hidden-xs">
                      <div className={styles.paginatorText}>Página <strong>{ pageInfo.currentPage }</strong> de <strong>{ pageInfo.totalPages }</strong> </div>
                      <button disabled={!data || pageInfo.currentPage<=1} onClick={prevPage} className="btn-round prev"></button>
                      <button disabled={!data || pageInfo.currentPage>=pageInfo.totalPages} onClick={nextPage} className="btn-round next"></button>
                    </div>

                    
                    <div className="hidden-sm hidden-md hidden-lg tac">
                      <button disabled={!data || pageInfo.currentPage<=1} onClick={prevPage} className="btn-round prev"></button>
                      <div className={styles.paginatorText}>Página <strong>{ pageInfo.currentPage }</strong> de <strong>{ pageInfo.totalPages }</strong> </div>
                      <button disabled={!data || pageInfo.currentPage>=pageInfo.totalPages} onClick={nextPage} className="btn-round next"></button>
                    </div>

                  </div>
                  : null
                }
              </main>

          </div>

        </div>
      : null }
    </div>
)};

BooksList.propTypes = {};

BooksList.defaultProps = {};

export default BooksList;
