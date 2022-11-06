import * as React from "react";
import {
  IonAvatar,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSkeletonText,
} from "@ionic/react";
import './ContactsPageSkeleton.scss'

const ContactsPageSkeleton: React.FC = (props) => {
  return (
    <IonContent className="home-page-skeleton">

      <IonList>
        <IonItem className="none-border-item">
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "30%" }} />
            </h3>
          </IonLabel>
        </IonItem>

        <IonItem className="none-border-item">
          <IonAvatar slot="start">
            <IonSkeletonText animated />
          </IonAvatar>
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
          </IonLabel>
        </IonItem>



        <IonItem className="none-border-item">
          <IonAvatar slot="start">
            <IonSkeletonText animated />
          </IonAvatar>
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
          </IonLabel>
        </IonItem>

        <IonItem className="none-border-item">
          <IonAvatar slot="start">
            <IonSkeletonText animated />
          </IonAvatar>
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
          </IonLabel>
        </IonItem>

        <IonItem className="none-border-item">
          <IonAvatar slot="start">
            <IonSkeletonText animated />
          </IonAvatar>
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
          </IonLabel>
        </IonItem>

        <IonItem className="none-border-item">
          <IonAvatar slot="start">
            <IonSkeletonText animated />
          </IonAvatar>
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
          </IonLabel>
        </IonItem>

        <IonItem className="none-border-item">
          <IonAvatar slot="start">
            <IonSkeletonText animated />
          </IonAvatar>
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
          </IonLabel>
        </IonItem>

      </IonList>
    </IonContent>
  );
};

export default ContactsPageSkeleton;
