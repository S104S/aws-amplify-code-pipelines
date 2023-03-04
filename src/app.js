/**
 * Created by Bryan on 11/29/2017.
 */

let config = {
    apiKey: "AIzaSyAL5_cwneyaXqkWems8jisH0lEO_fwbZLM",
    authDomain: "thesportsremote.firebaseapp.com",
    databaseURL: "https://thesportsremote.firebaseio.com",
    projectId: "thesportsremote",
    storageBucket: "thesportsremote.appspot.com",
    messagingSenderId: "699821053356"
};

import React from 'react';
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

const AwsPipelineAmplifyDemo = () => {
    return (
        <div  style={{
            paddingTop: 56,
            height: '100%'
        }}>
                <label>Test amplify app</label>
        </div>
    )
};

export default AwsPipelineAmplifyDemo;