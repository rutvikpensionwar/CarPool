import React, { Component, Fragment } from 'react';
import axios from 'axios';

/* A Component to check relative rest calls to server */
export default class StanityCheck extends Component{

    constructor(props){
        super(props);

        this.state = {
            json: 'hello world'
        }


    }

    componentDidMount(){
        this.fetchTest(); 
    }
    fetchTest(){
        axios.get("/v1/testmysql")
            .then((res) => {

                this.setState({json: res.data})

            })
            .catch((error) => {
                console.log(error);
            })

    }
    render(){
        return (
           <div>
               {this.state.json}
           </div>
        );
    }
}