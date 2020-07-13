import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

//Page Core
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
//import NavBarTop from './component/NavBarTop';

//Navbar Core
//React-BS Button, Navbar and Switch Material-UI
import { Button, Navbar, Nav, NavItem, NavLink, NavDropdown, Form, FormControl } from 'react-bootstrap'
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import MaterialSwitch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import InputGroup from 'react-bootstrap/InputGroup'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

//Cards
import styled from 'styled-components';

//Tooltip for hover over bookmarks
import ReactTooltip from 'react-tooltip';

//Axios for Guardian and NYT
import GuardianPages from './component/GuardianPages';
import BookmarksPage from './component/BookmarksPage';
import SearchResultsPage from './component/SearchResultsPage';
import NYTPages from './component/NYTPages';

//Bookmark Page specific imports
import BookmarkIcon from '@material-ui/icons/Bookmark';

//Search
//import Search from './component/Search';
import SearchApp from './component/SearchApp';
import { createBrowserHistory } from 'history';
import SearchAppNoValue from './component/SearchAppNoValue';

const BlueIOSSwitch = withStyles((theme) => ({
    root: {
        width: 52,
        height: 23,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(27.5px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#0693E3',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 22,
        height: 22,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <MaterialSwitch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            doSearch: false,
            fontColors: ['#f9f9f9', '#9b9b9b', '#9b9b9b', '#9b9b9b', '#9b9b9b', '#9b9b9b'],
        };
        //Retrieving the switch1 state from Storage
        var retrievedSwitch1stateObject = localStorage.getItem('switch1state');
        //console.log(retrievedObject);
        if (retrievedSwitch1stateObject == null) {
            //console.log('Detected null');
            this.state.switch1 = true;
            localStorage.setItem('switch1state', JSON.stringify(true));
        } else {
            //console.log('Detected ' + (retrievedSwitch1stateObject === 'true'));
            this.state.switch1 = (retrievedSwitch1stateObject === 'true');
        }

        //Retrieving the switch1 state from Storage
        var retrievedBookmarksObject = localStorage.getItem('isThisBookmarksPage');
        //console.log(retrievedObject);
        if (retrievedBookmarksObject == null) {
            //console.log('Detected null');
            this.state.isThisBookmarksPage = false;
            localStorage.setItem('isThisBookmarksPage', JSON.stringify(false));
        } else {
            //console.log('Detected ' + (retrievedObject === 'true'));
            this.state.isThisBookmarksPage = (retrievedBookmarksObject === 'true');
        }

        //Retrieving the switch1 state from Storage
        var retrievedSearchObject = localStorage.getItem('isThisSearchPage');
        //console.log(retrievedObject);
        if (retrievedSearchObject == null) {
            //console.log('Detected null');
            this.state.isThisSearchPage = false;
            localStorage.setItem('isThisSearchPage', JSON.stringify(false));
        } else {
            //console.log('Detected ' + (retrievedObject === 'true'));
            this.state.isThisSearchPage = (retrievedSearchObject === 'true');
        }

        //Handlers for changing themes in Navbar based on search/bookmark
        this.handlerToSetSearchAndBookmarksToFalseForNav = this.handlerToSetSearchAndBookmarksToFalseForNav.bind(this);
        this.handlerToSetSearchToTrueForNav = this.handlerToSetSearchToTrueForNav.bind(this);

        //Handler for getting search query
        this.handlerForGettingSearchQuery = this.handlerForGettingSearchQuery.bind(this);

        //Force Update on bookmarks state change
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

    }

    handleSwitchChange = nr => () => {
        let switchNumber = `switch${nr}`;
        this.setState({
            [switchNumber]: !this.state[switchNumber]
        });
        localStorage.setItem('switch1state', !(localStorage.getItem('switch1state') === 'true'));
    }

    callAPI() {
        fetch("http://newswebsite.us-east-1.elasticbeanstalk.com/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    handlerToSetSearchAndBookmarksToFalseForNav() {
        localStorage.setItem('isThisSearchPage', JSON.stringify(false));
        localStorage.setItem('isThisBookmarksPage', JSON.stringify(false));
        this.state.isThisBookmarksPage = false;
        this.state.isThisSearchPage = false;
        //this.setState({
        //    isThisBookmarksPage: false,
        //    isThisSearchPage: false,
        //})
    }

    handlerToSetSearchToTrueForNav() {
        localStorage.setItem('isThisSearchPage', JSON.stringify(true));
        this.state.isThisSearchPage = true;
        //this.setState({
        //    isThisBookmarksPage: false,
        //    isThisSearchPage: false,
        //})
    }

    handlerForGettingSearchQuery(dataquery) {
        //console.log(dataquery);
        this.forceUpdateHandler();
        this.setState({ isThisSearchPage: true, isThisBookmarksPage: false });
        localStorage.setItem('isThisSearchPage', true);
        localStorage.setItem('isThisBookmarksPage', false);
        window.location = '/search' + '?q=' + dataquery;
        //history.push('/search' + '?q=' + dataquery);
    }

    forceUpdateHandler() {
        this.forceUpdate();
    };

    handleLinkColorOnClick(index) {
        for (let i = 0; i < this.state.fontColors.length; i++) {
            if (index == i) {
                this.state.fontColors[i] = '#f9f9f9'; //whitish
            }
            else {
                this.state.fontColors[i] = '#9b9b9b'; //grey
            }
        }

    }

    render() {
        return (
            <Router>

                <Navbar collapseOnSelect expand="lg" variant="dark"> {/*bg="dark" variant="dark" */}

                    <div style={{ paddingLeft: '10px', marginRight: '10px' }} >
                        {this.state.isThisSearchPage
                            ?
                            <SearchApp searchQueryProp={this.handlerForGettingSearchQuery} onChange={() => { this.forceUpdateHandler(); this.handleLinkColorOnClick(100); }} />
                            :
                            <SearchAppNoValue searchQueryProp={this.handlerForGettingSearchQuery} onChange={() => { this.forceUpdateHandler(); this.handleLinkColorOnClick(100); }} />
                        }
                    </div>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto"> {/*activeKey="/home"*/}

                            <Nav.Item><Link to="/" style={{ color: this.state.fontColors[0], paddingRight: '10px' }} active onClick={() => { this.handleLinkColorOnClick(0); this.forceUpdateHandler(); this.setState({ isThisBookmarksPage: false, isThisSearchPage: false }); localStorage.setItem('isThisBookmarksPage', false); localStorage.setItem('isThisSearchPage', false); localStorage.removeItem('searchQuery'); }}>Home</Link></Nav.Item>
                            <Nav.Item><Link to="/world" style={{ color: this.state.fontColors[1], paddingRight: '10px' }} activeClassName="activeNavLink" onClick={() => { this.handleLinkColorOnClick(1); this.forceUpdateHandler(); this.setState({ isThisBookmarksPage: false, isThisSearchPage: false }); localStorage.setItem('isThisBookmarksPage', false); localStorage.setItem('isThisSearchPage', false); localStorage.removeItem('searchQuery'); }}>World</Link></Nav.Item>
                            <Nav.Item><Link to="/politics" style={{ color: this.state.fontColors[2], paddingRight: '10px' }} activeClassName="activeNavLink" onClick={() => { this.handleLinkColorOnClick(2); this.forceUpdateHandler(); this.setState({ isThisBookmarksPage: false, isThisSearchPage: false }); localStorage.setItem('isThisBookmarksPage', false); localStorage.setItem('isThisSearchPage', false); localStorage.removeItem('searchQuery'); }}>Politics</Link></Nav.Item>
                            <Nav.Item><Link to="/business" style={{ color: this.state.fontColors[3], paddingRight: '10px' }} onClick={() => { this.handleLinkColorOnClick(3); this.forceUpdateHandler(); this.setState({ isThisBookmarksPage: false, isThisSearchPage: false }); localStorage.setItem('isThisBookmarksPage', false); localStorage.setItem('isThisSearchPage', false); localStorage.removeItem('searchQuery'); }}>Business</Link></Nav.Item>
                            <Nav.Item><Link to="/technology" style={{ color: this.state.fontColors[4], paddingRight: '10px' }} onClick={() => { this.handleLinkColorOnClick(4); this.forceUpdateHandler(); this.setState({ isThisBookmarksPage: false, isThisSearchPage: false }); localStorage.setItem('isThisBookmarksPage', false); localStorage.setItem('isThisSearchPage', false); localStorage.removeItem('searchQuery'); }}>Technology</Link></Nav.Item>
                            <Nav.Item><Link to="/sports" style={{ color: this.state.fontColors[5], paddingRight: '10px' }} onClick={() => { this.handleLinkColorOnClick(5); this.forceUpdateHandler(); this.setState({ isThisBookmarksPage: false, isThisSearchPage: false }); localStorage.setItem('isThisBookmarksPage', false); localStorage.setItem('isThisSearchPage', false); localStorage.removeItem('searchQuery'); }}>Sports</Link></Nav.Item>

                            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}

                        </Nav>

                        <>
                            {this.state.isThisBookmarksPage || this.state.isThisSearchPage
                                ?
                                <>
                                    {this.state.isThisSearchPage ?
                                        <>
                                            <Link data-tip="Bookmark" to='/bookmarks' onClick={() => { this.handleLinkColorOnClick(100); this.setState({ isThisSearchPage: false, isThisBookmarksPage: true }); localStorage.setItem('isThisBookmarksPage', true); localStorage.setItem('isThisSearchPage', false); localStorage.removeItem('searchQuery'); this.forceUpdateHandler(); }}>
                                                <BookmarkBorderOutlinedIcon style={{ fontSize: 30, color: "#f9f9f9" }} />
                                            </Link>
                                            <ReactTooltip place="bottom" type="dark" effect="float" />
                                        </>
                                        :
                                        <>
                                            <Link data-tip="Bookmark" to='/bookmarks' onClick={() => { this.handleLinkColorOnClick(100); this.setState({ isThisSearchPage: false }); localStorage.setItem('isThisSearchPage', false); localStorage.removeItem('searchQuery'); this.forceUpdateHandler(); }}>
                                                <BookmarkIcon style={{ fontSize: 30, color: "#fff" }} />
                                            </Link>
                                            <ReactTooltip place="bottom" type="dark" effect="float" />
                                        </>
                                    }
                                </>
                                :
                                <>
                                    <Link data-tip="Bookmark" to='/bookmarks' style={{ paddingRight: '20px' }} onClick={() => { this.handleLinkColorOnClick(100); this.setState({ isThisBookmarksPage: !this.state.isThisBookmarksPage }); localStorage.setItem('isThisBookmarksPage', !(localStorage.getItem('isThisBookmarksPage') === 'true')); localStorage.removeItem('searchQuery'); this.forceUpdateHandler(); }}>
                                        <BookmarkBorderOutlinedIcon style={{ fontSize: 30, color: "#f9f9f9" }} />
                                    </Link>
                                    <ReactTooltip place="bottom" type="dark" effect="float" />
                                    <div style={{ paddingRight: '20px', color: "#f9f9f9" }}>NYTimes </div>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={<BlueIOSSwitch checked={this.state.switch1} onChange={this.handleSwitchChange(1)} name="NYTorGuardian" />}
                                        />
                                    </FormGroup>
                                    <div style={{ color: "#f9f9f9" }}>Guardian </div>
                                </>
                            }
                        </>


                    </Navbar.Collapse>
                </Navbar >

                <div>
                    {this.state.switch1
                        ? <>
                            <Route exact path='/' component={() => <GuardianPages currentPage={'home'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/home" component={() => <GuardianPages currentPage={'home'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/world" component={() => <GuardianPages currentPage={'world'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/politics" component={() => <GuardianPages currentPage={'politics'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/business" component={() => <GuardianPages currentPage={'business'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/technology" component={() => <GuardianPages currentPage={'technology'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/sports" component={() => <GuardianPages currentPage={'sports'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/bookmarks" component={() => <BookmarksPage />} />
                            <Route exact path="/search" render={(props) => <SearchResultsPage {...props} currentOrigin={'GUARDIAN'} searchTrueHandler={this.handlerToSetSearchToTrueForNav} />} />


                        </>
                        : <>
                            <Route exact path='/' component={() => <NYTPages currentPage={'home'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/home" component={() => <NYTPages currentPage={'home'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/world" component={() => <NYTPages currentPage={'world'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/politics" component={() => <NYTPages currentPage={'politics'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/business" component={() => <NYTPages currentPage={'business'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/technology" component={() => <NYTPages currentPage={'technology'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/sports" component={() => <NYTPages currentPage={'sports'} searchOrBookmarksNavHandler={this.handlerToSetSearchAndBookmarksToFalseForNav} />} />
                            <Route path="/bookmarks" component={() => <BookmarksPage />} />
                            <Route exact path="/search" render={(props) => <SearchResultsPage {...props} currentOrigin={'NYT'} searchTrueHandler={this.handlerToSetSearchToTrueForNav} />} />


                        </>
                    }
                </div>


            </Router >
        );
    }
}

const navlink = {
    color: '#9b9b9b',
    paddingRight: '10px',
    ":active": {
        color: '#f9f9f9'
    }
};

const history = createBrowserHistory();

export default App;
