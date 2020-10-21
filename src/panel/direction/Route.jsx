import React, { useContext, useEffect, Fragment } from 'react';
import ReactDOM from 'react-dom';
import MobileRouteDetails from './MobileRouteDetails';
import RouteSummary from './RouteSummary';
import RoadMap from './RoadMap';
import { DeviceContext } from 'src/libs/device';

const Route = ({
  id, route, vehicle, showDetails, origin, destination, isActive,
  isActiveDetails, toggleDetails, openPreview, selectRoute, hoverRoute,
}) => {
  const isMobile = useContext(DeviceContext);
  const portalContainer = document.createElement('div');

  useEffect(() => {
    if (showDetails && isMobile) {
      document.body.appendChild(portalContainer);
    }
    return function removePortalContainer() {
      portalContainer.remove();
    };
  }, [isMobile, showDetails]);

  return <Fragment>
    <div className={`itinerary_leg ${isActive ? 'itinerary_leg--active' : ''}`}
      onMouseEnter={() => { hoverRoute(id, true); }}
      onMouseLeave={() => { hoverRoute(id, false); }}
    >
      <RouteSummary
        id={id}
        route={route}
        isActiveDetails={isActiveDetails}
        toggleDetails={toggleDetails}
        openPreview={openPreview}
        selectRoute={selectRoute}
        vehicle={vehicle}
      />
      {!isMobile && showDetails && <RoadMap
        route={route}
        origin={origin}
        destination={destination}
        vehicle={vehicle} />}
    </div>
    {isMobile && showDetails && ReactDOM.createPortal(<MobileRouteDetails
      id={id}
      route={route}
      origin={origin}
      destination={destination}
      vehicle={vehicle}
      toggleDetails={toggleDetails}
      openPreview={openPreview}
    />, portalContainer)}
  </Fragment>;
};

export default Route;
