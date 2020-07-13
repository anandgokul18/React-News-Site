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
import { Modal, Button, Container } from 'react-bootstrap';

//Loader Spinner
import { css } from "@emotion/core";
import BounceLoader from "react-spinners/BounceLoader";

//Tooltip for hover over bookmarks
import ReactTooltip from 'react-tooltip';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';

//Expand More
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

//Time in text format
import Moment from 'react-moment';

//Bookmarks 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookmarkIcon from '@material-ui/icons/Bookmark';

//Comment Box
import CommentBox from './CommentBox';

//Media Queries
import { useMediaQuery } from 'react-responsive';

class ExpandedCard extends Component {
   constructor(props) {
      super(props);
      this.state = {
         isLoaded: false,
         shareTitle: '',
         shareURL: '',
         cardExpanded: false,
         expandedCardContent: {},
         errorExpanded: null,
         expandAdditionalContent: false,
      };
      this.props = {
         isPartOfBookmarksProp: false,
         currentCardId: ''
      }
      //this.state.isPartOfBookmarks = this.props.isPartOfBookmarksProp;

      //All below in Constructor for changing bookmarks icon
      var retrievedObject = localStorage.getItem('bookmarks');
      if (retrievedObject == null) {
         this.setState({ isPartOfBookmarks: false });
         this.state.isPartOfBookmarks = false;
      } else {
         //Append it to the list and put it back into storage
         let retrievedObjectNew = JSON.parse(retrievedObject);
         //Code to check if the bookmark already exists in bookmarks
         var filtered = retrievedObjectNew.filter(function (value, index, arr) { return value.datacontent.id === props.currentCardId; });
         //console.log(filtered);
         if (filtered.length !== 0) {
            this.setState({ isPartOfBookmarks: true });
            this.state.isPartOfBookmarks = true;
         } else {
            this.setState({ isPartOfBookmarks: false });
            this.state.isPartOfBookmarks = false;
         }
      }



   }

   truncateDate(dateinput) {
      return dateinput.substring(0, 10);
   }

   categoryHandler(category) {
      return category.toUpperCase();
   }


   imageHandler(url) {
      let currentimage = '';
      try {
         if (this.props.currentOrigin === 'GUARDIAN') {
            currentimage = url.elements[0].assets[url.elements[0].assets.length - 1].file;
         } else {
            var testforelements = url[0].url; //If the array is empty, raise exception
            currentimage = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg';
            for (let i = 0; i < url.length; i++) {
               if (url[i].width > 1500) {
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

   toggleExpandAdditionalContent = () => {
      this.setState({
         expandAdditionalContent: !this.state.expandAdditionalContent
      });
   }

   notifyA = articleTitle => toast('Saving ' + articleTitle, {
      position: toast.POSITION.TOP_CENTER,
   });

   notifyBookmarks = valuetodelTitle => toast('Removing ' + valuetodelTitle, {
      position: toast.POSITION.TOP_CENTER,
   });

   bookmarkHandler(currentItem) {
      //Checking whether other bookmarks exist
      var retrievedObject = localStorage.getItem('bookmarks');

      //Changing NYT Content to Guardian format so that I dont have to change Bookmarks Page
      if (this.props.currentOrigin !== 'GUARDIAN') {
         let temp = {};
         temp.id = currentItem.web_url;
         temp.webTitle = currentItem.headline.main;
         temp.webUrl = currentItem.web_url;
         temp.blocks = {};
         temp.blocks.main = {};
         temp.blocks.main = currentItem.multimedia;
         temp.webPublicationDate = currentItem.pub_date;
         temp.sectionId = currentItem.section_name;
         currentItem = temp;
      }

      if (retrievedObject == null) {
         this.setState({ isPartOfBookmarks: false });
         this.state.isPartOfBookmarks = false;
         this.notifyA(currentItem.webTitle);
         // Put the object into storage
         let arrayOfBookmarks = [{ 'origin': this.props.currentOrigin, 'datacontent': currentItem }]
         localStorage.setItem('bookmarks', JSON.stringify(arrayOfBookmarks));
      }
      else {
         //Append it to the list and put it back into storage
         let retrievedObjectNew = JSON.parse(retrievedObject);

         //Code to check if the bookmark already exists in bookmarks
         var filtered = retrievedObjectNew.filter(function (value, index, arr) { return value.datacontent.id === currentItem.id; });
         //console.log(filtered);
         if (filtered.length !== 0) {
            this.setState({ isPartOfBookmarks: true });
            this.state.isPartOfBookmarks = true;
            this.deleteABookmark(filtered[0].datacontent.id);
            this.notifyBookmarks(currentItem.webTitle);

         } else {
            this.setState({ isPartOfBookmarks: false });
            this.state.isPartOfBookmarks = false;
            this.notifyA(currentItem.webTitle);
            retrievedObjectNew.push({ 'origin': this.props.currentOrigin, 'datacontent': currentItem });
            localStorage.setItem('bookmarks', JSON.stringify(retrievedObjectNew));

         }
      }

   }

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
      var retrievedObject = localStorage.getItem('bookmarks');
      let retrievedObjectNew = JSON.parse(retrievedObject);

      var filtered = retrievedObjectNew.filter(function (value, index, arr) { return value.datacontent.id !== valuetodel; });

      this.setState({
         bookmarksArray: filtered
      });

      localStorage.setItem('bookmarks', JSON.stringify(filtered));



   }

   componentDidMount() {
      //Fetching from the NodeJS backend
      let requiredURL = '';
      if (this.props.currentOrigin === 'GUARDIAN') {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/guardianAPIDetailed?id=" + this.props.currentCardId;
         fetch(requiredURL)
            .then(response => response.json())
            .then(
               // handle the result
               (result) => {
                  this.setState({
                     isLoaded: true,
                     expandedCardContent: result.response
                  });
                  //console.log(this.state.posts)
               },

               // Handle error 
               (errorExpanded) => {
                  console.log(errorExpanded);
                  this.setState({
                     isLoaded: true,
                     errorExpanded: true
                  })
               },
            )
      } else {
         requiredURL = "http://newswebsite.us-east-1.elasticbeanstalk.com/nytAPIDetailed?id=" + this.props.currentCardId;
         fetch(requiredURL)
            .then(response => response.json())
            .then(
               // handle the result
               (result) => {
                  this.setState({
                     isLoaded: true,
                     expandedCardContent: result.response.docs[0]
                  });
                  //console.log(this.state.posts)
               },

               // Handle error 
               (errorExpanded) => {
                  console.log(errorExpanded);
                  this.setState({
                     isLoaded: true,
                     errorExpanded: true
                  })
               },
            )
      }
   }

   render() {
      const { errorExpanded, isLoaded, expandedCardContent } = this.state;

      localStorage.setItem('currentcardIdforComments', JSON.stringify(this.props.currentCardId));

      if (errorExpanded) {
         return <div>Error in loading...Please try again by clicking the same link...:)</div>
      } else if (!isLoaded) {
         //Handling when page not loaded
         return <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <BounceLoader
               css={bounceCss}
               size={35}
               color={"#4A68E2"}
               loading={!isLoaded}
            />
            Loading
         </div>
      } else {
         if (this.props.currentOrigin === 'GUARDIAN') {
            return (
               <div>
                  <Container style={{ maxWidth: '100%' }}>
                     <ExpandedCardDiv>

                        <div>
                           <Default>
                              <p style={{ fontSize: '25px', paddingLeft: '30px', paddingTop: '20px', paddingRight: '10px' }}><i> <b >{expandedCardContent.content.webTitle}</b></i></p>
                           </Default>
                           <Mobile>
                              <p style={{ fontSize: '15px', paddingLeft: '10px', paddingTop: '10px', paddingRight: '10px' }}><i> <b >{expandedCardContent.content.webTitle}</b></i></p>
                           </Mobile>
                           <div>

                              <div id='wrapper'>
                                 <Desktop>
                                    <div id="leftexpanded_default" style={{ paddingLeft: '30px', paddingRight: '30px', fontSize: '20px' }}>
                                       <Moment format="DD MMMM YYYY">{this.truncateDate(expandedCardContent.content.webPublicationDate)}</Moment>
                                    </div>
                                 </Desktop>
                                 <Tablet>
                                    <div id="leftexpanded_tablet" style={{ paddingLeft: '30px', paddingRight: '30px', fontSize: '20px' }}>
                                       <Moment format="DD MMMM YYYY">{this.truncateDate(expandedCardContent.content.webPublicationDate)}</Moment>
                                    </div>
                                 </Tablet>
                                 <Default>
                                    <div id="rightexpanded">
                                       <div style={{ paddingLeft: '10px' }}>
                                          <a data-tip="Facebook" data-for='expandedFacebook'><FacebookShareButton url={expandedCardContent.content.webUrl} hashtag='#CSCI_571_NewsApp' > <FacebookIcon size={34} round={true} /></FacebookShareButton></a>
                                          <a data-tip="Twitter" data-for='expandedTwitter'><TwitterShareButton url={expandedCardContent.content.webUrl} title='#CSCI_571_NewsApp'><TwitterIcon size={34} round={true} /></TwitterShareButton></a>
                                          <a data-tip="Email" data-for='expandedEmail'><EmailShareButton style={{ paddingRight: '50px' }} url={expandedCardContent.content.webUrl} subject='#CSCI_571_NewsApp'><EmailIcon size={34} round={true} /></EmailShareButton></a>

                                          <a data-tip="Bookmark" data-for='expandedBookmarks' onClick={() => { this.bookmarkHandler(expandedCardContent.content); this.setState({ isPartOfBookmarks: !this.state.isPartOfBookmarks }); }}>
                                             {this.state.isPartOfBookmarks
                                                ? <BookmarkIcon style={{ fontSize: 30, color: "#b80000" }} />
                                                : <BookmarkBorderOutlinedIcon style={{ fontSize: 30, color: "#b80000" }} />
                                             }
                                          </a>
                                          <ReactTooltip id='expandedBookmarks' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedFacebook' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedTwitter' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedEmail' place="top" type="dark" effect="float" />

                                       </div>
                                    </div>
                                 </Default>
                                 <Mobile>
                                    <div id="leftexpanded_mobile" style={{ paddingLeft: '20px', paddingRight: '10px', fontSize: '12px' }}>
                                       <Moment format="DD MMMM YYYY">{this.truncateDate(expandedCardContent.content.webPublicationDate)}</Moment>
                                    </div>

                                    <div id="rightexpanded">
                                       <div style={{ paddingLeft: '10px' }}>
                                          <a data-tip="Facebook" data-for='expandedFacebook'><FacebookShareButton url={expandedCardContent.content.webUrl} hashtag='#CSCI_571_NewsApp' > <FacebookIcon size={24} round={true} /></FacebookShareButton></a>
                                          <a data-tip="Twitter" data-for='expandedTwitter'><TwitterShareButton url={expandedCardContent.content.webUrl} title='#CSCI_571_NewsApp'><TwitterIcon size={24} round={true} /></TwitterShareButton></a>
                                          <a data-tip="Email" data-for='expandedEmail'><EmailShareButton style={{ paddingRight: '10px' }} url={expandedCardContent.content.webUrl} subject='#CSCI_571_NewsApp'><EmailIcon size={24} round={true} /></EmailShareButton></a>

                                          <a data-tip="Bookmark" data-for='expandedBookmarks' onClick={() => { this.bookmarkHandler(expandedCardContent.content); this.setState({ isPartOfBookmarks: !this.state.isPartOfBookmarks }); }}>
                                             {this.state.isPartOfBookmarks
                                                ? <BookmarkIcon style={{ fontSize: 22, color: "#b80000" }} />
                                                : <BookmarkBorderOutlinedIcon style={{ fontSize: 22, color: "#b80000" }} />
                                             }
                                          </a>
                                          <ReactTooltip id='expandedBookmarks' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedFacebook' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedTwitter' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedEmail' place="top" type="dark" effect="float" />

                                       </div>
                                    </div>
                                 </Mobile>
                              </div>

                           </div>


                           <div>
                              <Default>
                                 < img class="img-thumbnail" style={{ width: '100%' }} src={this.imageHandler(expandedCardContent.content.blocks.main)} alt="Image Is Loading from Guardian Server..." />
                              </Default>
                              <Mobile>
                                 < img class="img-thumbnail" src={this.imageHandler(expandedCardContent.content.blocks.main)} alt="Image Is Loading from Guardian Server..." />
                              </Mobile>
                           </div>

                           <p style={{ fontSize: '12px', paddingTop: '20px' }}>
                              {!this.state.expandAdditionalContent &&
                                 <div>
                                    <Truncate lines={4} ellipsis={<span>... <br /><div style={{ alignContent: 'right' }}>
                                       <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                                          <ExpandMoreIcon style={{ fontSize: '40px' }} onClick={e => this.toggleExpandAdditionalContent()} />
                                       </div>
                                    </div></span>}>
                                       {expandedCardContent.content.blocks.body[0].bodyTextSummary}
                                    </Truncate>
                                 </div>
                              }
                              {
                                 this.state.expandAdditionalContent &&
                                 <div>
                                    {expandedCardContent.content.blocks.body[0].bodyTextSummary}
                                    <div style={{ alignContent: 'right' }}>
                                       <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                                          <ExpandLessIcon style={{ fontSize: '40px' }} onClick={e => this.toggleExpandAdditionalContent()} />
                                       </div>
                                    </div>
                                 </div>
                              }
                           </p>
                        </div>
                     </ExpandedCardDiv >
                  </Container >

                  <CommentBox currentCardId={this.props.currentCardId} />
               </div >
            );
         } else {
            return (
               <div>
                  <Container style={{ maxWidth: '100%' }}>
                     <ExpandedCardDiv>

                        <div>
                           <Default>
                              <p style={{ fontSize: '25px', paddingLeft: '30px', paddingTop: '20px', paddingRight: '10px' }}><i> <b >{expandedCardContent.headline.main}</b></i></p>
                           </Default>
                           <Mobile>
                              <p style={{ fontSize: '15px', paddingLeft: '10px', paddingTop: '10px', paddingRight: '10px' }}><i> <b >{expandedCardContent.headline.main}</b></i></p>
                           </Mobile>
                           <div>

                              <div id='wrapper'>
                                 <Desktop>
                                    <div id="leftexpanded_default" style={{ paddingLeft: '30px', paddingRight: '30px', fontSize: '20px' }}>
                                       <Moment format="DD MMMM YYYY">{this.truncateDate(expandedCardContent.pub_date)}</Moment>
                                    </div>
                                 </Desktop>
                                 <Tablet>
                                    <div id="leftexpanded_tablet" style={{ paddingLeft: '30px', paddingRight: '30px', fontSize: '20px' }}>
                                       <Moment format="DD MMMM YYYY">{this.truncateDate(expandedCardContent.pub_date)}</Moment>
                                    </div>
                                 </Tablet>
                                 <Default>
                                    <div id="rightexpanded">
                                       <div style={{ paddingLeft: '10px' }}>
                                          <a data-tip="Facebook" data-for='expandedFacebook'><FacebookShareButton url={expandedCardContent.web_url} hashtag='#CSCI_571_NewsApp' > <FacebookIcon size={34} round={true} /></FacebookShareButton></a>
                                          <a data-tip="Twitter" data-for='expandedTwitter'><TwitterShareButton url={expandedCardContent.web_url} title='#CSCI_571_NewsApp'><TwitterIcon size={34} round={true} /></TwitterShareButton></a>
                                          <a data-tip="Email" data-for='expandedEmail'><EmailShareButton style={{ paddingRight: '50px' }} url={expandedCardContent.web_url} subject='#CSCI_571_NewsApp'><EmailIcon size={34} round={true} /></EmailShareButton></a>

                                          <a data-tip="Bookmark" data-for='expandedBookmarks' onClick={() => { this.bookmarkHandler(expandedCardContent); this.setState({ isPartOfBookmarks: !this.state.isPartOfBookmarks }); }}>
                                             {this.state.isPartOfBookmarks
                                                ? <BookmarkIcon style={{ fontSize: 30, color: "#b80000" }} />
                                                : <BookmarkBorderOutlinedIcon style={{ fontSize: 30, color: "#b80000" }} />
                                             }
                                          </a>
                                          <ReactTooltip id='expandedBookmarks' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedFacebook' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedTwitter' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedEmail' place="top" type="dark" effect="float" />

                                       </div>
                                    </div>
                                 </Default>
                                 <Mobile>
                                    <div id="leftexpanded_mobile" style={{ paddingLeft: '20px', paddingRight: '10px', fontSize: '12px' }}>
                                       <Moment format="DD MMMM YYYY">{this.truncateDate(expandedCardContent.pub_date)}</Moment>
                                    </div>

                                    <div id="rightexpanded">
                                       <div style={{ paddingLeft: '10px' }}>
                                          <a data-tip="Facebook" data-for='expandedFacebook'><FacebookShareButton url={expandedCardContent.web_url} hashtag='#CSCI_571_NewsApp' > <FacebookIcon size={24} round={true} /></FacebookShareButton></a>
                                          <a data-tip="Twitter" data-for='expandedTwitter'><TwitterShareButton url={expandedCardContent.web_url} title='#CSCI_571_NewsApp'><TwitterIcon size={24} round={true} /></TwitterShareButton></a>
                                          <a data-tip="Email" data-for='expandedEmail'><EmailShareButton style={{ paddingRight: '10px' }} url={expandedCardContent.web_url} subject='#CSCI_571_NewsApp'><EmailIcon size={24} round={true} /></EmailShareButton></a>

                                          <a data-tip="Bookmark" data-for='expandedBookmarks' onClick={() => { this.bookmarkHandler(expandedCardContent); this.setState({ isPartOfBookmarks: !this.state.isPartOfBookmarks }); }}>
                                             {this.state.isPartOfBookmarks
                                                ? <BookmarkIcon style={{ fontSize: 22, color: "#b80000" }} />
                                                : <BookmarkBorderOutlinedIcon style={{ fontSize: 22, color: "#b80000" }} />
                                             }
                                          </a>
                                          <ReactTooltip id='expandedBookmarks' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedFacebook' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedTwitter' place="top" type="dark" effect="float" />
                                          <ReactTooltip id='expandedEmail' place="top" type="dark" effect="float" />

                                       </div>
                                    </div>
                                 </Mobile>
                              </div>

                           </div>


                           <div>
                              <Default>
                                 < img class="img-thumbnail" style={{ width: '100%' }} src={this.imageHandler(expandedCardContent.multimedia)} alt="Image Is Loading from NYT Server..." />
                              </Default>
                              <Mobile>
                                 < img class="img-thumbnail" src={this.imageHandler(expandedCardContent.multimedia)} alt="Image Is Loading from NYT Server..." />
                              </Mobile>
                           </div>

                           <p style={{ fontSize: '12px', paddingTop: '20px' }}>
                              {!this.state.expandAdditionalContent &&
                                 <div style={{ paddingLeft: '20px' }}>
                                    <Truncate lines={4} ellipsis={<span>... <br /><div style={{ alignContent: 'right' }}>
                                       <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                                          <ExpandMoreIcon style={{ fontSize: '40px' }} onClick={e => this.toggleExpandAdditionalContent()} />
                                       </div>
                                    </div></span>}>
                                       {expandedCardContent.abstract}
                                    </Truncate>
                                 </div>
                              }
                              {
                                 this.state.expandAdditionalContent &&
                                 <div>
                                    {expandedCardContent.abstract}
                                    <div style={{ alignContent: 'right' }}>
                                       <div style={{ textAlign: 'right', paddingRight: '20px' }}>
                                          <ExpandLessIcon style={{ fontSize: '40px' }} onClick={e => this.toggleExpandAdditionalContent()} />
                                       </div>
                                    </div>
                                 </div>
                              }
                           </p>
                        </div>
                     </ExpandedCardDiv>
                  </Container>
                  <CommentBox currentCardId={this.props.currentCardId} />
               </div>
            );
         }
      }
   }
}

const ExpandedCardDiv = styled.div`
  background: #fff;
  border-radius: 2px;
  display: flex;
  height: 100%;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  box-shadow: 0.2px 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  /*box-shadow: 2.5px 5px 10px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);*/
   transition: all 0.3s cubic - bezier(.25, .8, .25, 1);
   padding - top: 5px;
  &: hover {
      /*box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);*/
      box - shadow: 2.5px 5px 10px rgba(0, 0, 0, 0.19), 0 3px 3px rgba(0, 0, 0, 0.23);
      transform: translateY(-0.5px);
   },
   `;

const bounceCss = css`
   display: block;
   margin: 0 auto;
   border - color: red;
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

export default ExpandedCard;