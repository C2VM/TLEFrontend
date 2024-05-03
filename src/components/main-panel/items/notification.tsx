import { useContext } from 'react';
import styled from 'styled-components';

import { LocaleContext } from '@/context';
import { getString } from '@/localisations';
import { engineCall } from '@/engine';

const Notice = styled.div`
  border-radius: 3rem;
  padding: 8rem;
  display: flex;
  width: 100%;
  background-color: rgba(75, 200, 240, 0.5);
`;

const Warning = styled.div`
  animation-timing-function: linear;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-name: c2vm-tle-notification-warning;
  border-radius: 3rem;
  padding: 8rem;
  display: flex;
  width: 100%;
`;

const Image = styled.img`
  width: 20rem;
  height: 20rem;
  margin-right: 10rem;
`;

const Label = styled.div`
  color: var(--textColor);
  flex: 1;
`;

export default function Notification(props: MainPanelItemNotification) {
  const locale = useContext(LocaleContext);
  const clickHandler = () => {
    if (props.engineEventName && props.engineEventName.length > 0) {
      engineCall(props.engineEventName, JSON.stringify(props));
    }
  };
  return (
    <>
      {props.notificationType == "warning" &&
      <Warning onClick={clickHandler}>
        <Image src="Media/Game/Icons/AdvisorNotifications.svg" />
        <Label>{getString(locale, props.label)}</Label>
        <style>
          {`@keyframes c2vm-tle-notification-warning {
            to {
              background-color: rgba(200, 0, 0, 0.5);
            }
          }`}
        </style>
      </Warning>}
      {props.notificationType == "notice" &&
      <Notice onClick={clickHandler}>
        <Image src="Media/Game/Icons/AdvisorNotifications.svg" />
        <Label>{getString(locale, props.label)}</Label>
      </Notice>}
    </>
  );
}