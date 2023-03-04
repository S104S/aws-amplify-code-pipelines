/**
 * Created by Bryan on 12/17/2017.
 */
import React from 'react';
import {BrowserRouter, HashRouter, Route, Switch} from "react-router-dom";
import ClientsContainer from "./clients/clients.container";
import Dashboard from "./dashboard";
import LocationsContainer from "./locations/locations.container";
import ClientDetailsContainer from "./clients/clientDetails.container";
import LocationDetailsContainer from "./locations/locationDetails.container";
import SchedulesContainer from "./schedules/schedules.container";
import TeamsContainer from "./teams/teams.container";
import TeamDetailsContainer from "./teams/teamDetails.container";
import CitiesContainer from "./cities/cities.container";
import CityDetailsContainer from "./cities/cityDetails.container";
import CityProviderDetailContainer from "./cities/cityProviderDetail.container";
import ProvidersContainer from "./providers/providers.container";
import ProviderDetailsContainer from "./providers/providerDetail.container";
import GamesContainer from "./games/games.container";
import WhatsShowingContainer from "./whatsShowing/whatsShowing.container";
import Grid from "@material-ui/core/Grid";
import Header from "./header/header";
import Sidebar from "./sidebar/sidebar.pres";

const TsrRouter = () => {
    return (
        <HashRouter basename="/">
            <Grid container spacing={16} direction="row">
                <Grid item xs={12} lg={12} md={12} sm={12}>
                    <Header />
                </Grid>
                <Grid item xs={2} lg={2} md={2} sm={2}>
                    <Sidebar
                        onClose={() => {console.log('close clicked')}}
                        open={() => {console.log('close clicked')}}
                        variant={'persistent'}
                    />
                </Grid>
                <Grid item xs={10} lg={10} md={10} sm={10}>
                    <Switch>
                        <Route path="/" exact componen={Dashboard} />
                        <Route path="/dashboard" component={Dashboard} />
                        <Route path="/clients/:id" exact component={ClientDetailsContainer} />
                        <Route path="/clients" component={ClientsContainer} />
                        <Route path="/locations/:id" exact component={LocationDetailsContainer} />
                        <Route path="/locations" component={LocationsContainer} />
                        <Route path="/teams/:id" exact component={TeamDetailsContainer} />
                        <Route path="/teams" component={TeamsContainer} />
                        <Route path="/cities/provider/:id" exact component={CityProviderDetailContainer} />
                        <Route path="/cities/:id" exact component={CityDetailsContainer} />
                        <Route path="/cities" component={CitiesContainer} />
                        <Route path="/providers/:id" exact component={ProviderDetailsContainer} />
                        <Route path="/providers" component={ProvidersContainer} />
                        <Route path="/schedules" component={SchedulesContainer} />
                        <Route path="/games/:id" component={GamesContainer} />
                        <Route path="/lineup" component={WhatsShowingContainer} />
                    </Switch>
                </Grid>
            </Grid>
        </HashRouter>
    )
};


export default TsrRouter;

