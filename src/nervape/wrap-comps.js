import React, { Component } from "react";
import { useParams } from "react-router-dom";

export function withRouterParams(WrappedComponent) {
    const params = useParams();
    console.log('withRouterParams', params);
    // return class extends React.Component {
    //     renderer() {
    //         return <WrappedComponent id={params.id}/>
    //     }
    // }
    return WrappedComponent;
}