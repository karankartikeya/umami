import { format } from 'date-fns';
import { useLocale, useMessages, useWebsiteSessionsWeekly } from 'components/hooks';
import { LoadingPanel } from 'components/common/LoadingPanel';
import { getDayOfWeekAsDate } from 'lib/date';
import styles from './SessionsWeekly.module.css';
import classNames from 'classnames';
import { TooltipPopup } from 'react-basics';

export function SessionsWeekly({ websiteId }: { websiteId: string }) {
  const { data, ...props } = useWebsiteSessionsWeekly(websiteId);
  const { dateLocale } = useLocale();
  const { labels, formatMessage } = useMessages();

  const [, max] = data
    ? data.reduce((arr: number[], hours: number[], index: number) => {
        const min = Math.min(...hours);
        const max = Math.max(...hours);

        if (index === 0) {
          return [min, max];
        }

        if (min < arr[0]) {
          arr[0] = min;
        }

        if (max > arr[1]) {
          arr[1] = max;
        }

        return arr;
      }, [])
    : [];

  return (
    <LoadingPanel {...(props as any)} data={data}>
      <div className={styles.week}>
        <div className={styles.day}>
          <div className={styles.header}>&nbsp;</div>
          {Array(24)
            .fill(null)
            .map((_, i) => {
              return (
                <div key={i} className={classNames(styles.cell, styles.hour)}>
                  {i.toString().padStart(2, '0')}
                </div>
              );
            })}
        </div>
        {data?.map((day: number[], index: number) => {
          return (
            <div className={styles.day} key={index}>
              <div className={styles.header}>
                {format(getDayOfWeekAsDate(index), 'EEE', { locale: dateLocale })}
              </div>
              {day?.map((hour: number) => {
                return (
                  <div key={hour} className={classNames(styles.cell)}>
                    {hour > 0 && (
                      <TooltipPopup
                        label={`${formatMessage(labels.visitors)}: ${hour}`}
                        position="right"
                      >
                        <div className={styles.block} style={{ opacity: hour / max }} />
                      </TooltipPopup>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </LoadingPanel>
  );
}

export default SessionsWeekly;
