import React from "react";
import {createRoot} from "react-dom/client";
import AwsPipelineAmplifyDemo from './app';
import Store from './store.js';
const initialState = {
    title:"TSR - System Administration",
    currentUser: [],
    clients: [],
    locations:[],
    receivers: [],
    remotes: [],
    schedules:[],
    teams: [],
    cities: [],
    cityProviders: [],
    providers: [],
    selectedLocationUsers: [],
    selectedLocationRemotes: [],
    selectedLocationTvs: [],
    selectedCityProviderChannels: [],
    allChannelPackages: [],
    allTsrLocations: [],
    locationChannelPackages: [],
    selectedClientSubscriptions: [],
    selectedTeamGames: [],
    gamesToAdd: [],
    tsrSystemWideTotalReceivers: [],
    selectedSport: 1,
    selectedClient: null,
    selectedLocation: null,
    selectedTeam: null,
    selectedCity: null,
    selectedProvider: null,
    selectedCityProvider: null,
    selectedNetworkChannel: null,
    pageForm: {},
    receiverForm: {},
    newManagerForm: {},
    openDrawer: true,
    openUserForm: false,
    openClientForm: false,
    openAddGameForm: false,
    states: [],
    env: 'development'
};

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
    <Store.Provider initialState={initialState}>
        <AwsPipelineAmplifyDemo />
    </Store.Provider>
)
