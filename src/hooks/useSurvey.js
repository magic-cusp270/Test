import { useEffect, useState } from 'react';
import { useDevice, useConfig, useI18n } from 'src/hooks';

export const useSurvey = () => {
  const testGroupPer = useConfig('testGroupPer');
  const { isMobile } = useDevice();
  const { surveyApiUrl } = useConfig('survey');
  const { locale } = useI18n();
  const [survey, setSurvey] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('website', 'maps');
    params.set('locale', locale);
    params.set('tgp', testGroupPer);
    params.set('device', isMobile ? 'smartphone' : 'desktop');
    const surveyUrl = surveyApiUrl + '?' + params.toString();

    fetch(surveyUrl)
      .then(response => response.json())
      .then(response => {
        setSurvey(response.data[0]);
      });
  }, [isMobile, locale, surveyApiUrl, testGroupPer]);

  return survey;
};
