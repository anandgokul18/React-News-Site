import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

//Page Core
import { Router, Route, Link } from 'react-router'
import NavBarTop from './component/NavBarTop';

//Cards
import styled from 'styled-components'

//Axios for Guardian and NYT
import HomePageGuardian from './component/HomePageGuardian';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiResponse: "",
            switch1: true,
        };
    }

    handleSwitchChange = nr => () => {
        let switchNumber = `switch${nr}`;
        this.setState({
            [switchNumber]: !this.state[switchNumber]
        });
    }

    callAPI() {
        fetch("http://localhost:9000/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        return (
            <div>
                <NavBarTop />
                <HomePageGuardian />
            </div>
        );
    }
}

export default App;
