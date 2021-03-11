import React, {Component} from "react";
import SideNav, {MenuIcon} from "react-simple-sidenav";

class Navabc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNav: false
        }
    }

    handleClick = state => {
        this.setState({
            showNav: !this.state.showNav
        });
    }

    handleHistory = employee => {
        this.props.history.push('/history');
    }

    render(){

        return(
            <div>
                <MenuIcon style={{marginLeft: '10px'}}onClick={this.handleClick}/>
                <SideNav
                    showNav        =  {this.state.showNav}
                    onHideNav      =  {this.handleClick}
                    title          =  "PARK-IT"
                    items          =  {[
                        <a style={{textDecoration:'none', color :'black'}} href="/map">Home</a>,
                        <a style={{textDecoration:'none', color :'black'}} href="/history">History</a>,
                        <a style={{textDecoration:'none', color :'black'}} href="">LOGOUT</a>

                    ]}
                    titleStyle     =  {{backgroundColor: 'rgba(31, 138, 112, 1)'}}
                    itemStyle      =  {{backgroundColor: '#fff', listStyleType:'none'}}
                    itemHoverStyle =  {{backgroundColor: 'rgba(70, 64, 253, 1)'}}
                />
            </div>
        );
    }
}

export { Navabc };