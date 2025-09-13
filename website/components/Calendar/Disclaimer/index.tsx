import {useState} from "react";

import styles from '../EventCalendar.module.scss';

export const EventsDisclaimer = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div className={styles.disclaimer}>
      <button
        className={styles.toggleDisclaimer}
        onClick={() => setShowDisclaimer((open) => !open)}
      >
        Disclaimer
      </button>
      {showDisclaimer && (
        <div className={styles.disclaimerPopover} style={{ display: 'block' }}>
          <strong>Disclaimer:</strong> Connect Utah Today provides a list of events for informational purposes only. We do not organize, operate, or officially endorse any of the events listed on this website unless explicitly stated. Event details, dates, times, and locations are subject to change without notice. Connect Utah Today is not responsible for the accuracy, reliability, or completeness of the information provided, nor for any issues, injuries, or losses that may arise from your participation in any event. Please verify event details directly with the event organizer before attending. By using this website, you acknowledge and accept that Connect Utah Today is not liable for any consequences resulting from your participation in or reliance on any event listed.
          <br /><br />
          <button className={styles.closeDisclaimer} onClick={() => setShowDisclaimer(false)}>Close</button>
        </div>
      )}
    </div>
  )
}
