import * as React from "react";
import {
  IonAvatar,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonSkeletonText,
  IonThumbnail,
} from "@ionic/react";
import './HomePageSkeleton.scss'

const HomePageSkeleton: React.FC = (props) => {
  return (
    <IonContent className="home-page-skeleton">
      <div className="ion-padding custom-skeleton">
        <IonAvatar slot="start">
          <IonSkeletonText animated />
        </IonAvatar>
        <IonSkeletonText animated style={{ width: "30%" }} />
        <IonSkeletonText animated style={{ width: "40%" }} />
        <IonSkeletonText animated style={{ width: "50%" }} />

        <IonLabel>
          <IonSkeletonText animated style={{ width: "80%", height: "50px" }} />
        </IonLabel>
      </div>
      <IonList>
        <IonItem className="none-border-item">
          <IonThumbnail slot="start">
            <IonSkeletonText animated />
          </IonThumbnail>

          <IonThumbnail slot="start">
            <IonSkeletonText animated />
          </IonThumbnail>

          <IonThumbnail slot="start">
            <IonSkeletonText animated />
          </IonThumbnail>
          <IonThumbnail slot="start">
            <IonSkeletonText animated />
          </IonThumbnail>
        </IonItem>

        <IonItem className="none-border-item">
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
            <p>
              <IonSkeletonText animated style={{ width: "80%" }} />
            </p>
            <p>
              <IonSkeletonText animated style={{ width: "60%" }} />
            </p>
          </IonLabel>
        </IonItem>

        <IonItem className="none-border-item">
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
            <p>
              <IonSkeletonText animated style={{ width: "80%" }} />
            </p>
            <p>
              <IonSkeletonText animated style={{ width: "60%" }} />
            </p>
          </IonLabel>
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
            <p>
              <IonSkeletonText animated style={{ width: "80%" }} />
            </p>
            <p>
              <IonSkeletonText animated style={{ width: "60%" }} />
            </p>
          </IonLabel>
        </IonItem>
        <IonItem className="none-border-item">
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
            <p>
              <IonSkeletonText animated style={{ width: "80%" }} />
            </p>
            <p>
              <IonSkeletonText animated style={{ width: "60%" }} />
            </p>
          </IonLabel>
        </IonItem>

        <IonItem className="none-border-item">
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
            <p>
              <IonSkeletonText animated style={{ width: "80%" }} />
            </p>
            <p>
              <IonSkeletonText animated style={{ width: "60%" }} />
            </p>
          </IonLabel>
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
            <p>
              <IonSkeletonText animated style={{ width: "80%" }} />
            </p>
            <p>
              <IonSkeletonText animated style={{ width: "60%" }} />
            </p>
          </IonLabel>
        </IonItem>
        <IonItem className="none-border-item">
          <IonLabel>
            <h3>
              <IonSkeletonText animated style={{ width: "50%" }} />
            </h3>
            <p>
              <IonSkeletonText animated style={{ width: "80%" }} />
            </p>
            <p>
              <IonSkeletonText animated style={{ width: "60%" }} />
            </p>
          </IonLabel>
        </IonItem>

      </IonList>
    </IonContent>
  );
};

export default HomePageSkeleton;
