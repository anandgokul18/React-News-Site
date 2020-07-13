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
import { Modal, Button, Container, Col, Row } from 'react-bootstrap';

//Loader Spinner
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";

//Expanded Card Div
import ExpandedCard from './ExpandedCard';

class GuardianPages extends Component {
   constructor(props) {
      super(props);
      this.state = {
         error: null,
         isLoaded: false,
         posts: [],
         isShareModalOpen: false,
         shareTitle: '',
         shareURL: '',
         cardExpanded: false,
         cardId: '',
         expandedCardContent: {},
         errorExpanded: null
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
         return { backgroundColor: '#0893a1', color: '#fff', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px', display: 'flex', justifyContent: 'space-around' };
      }
      else if (category === 'WORLD') {
         return { backgroundColor: '#5904f6', color: '#fff', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px', display: 'flex', justifyContent: 'space-around' };
      }
      else if (category === 'SPORT') {
         return { backgroundColor: '#fcb900', color: '#000', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px', display: 'flex', justifyContent: 'space-around' };
      }
      else if (category === 'BUSINESS') {
         return { backgroundColor: '#1273de', color: '#fff', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px', display: 'flex', justifyContent: 'space-around' };
      }
      else if (category === 'TECHNOLOGY') {
         return { backgroundColor: '#8bc34a', color: '#000', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px', display: 'flex', justifyContent: 'space-around' };
      }
      else {
         return { backgroundColor: '#9b9b9b', color: '#fff', paddingLeft: '2px', paddingRight: '2px', borderRadius: '2px', display: 'flex', justifyContent: 'space-around' };
      }
   }

   imageHandler(url) {
      let currentimage = '';
      try {
         currentimage = url.elements[0].assets[1].file;
      } catch (e) {
         currentimage = 'https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png';
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
         cardId: id,
         cardExpanded: true,
      });
      this.state.cardId = id;
      //console.log(this.state.cardId);
   }

   componentDidMount() {
      //Setting Search and Bookmarks flag to false
      this.props.searchOrBookmarksNavHandler();

      //Fetching from the NodeJS backend
      let requiredURL = '';
      if (this.props.currentPage === 'world') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/guardianAPIWorld";
      }
      else if (this.props.currentPage === 'politics') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/guardianAPIPolitics";
      }
      else if (this.props.currentPage === 'business') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/guardianAPIBusiness";
      }
      else if (this.props.currentPage === 'technology') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/guardianAPITechnology";
      }
      else if (this.props.currentPage === 'sports') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/guardianAPISports";
      }
      else {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/guardianAPI";
      }
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
   }


   render() {
      const { error, isLoaded, posts } = this.state;

      if (error) {
         return <div style={{ textAlign: 'center' }}>Error in loading. <br /> Reason: Guardian Server returned null data results <br />Please try again by clicking the same link...:)</div >
      } else if (!isLoaded) {
         //Handling when page not loaded
         return <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <BounceLoader
               css={bounceCss}
               size={35}
               color={"#4A68E2"}
               loading={!this.state.isLoaded}
            />
            Loading
         </div>
      } else {
         return (
            <div>
               {/* <ol>
                  {
                     posts.map(post => (
                        <li align="start">
                           <div>
                              <p>{post.title}</p>
                              <p>{post.id}</p>
                           </div>
                        </li>
                     ))
                  }
               </ol> */}
               {!this.state.cardExpanded &&
                  <ul style={{ listStyleType: "none", padding: "0" }} className={this.state.cardExpanded ? 'hidden' : ''}>
                     {
                        posts.map(post => (
                           <li >

                              <Container style={{ maxWidth: '100%' }}>
                                 <CardDiv>
                                    <Row >
                                       {/*<img class="img-thumbnail" src={post.blocks.main.elements[0].assets[0].file} style={{ width: '200px', minWidth: '200px', margin: '10px' }} alt="Responsive image" />*/}
                                       <Col lg={"3"}>
                                          <center>
                                             <img onClick={() => { this.doExpand(post.id); }} src={this.imageHandler(post.blocks.main)} style={{ width: '300px', height: '200px', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '10px', borderStyle: "double", borderColor: "#abb8c3", borderWidth: "4px" }} alt="Image Is Loading..." fluid />
                                          </center>
                                       </Col>
                                       <Col lg={true} >
                                          <div style={{ marginLeft: '5px', marginTop: '10px' }}>
                                             <div>
                                                <p><i>
                                                   <b onClick={e => this.doExpand(post.id)} >{post.webTitle}</b>
                                                   <ShareIcon onClick={() => {
                                                      this.toggleModal();
                                                      this.setState({
                                                         shareTitle: post.webTitle,
                                                         shareURL: post.webUrl
                                                      });
                                                   }} />
                                                </i></p> {/* Title */}
                                                <p style={{ fontSize: '12px' }} onClick={e => this.doExpand(post.id)} >
                                                   <Truncate lines={3} ellipsis={<span>... </span>}>
                                                      {post.blocks.body[0].bodyTextSummary}
                                                   </Truncate>
                                                </p>
                                             </div>
                                             <div style={{ marginBottom: '10px' }}>
                                                <div id='wrapper' onClick={e => this.doExpand(post.id)} >
                                                   <span id="left">{this.truncateDate(post.webPublicationDate)}</span>
                                                   <div id="right" style={{ display: 'flex', justifyContent: 'right', marginRight: '10px' }}>
                                                      <span style={this.categoryCss(post.sectionId)}>{this.categoryHandler(post.sectionId)}</span>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </Col>
                                    </Row>
                                 </CardDiv>
                              </Container>

                           </li>
                        ))
                     }
                  </ul>
               }

               {
                  this.state.cardExpanded &&
                  <div className={this.state.cardExpanded ? 'block' : 'hidden'}>
                     <ExpandedCard currentCardId={this.state.cardId} currentOrigin='GUARDIAN' />
                  </div>
               }

               <Modal size="lg" dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title" show={this.state.isShareModalOpen} onHide={this.toggleModal}>
                  <Modal.Header closeButton>
                     <Modal.Title id="example-custom-modal-styling-title" >{this.state.shareTitle}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <div style={{ textAlign: 'center', fontSize: '20px' }}><b>Share via</b><br /></div>
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
  display: flex;
  height: 100%;
  min-height: 225px;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
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

export default GuardianPages;