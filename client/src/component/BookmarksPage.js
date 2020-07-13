import React, { Component } from 'react';

//Cards
import styled from 'styled-components'

//Truncating Content in Cards
import Truncate from 'react-truncate';

//React Share
import ShareIcon from '@material-ui/icons/Share';
import {
   EmailShareButton,
   FacebookShareButton,
   TwitterShareButton,
   FacebookIcon,
   EmailIcon,
   TwitterIcon
} from "react-share";
import { Modal, Button } from 'react-bootstrap';

//Loader Spinner
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";

//Expanded Card Div
import ExpandedCard from './ExpandedCard';

//Deleting a bookmark
import DeleteIcon from '@material-ui/icons/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure(
   {
      hideProgressBar: true,
   }
);

class BookmarksPage extends Component {
   constructor(props) {
      super(props);
      this.state = {
         posts: [],
         isShareModalOpen: false,
         shareTitle: '',
         shareOrigin: '',
         shareURL: '',
         cardExpanded: false,
         cardId: '',
         cardOrigin: '',
         expandedCardContent: {},
         errorExpanded: null
      };
      this.props = {
         currentPage: '',
      }
      var retrievedObject = localStorage.getItem('bookmarks');
      this.state.bookmarksArray = JSON.parse(retrievedObject);

   }

   truncateDate(dateinput) {
      return dateinput.substring(0, 10);
   }

   categoryHandler(categorytext) {
      return categorytext.toUpperCase();
   }

   categoryCss(category) {
      category = (category || '').replace(/^\s+|\s+$/g, '');
      category = category.toUpperCase();
      if (category === 'POLITICS') {
         return { backgroundColor: '#0893a1', color: '#fff', float: 'left', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px' };
      }
      else if (category === 'WORLD') {
         return { backgroundColor: '#5904f6', color: '#fff', float: 'left', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px' };
      }
      else if (category === 'SPORT') {
         return { backgroundColor: '#fcb900', color: '#000', float: 'left', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px' };
      }
      else if (category === 'BUSINESS') {
         return { backgroundColor: '#1273de', color: '#fff', float: 'left', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px' };
      }
      else if (category === 'TECHNOLOGY') {
         return { backgroundColor: '#8bc34a', color: '#000', float: 'left', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px' };
      }
      else if (category === 'GUARDIAN') {
         return { backgroundColor: '#0f1448', color: '#fff', float: 'left', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px' };
      }
      else if (category === 'NYTIMES' || category === 'NYT') {
         return { backgroundColor: '#9b9b9b', color: '#000', fontWeight: 'bold', float: 'left', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px' };
      }
      else {
         return { backgroundColor: '#9b9b9b', color: '#fff', float: 'left', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px' };
      }
   }

   imageHandler(url, origin) {
      let currentimage = '';
      try {
         if (origin === 'GUARDIAN') {
            currentimage = url.elements[0].assets[url.elements[0].assets.length - 1].file;
         } else {
            var testforelements = url[0].url;
            for (let i = 0; i < url.length; i++) {
               if (url[i].width > 600) {
                  currentimage = 'https://static01.nyt.com/' + url[i].url;
               }
            }
            for (let i = 0; i < url.length; i++) {
               if (url[i].width > 2000) {
                  currentimage = 'https://static01.nyt.com/' + url[i].url;
               }
            }

         }
      } catch (e) {
         if (origin === 'GUARDIAN') {
            currentimage = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
         } else {
            currentimage = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
         }
      }
      return currentimage;
   }

   toggleModal = () => {
      this.setState({
         isShareModalOpen: !this.state.isShareModalOpen
      });
   }

   notifyBookmarks = valuetodelTitle => toast('Removing ' + valuetodelTitle, {
      position: toast.POSITION.TOP_CENTER,
   });

   deleteABookmark = (valuetodel) => {
      console.log('Trying to delete');
      //for (var i = 0; i < this.state.bookmarksArray.length; i++) {
      //   console.log('Inside the array');
      //   if (this.state.bookmarksArray[i] == valuetodel) {
      //      this.state.bookmarksArray.splice(i, 1);
      //   }
      //}

      //console.log(this.state.bookmarksArray[0].datacontent.id);
      //console.log(valuetodel.datacontent.id);
      var filtered = this.state.bookmarksArray.filter(function (value, index, arr) { return value.datacontent.id !== valuetodel.datacontent.id; });

      this.setState({
         bookmarksArray: filtered
      });

      localStorage.setItem('bookmarks', JSON.stringify(filtered));


   }

   doExpand = (id, origin) => {
      this.setState({
         cardId: id,
         cardExpanded: true,
         cardOrigin: origin,
      });
      this.state.cardId = id;
      this.state.cardOrigin = origin;
      //console.log(this.state.cardId);
      //console.log(this.state.cardOrigin);
   }

   render() {
      const { error, isLoaded, posts } = this.state;
      if (this.state.bookmarksArray == null || this.state.bookmarksArray.length === 0) {
         return <div style={{ textAlign: 'center' }}>You have no saved articles</div >
      } else {
         return (
            <div>
               {!this.state.cardExpanded &&
                  <>
                     <br />
                     <span style={{ fontSize: '30px', color: '#697689', paddingLeft: '40px', paddingTop: '70px' }}> Favorites </span>
                     <ul style={{ listStyleType: "none", padding: "0", paddingLeft: '15px' }} className={this.state.cardExpanded ? 'hidden' : ''}>
                        {
                           this.state.bookmarksArray.map(post => (
                              <li style={{ float: 'left', overflow: 'Hidden' }}>
                                 <CardDiv>
                                    <div>

                                       {/*Original*/}
                                       <div>
                                          <p style={{ fontSize: '12px', paddingLeft: '10px', paddingTop: '10px' }}><i>
                                             <b onClick={() => { this.setState({ cardId: post.datacontent.id }); this.doExpand(post.datacontent.id, post.origin); this.setState({ cardOrigin: post.origin }); }} >
                                                <Truncate lines={2} ellipsis={<span> </span>}>
                                                   <Truncate width={400} ellipsis={<span>...</span>}>
                                                      {post.datacontent.webTitle}
                                                   </Truncate>
                                                </Truncate>

                                             </b>
                                             <ShareIcon style={{ fontSize: '14px', marginLeft: '10px' }} onClick={() => {
                                                this.toggleModal();
                                                this.setState({
                                                   shareTitle: post.datacontent.webTitle,
                                                   shareOrigin: post.origin,
                                                   shareURL: post.datacontent.webUrl
                                                });
                                             }} />
                                             <DeleteIcon style={{ fontSize: '14px', marginLeft: '10px' }} onClick={() => {
                                                this.deleteABookmark(post);
                                                this.notifyBookmarks(post.datacontent.webTitle);
                                             }} />
                                          </i></p>
                                       </div>

                                    </div>
                                    <img onClick={() => { this.setState({ cardId: post.datacontent.id }); this.doExpand(post.datacontent.id, post.origin); this.setState({ cardOrigin: post.origin }); }} class="img-thumbnail" src={this.imageHandler(post.datacontent.blocks.main, post.origin)} style={{ width: '280px', height: '180px', minWidth: '70px', margin: '10px' }} alt="Image Is Loading..." />


                                    <div>
                                       <div id='wrapper' onClick={() => { this.setState({ cardId: post.datacontent.id }); this.doExpand(post.datacontent.id, post.origin); this.setState({ cardOrigin: post.origin }); }}  >
                                          <div id="leftbookmarks" style={{ paddingLeft: '10px' }}>{this.truncateDate(post.datacontent.webPublicationDate)}</div>
                                          <div id="rightbookmarks" style={{ display: 'flex', justifyContent: 'space-around' }}>
                                             <span style={this.categoryCss(post.datacontent.sectionId)}>{this.categoryHandler(post.datacontent.sectionId)}</span>
                                             <span style={this.categoryCss(post.origin)}>{post.origin}</span>
                                          </div>
                                       </div>
                                    </div>


                                 </CardDiv>

                              </li>
                           ))
                        }
                     </ul>
                  </>
               }

               {
                  this.state.cardExpanded &&
                  <div className={this.state.cardExpanded ? 'block' : 'hidden'}>
                     {console.log(this.state.cardOrigin)}
                     <ExpandedCard currentCardId={this.state.cardId} isPartOfBookmarksProp={this.state.cardExpanded} currentOrigin={this.state.cardOrigin} />
                  </div>
               }

               <Modal size="lg" aria-labelledby="example-modal-sizes-title-lg" show={this.state.isShareModalOpen} onHide={this.toggleModal}>
                  <Modal.Header closeButton>
                     <Modal.Title id="example-modal-sizes-title-lg" ><b>{this.state.shareOrigin}</b><br />{this.state.shareTitle}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <div style={{ textAlign: 'center', fontSize: '25px' }}><b>Share via</b><br /></div>
                     <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-around' }}>
                        <FacebookShareButton url={this.state.shareURL} hashtag='#CSCI_571_NewsApp' > <FacebookIcon size={64} round={true} /></FacebookShareButton>
                        <TwitterShareButton url={this.state.shareURL} title='#CSCI_571_NewsApp'><TwitterIcon size={64} round={true} /></TwitterShareButton>
                        <EmailShareButton url={this.state.shareURL} subject='#CSCI_571_NewsApp'><EmailIcon size={64} round={true} /></EmailShareButton>
                     </div>
                  </Modal.Body>
               </Modal>

            </div >
         );
      }
   }
}


const CardDiv = styled.div`
  background: #fff;
  border-radius: 2px;
  height: 320px;
  margin: 1.5rem;
  width: 300px;
  box-shadow: 0.2px 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  /*box-shadow: 2.5px 5px 10px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);*/
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  padding-top: 5px;
  &:hover {
        /*box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);*/
        box-shadow: 2.5px 5px 10px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
        transform: translateY(-0.5px);
    },
`;

const bounceCss = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default BookmarksPage;