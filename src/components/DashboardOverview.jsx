'use client';
import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';

const DashboardOverview = () => {
  // State to manage which section is shown
  const [showHowToUse, setShowHowToUse] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to /login
      router.push('/');
    }
  }, [router]);

  return (
    <div className={styles.turnitDashOverviewBg}>
      {/* Toggle between Change Log and How To Use sections */}
      {showHowToUse ? (
        <div className={styles.turnitDashOverviewHowUse}>
          <div className={styles.turnitDashOverview}>
            <p>Dashboard Overview</p>
            <button onClick={() => setShowHowToUse(false)}>How To Use</button>
          </div>

          <div className={styles.sDOverviewContentLeftScroll}>
            <div className={styles.sDOverviewContentchange}>
              <div className={`${styles.sDOContentLeftTxt} ${styles.sDOContentLeftTxtChange}`}>
                <h5>Change Log</h5>
                <p className={styles.sDOContentLeftTxtPara}>Recent updates and changes to the system</p>
              </div>
              <div className={styles.sDOContentLeftTxtListchange}>
                {/* Version Updates */}
                <div className={styles.sDOContentLeftTxtVersion}>
                  <h6>v2.6 <span>(17/10/2024)</span></h6>
                  <ul>
                    <li>Updated the UI/UX of the Humanizer</li>
                    <li>Updated the UI/UX of the Detector</li>
                    <li>Scan content commercial AI detectors using API keys</li>
                    <li>Added a new AI detector (Copyleaks)</li>
                    <li>Added a new AI detector (GPTZero)</li>
                    <li>Added a new AI detector (ZeroGPT)</li>
                    <li>Added a new AI detector (Originality AI)</li>
                    <li>Updated the UI/UX of the StealthWriter Detector (progress bar)</li>
                  </ul>
                </div>
                <div className={styles.sDOContentLeftTxtVersion}>
                  <h6>v2.5.5 <span>(03/10/2024)</span></h6>
                  <ul>
                    <li>Updates & Bug fixes on Ghost 2.0 & Ninja 2.0</li>
                    <li>Added support for all languages in the Humanizer</li>
                    <li>Added support for all languages in the Detector</li>
                  </ul>
                </div>
                <div className={styles.sDOContentLeftTxtVersion}>
                  <h6>v2.5 <span>(03/10/2024)</span></h6>
                  <ul>
                    <li>Updates & Bug fixes on Ghost 2.0 & Ninja 2.0</li>
                    <li>Added support for all languages in the Humanizer</li>
                    <li>Added support for all languages in the Detector</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.turnitDashOverviewChangeLog}>
          <div className={styles.turnitDashOverview}>
            <p>Dashboard Overview</p>
            <button onClick={() => setShowHowToUse(true)}>Change Log</button>
          </div>
          <div className={styles.sDOverviewContentLeft}>
            <div className={styles.sDOverviewContentLeftScroll}>
              <div className={styles.sDOContentLeftTxt}>
                <h5>How to Use</h5>
                <p>Quick guide to using our AI Humanizer</p>
              </div>
              <div className={styles.sDOContentLeftTxtList}>
                <ul>
                  <li>
                    <h6>1. Generate AI Content</h6>
                    <p>Begin by generating AI content with a tool of your choice. For better results, use premium models like GPT-4 or Claude 3.5 Opus/Sonnet.</p>
                  </li>
                  <li>
                    <h6>2. Clean the Text (optional)</h6>
                    <p>Remove Markdown or HTML formatting, special characters, numbers, or other unwanted content.</p>
                  </li>
                  <li>
                    <h6>3. Select the Model</h6>
                    <p>Choose between Ninja or Ghost. Ghost generally provides better overall text quality and detection scores.</p>
                  </li>
                  <li>
                    <h6>4. Choose the Level of Humanization</h6>
                    <p>Select a level from 1 to 10. Start with level 7 and adjust as needed.</p>
                  </li>
                  <li>
                    <h6>5. Humanize the Text</h6>
                    <p>Click Humanize to process the text. Review the humanized content and predicted AI detection score.</p>
                  </li>
                  <li>
                    <h6>6. Replace sentences with high AI impact</h6>
                    <p>Begin by generating AI content with a tool of your choice. For better results, use premium models like GPT-4 or Claude 3.5 Opus/Sonnet.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
