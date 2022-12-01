import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Telemetry from 'src/libs/telemetry';
import ActionButtons from './ActionButtons';
import PoiBlockContainer from './PoiBlockContainer';
import Contribution from 'src/components/Contribution';
import CategoryList from 'src/components/CategoryList';
import CategoryItem from 'src/components/CategoryItem';
import { fire } from 'src/libs/customEvents';
import PoiItem from 'src/components/PoiItem';
import { Divider } from 'src/components/ui';
import { useConfig, useI18n, useFavorites, useDevice } from 'src/hooks';
import { Reservation } from './blocks/Reservation/Reservation';
import CategoryService from 'src/adapters/category_service';
import { findBlock } from 'src/libs/pois';
import { sources } from 'config/constants.yml';

const PoiPanelContent = ({ poi }) => {
  const { _ } = useI18n();
  const { isInFavorites, removeFromFavorites, addToFavorites } = useFavorites();
  const { enabled: isDirectionActive } = useConfig('direction');
  const { ecoResponsible: isEcoResponsibleActive } = useConfig('features');
  const hasReservation = poi && poi.className === 'hotel' && poi.meta.source === 'tripadvisor';
  const { isMobile } = useDevice();
  const ecoResponsibleBlock = poi ? findBlock(poi.blocks, 'ecoresponsible') : null;
  const ecoResponsibleCategory = CategoryService.getCategoryByName(ecoResponsibleBlock?.source);
  const isEcoResponsibleBlock = isEcoResponsibleActive && !!ecoResponsibleBlock;
  const ecoResponsibleTexts = {
    [sources.ecotables]: {
      text: _('Eco-responsible restaurants'),
      subtext: _('Selected in patnership with Écotables'),
    },
    [sources.circuitscourts]: {
      text: _('Circuit court'),
      subtext: _('Selected in patnership with INRAE'),
    },
    [sources.vrac]: {
      text: _('Vente en vrac'),
      subtext: _('Selected in patnership with ReseauVrac'),
    },
  };

  useEffect(() => {
    fire('set_direction_shortcut_callback', openDirection);

    return () => {
      // Clear direction shortcut cb to reset default action
      fire('set_direction_shortcut_callback', null);
    };
  }, [poi, openDirection]);

  const center = () => {
    Telemetry.sendPoiEvent(poi, 'go');
    fire('fit_map', poi);
  };

  const openDirection = useCallback(() => {
    Telemetry.sendPoiEvent(poi, 'itinerary');
    window.app.navigateTo('/routes/', { poi });
  }, [poi]);

  const onClickPhoneNumber = () => {
    const source = poi.meta && poi.meta.source;
    if (source) {
      Telemetry.sendPoiEvent(
        poi,
        'phone',
        Telemetry.buildInteractionData({
          id: poi.id,
          source,
          template: 'single',
          zone: 'detail',
          element: 'phone',
        })
      );
    }
  };

  const toggleStorePoi = e => {
    e?.preventDefault();
    Telemetry.sendPoiEvent(poi, 'favorite', { stored: !isInFavorites(poi) });
    if (isInFavorites(poi)) {
      removeFromFavorites(poi);
    } else {
      addToFavorites(poi);
    }
  };

  if (!poi) {
    return null;
  }

  return (
    <div className="poi_panel__content">
      <PoiItem
        poi={poi}
        className="u-mb-l poi-panel-poiItem"
        withAlternativeName
        withOpeningHours
        onClick={center}
      />
      <div className="u-mb-l">
        <ActionButtons
          poi={poi}
          isDirectionActive={isDirectionActive}
          openDirection={openDirection}
          onClickPhoneNumber={onClickPhoneNumber}
          isPoiInFavorite={isInFavorites(poi)}
          toggleStorePoi={toggleStorePoi}
        />
      </div>
      <div className="poi_panel__fullContent">
        {hasReservation && <Reservation url={poi.meta.source_url} mobile={isMobile} />}
        {isEcoResponsibleBlock && (
          <>
            <Divider paddingTop={0} />
            <h3 className="u-text--smallTitle u-mb-s">{_('Appears in', 'poi')}</h3>
            <CategoryItem
              category={ecoResponsibleCategory}
              text={ecoResponsibleTexts?.[ecoResponsibleCategory?.name]?.text}
              subtext={ecoResponsibleTexts?.[ecoResponsibleCategory?.name]?.subtext}
            />
          </>
        )}
        {poi && <PoiBlockContainer poi={poi} />}
        <Contribution poi={poi} isOnlyDisplayed={isEcoResponsibleBlock} />
        <Divider paddingTop={0} className="poi_panel__fullWidth" />
        <h3 className="u-text--smallTitle u-mb-s">{_('Search around this place', 'poi')}</h3>
        <CategoryList className="poi_panel__categories u-mb-s" limit={4} />
      </div>
    </div>
  );
};

PoiPanelContent.propTypes = {
  poi: PropTypes.object,
};

export default PoiPanelContent;
