'use client'

// components/CookieConsentComponent.tsx or .jsx
import React, { useEffect } from 'react';
import CookieConsent from "react-cookie-consent";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const CookieConsentComponent = () => {
  useEffect(() => {
    const consentGiven = localStorage.getItem('analyticsConsent') === 'true';
    if (consentGiven) {
      // Ensuring window.dataLayer exists before pushing to it
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'consent_given'
      });

      const script = document.createElement('script');
      script.src = "https://www.googletagmanager.com/gtag/js?id=GTM-WCXLPWX5";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.dataLayer.push({
          'gtm.start': new Date().getTime(),
          event: 'gtm.js'
        });
        window.dataLayer.push({
          'event': 'gtag.config',
          'GTM-WCXLPWX5': true,
        });
      };
    }
  }, []);

  return (
    <CookieConsent
      location="bottom"
      buttonText="I accept"
      declineButtonText="I decline"
      enableDeclineButton
      cookieName="userConsentCookie"
      style={{ background: "black", fontSize: "14px" }}
      buttonStyle={{ color: "white", fontSize: "13px", margin: "0 10px" }}
      declineButtonStyle={{ color: "white", fontSize: "13px" }}
      onAccept={() => {
        localStorage.setItem('analyticsConsent', 'true');
        // Optionally, refresh the page or invoke additional logic
      }}
      onDecline={() => {
        localStorage.setItem('analyticsConsent', 'false');
        // Handle the decline action, possibly refreshing the page or updating state
      }}
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
  );
};

export default CookieConsentComponent;