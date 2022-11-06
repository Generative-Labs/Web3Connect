import React, {useEffect} from 'react';
import {
    IonContent,
    IonPage,
} from '@ionic/react';
import './HomePage.scss';
import {useHistory} from 'react-router-dom';

const ErrorPage: React.FC = () => {
    const history = useHistory();
    useEffect(() => {
        setTimeout(() => {
            history.replace('/loginPage')
        }, 3000)
    }, []);
    return (
        <IonPage>
            <IonContent>
                <h1 style={{marginTop: '50%', textAlign: 'center'}}>The token was hijacked by aliens. Returning...</h1>
            </IonContent>
        </IonPage>
    );
};
export default ErrorPage;
