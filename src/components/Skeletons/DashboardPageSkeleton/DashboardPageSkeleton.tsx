import * as React from "react";
import {
  IonAvatar,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSkeletonText,
  IonThumbnail,
} from "@ionic/react";
import './DashboardPageSkeleton.scss'

const ChatPageSkeleton: React.FC = (props) => {
  return (
    <IonContent className="home-page-skeleton">
      <IonList>
        <IonItem className="none-border-item" style={{ marginTop:"40px" }}>
          <IonThumbnail className="thumbnail-border-radius-10" slot="start" style={{ width:'50%', height: '120px',borderRadius: '10px' }}>
            <IonSkeletonText animated />
          </IonThumbnail>

          <IonThumbnail className="thumbnail-border-radius-10" slot="start" style={{ width:'50%', height: '120px',borderRadius: '10px' }}>
            <IonSkeletonText animated />
          </IonThumbnail>
        </IonItem>
        <IonItem className="none-border-item" style={{ marginTop: '15px' }}>
          <IonThumbnail className="thumbnail-border-radius-10" slot="start"  style={{ width:'50%', height: '120px',borderRadius: '10px' }}>
            <IonSkeletonText animated />
          </IonThumbnail>

          <IonThumbnail className="thumbnail-border-radius-10" slot="start"  style={{ width:'50%', height: '120px',borderRadius: '10px' }}>
            <IonSkeletonText animated />
          </IonThumbnail>
        </IonItem>
      </IonList>
    </IonContent>
  );
};

export default ChatPageSkeleton;
