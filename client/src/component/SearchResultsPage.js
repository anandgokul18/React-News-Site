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

class SearchResultsPage extends Component {
   constructor(props) {
      super(props);
      this.state = {
         posts: [],
         isShareModalOpen: false,
         shareTitle: '',
         shareOrigin: '',
         shareURL: '',
         cardExpanded: false,
         cardIdentifier: '',
         expandedCardContent: {},
      };
      this.props = {
         currentPage: '',
      }

   }

   truncateDate(dateinput) {
      return dateinput.substring(0, 10);
   }

   categoryHandler(category) {
      return category.toUpperCase();
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
      else {
         return { backgroundColor: '#9b9b9b', color: '#fff', float: 'left', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px' };
      }
   }

   imageHandler(url) {
      let currentimage = '';
      try {
         if (this.props.currentOrigin === 'GUARDIAN') {
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
         if (this.props.currentOrigin === 'GUARDIAN') {
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

   doExpand = id => {
      this.setState({
         cardIdentifier: id,
         cardExpanded: true,
      });
   }

   componentDidMount() {
      //Setting Search to true
      this.props.searchTrueHandler();

      //Fetching from the NodeJS backend
      let requiredURL = '';
      if (this.props.currentOrigin === 'GUARDIAN') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/guardianAPISearch?searchstring=" + this.props.location.search;
         fetch(requiredURL)
            .then(response => response.json())
            .then(
               // handle the result
               (result) => {
                  this.setState({
                     isLoaded: true,
                     posts: result.response.results
                  });
                  //console.log(this.state.posts)
               },

               // Handle error 
               (error) => {
                  console.log(error);
                  this.setState({
                     isLoaded: true,
                     error
                  })
               },
            )
      } else {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/nytAPISearch?searchstring=" + this.props.location.search;
         fetch(requiredURL)
            .then(response => response.json())
            .then(
               // handle the result
               (result) => {
                  this.setState({
                     isLoaded: true,
                     posts: result.nyttoguardianformattedresponse
                  });
                  //console.log(this.state.posts)
               },

               // Handle error 
               (error) => {
                  console.log(error);
                  this.setState({
                     isLoaded: true,
                     error
                  })
               },
            )
      }
   }

   render() {

      const { error, isLoaded, posts } = this.state;

      //console.log(this.props);

      if (error) {
         return <div style={{ textAlign: 'center' }}>Error in loading. <br /> Reason: Guardian/NYT Server returned null data results <br />Please try again by clicking the same link...:)</div >
      } else {
         return (
            <div>
               {!this.state.cardExpanded &&
                  <>
                     <br />
                     <span style={{ fontSize: '30px', color: '#697689', paddingLeft: '40px', paddingTop: '70px' }}> Results </span>
                     <ul style={{ listStyleType: "none", padding: "0", paddingLeft: '15px' }} className={this.state.cardExpanded ? 'hidden' : ''}>
                        {
                           this.state.posts.map(post => (
                              <li style={{ float: 'left', overflow: 'Hidden', paddingLeft: '10px' }}>
                                 <CardDiv>
                                    <div>
                                       <div>
                                          <p style={{ fontSize: '12px', paddingLeft: '10px', paddingTop: '10px' }}><i>
                                             <b onClick={e => this.doExpand(post.id)}>
                                                <Truncate lines={2} ellipsis={<span> </span>}>
                                                   <Truncate width={410} ellipsis={<span>
                                                      ...
                                                      <ShareIcon style={{ fontSize: '14px', marginLeft: '10px' }} onClick={() => {
                                                         this.toggleModal();
                                                         this.setState({
                                                            shareTitle: post.webTitle,
                                                            shareOrigin: this.props.currentOrigin,
                                                            shareURL: post.webUrl
                                                         });
                                                      }} />

                                                   </span>}>
                                                      {post.webTitle}
                                                   </Truncate>
                                                </Truncate>

                                             </b>
                                             <ShareIcon style={{ fontSize: '14px', marginLeft: '10px' }} onClick={() => {
                                                this.toggleModal();
                                                this.setState({
                                                   shareTitle: post.webTitle,
                                                   shareOrigin: this.props.currentOrigin,
                                                   shareURL: post.webUrl
                                                });
                                             }} />
                                          </i></p>
                                       </div>
                                    </div>
                                    <img onClick={() => { this.setState({ cardIdentifier: post.id }); this.doExpand(post.id); }} class="img-thumbnail" src={this.imageHandler(post.blocks.main)} style={{ width: '280px', height: '180px', minWidth: '70px', margin: '10px' }} alt="Image Is Loading..." />


                                    <div>
                                       <div id='wrapper' onClick={e => this.doExpand(post.id)} >
                                          <div id="leftsearch" style={{ paddingLeft: '10px' }}>{this.truncateDate(post.webPublicationDate)}</div>
                                          <div id="rightsearch" style={{ display: 'flex', justifyContent: 'space-around', }}>
                                             <span style={this.categoryCss(post.sectionId)}>{this.categoryHandler(post.sectionId)}</span>
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
                  <div>
                     <ExpandedCard className={this.state.cardExpanded ? 'block' : 'hidden'} currentOrigin={this.props.currentOrigin} currentCardId={this.state.cardIdentifier} isPartOfBookmarksProp={this.state.cardExpanded} />
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
  margin: 0.75rem;
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

export default SearchResultsPage;