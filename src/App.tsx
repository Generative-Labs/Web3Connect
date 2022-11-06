import React, { Suspense } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonContent, IonLoading,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from './pages/Home'

import { observer } from "mobx-react-lite";

/* Core CSS required for Ionic components to work properly */
import "./App.css";
import "@ionic/react/css/core.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./components/Login";
import {useStore} from "./services/mobx/service";
import Web3MQChat from "./components/Web3MQChat";
// @ts-ignore
const App: React.FC = observer(() => {
  setupIonicReact({
    mode: 'ios',
  });
  const store = useStore()


  // useEffect(() => {
  //   const init = async () => {
  //     // @ts-ignore
  //     if (getUserInfoByJWT()) {
  //       let userInfo = getUserInfoByJWT();
  //       if (userInfo.eth_wallet_address) {
  //         document.title = `SwapChat ${userInfo.eth_wallet_address}`;
  //       }
  //     }
  //   };
  //   init()
  // }, []);

  //get s
  return (
    <IonApp>
      <IonContent className={'app-content'}>
        <IonReactRouter>
          <IonRouterOutlet>
            <Suspense fallback={<div>Loading</div>}>
              <Route
                path='/'
                render={() => <Redirect to='/auth' />}
                exact={true}
              />
              <Route path='/auth' component={Login} />
              <Route path='/home/:handle' component={Home} />
              <Route path='/chat' component={Web3MQChat} />
            </Suspense>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonContent>
    </IonApp>
  );
});

export default App;
