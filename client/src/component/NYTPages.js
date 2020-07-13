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

//Media Queries
import { useMediaQuery } from 'react-responsive';

class NYTPages extends Component {
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
      else if (category === 'SPORT' || category === 'SPORTS') {
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

   imageHandler(mmurl) {
      let currentimage = '';
      try {
         currentimage = mmurl[0].url;
      } catch (e) {
         currentimage = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
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
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/nytAPIWorld";
      }
      else if (this.props.currentPage === 'politics') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/nytAPIPolitics";
      }
      else if (this.props.currentPage === 'business') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/nytAPIBusiness";
      }
      else if (this.props.currentPage === 'technology') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/nytAPITechnology";
      }
      else if (this.props.currentPage === 'sports') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/nytAPISports";
      }
      else {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/nytAPI";
      }
      fetch(requiredURL)
         .then(response => response.json())
         .then(
            // handle the result
            (result) => {
               this.setState({
                  isLoaded: true,
                  posts: result.results
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
         return <div style={{ textAlign: 'center' }}>Error in loading. <br /> Reason: NYT Server returned null data results <br />Please try again by clicking the same link...:)</div >
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
                                             <img onClick={() => { this.doExpand(post.url); }} src={this.imageHandler(post.multimedia)} style={{ width: '300px', height: '200px', marginTop: '20px', marginBottom: '20px', marginLeft: '20px', marginRight: '10px', borderStyle: "double", borderColor: "#abb8c3", borderWidth: "4px" }} alt="Image Is Loading..." fluid />
                                          </center>
                                       </Col>
                                       <Col lg={true} >
                                          <div style={{ marginLeft: '5px', marginTop: '10px' }}>
                                             <div>
                                                <p><i>
                                                   <b onClick={e => this.doExpand(post.url)} > {post.title}</b>
                                                   <ShareIcon onClick={() => {
                                                      this.toggleModal();
                                                      this.setState({
                                                         shareTitle: post.title,
                                                         shareURL: post.url
                                                      });
                                                   }} />

                                                </i></p> {/* Title */}
                                                <p style={{ fontSize: '12px' }} onClick={e => this.doExpand(post.url)} >
                                                   <Truncate lines={3} ellipsis={<span>... </span>}>
                                                      {post.abstract + "                                                 "}
                                                   </Truncate>
                                                   <Desktop style={{ overflow: 'hidden' }}>
                                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                   </Desktop>
                                                </p>
                                             </div>
                                             <div style={{ marginBottom: '10px' }}>
                                                <div id='wrapper' onClick={e => this.doExpand(post.url)} >
                                                   <span id="left">{this.truncateDate(post.published_date)}</span>
                                                   <div id="right" style={{ display: 'flex', justifyContent: 'right', marginRight: '10px' }}>
                                                      <span style={this.categoryCss(post.section)}>{this.categoryHandler(post.section)}</span>
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
                     <ExpandedCard currentCardId={this.state.cardId} currentOrigin='NYTIMES' />
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

const Desktop = ({ children }) => {
   const isDesktop = useMediaQuery({ minWidth: 992 })
   return isDesktop ? children : null
}
const Tablet = ({ children }) => {
   const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
   return isTablet ? children : null
}
const Mobile = ({ children }) => {
   const isMobile = useMediaQuery({ maxWidth: 767 })
   return isMobile ? children : null
}
const Default = ({ children }) => {
   const isNotMobile = useMediaQuery({ minWidth: 768 })
   return isNotMobile ? children : null
}

export default NYTPages;