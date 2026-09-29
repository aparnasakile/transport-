/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TravelProvider, useTravel } from './context/TravelContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { HomePage } from './components/HomePage.tsx';
import { BusSearchPage } from './components/BusSearchPage.tsx';
import { TimetablePage } from './components/TimetablePage.tsx';
import { TransportComparisonPage } from './components/TransportComparisonPage.tsx';
import { TripPlannerPage } from './components/TripPlannerPage.tsx';
import { HotelsPage } from './components/HotelsPage.tsx';
import { LocalTransportPage } from './components/LocalTransportPage.tsx';
import { OffersPage } from './components/OffersPage.tsx';
import { MyTripsPage } from './components/MyTripsPage.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { SeatSelectionModal } from './components/SeatSelectionModal.tsx';
import { BookingCheckoutModal } from './components/BookingCheckoutModal.tsx';
import { DigitalTicketModal } from './components/DigitalTicketModal.tsx';
import { ExtraToolsModal } from './components/ExtraToolsModal.tsx';
import { ChatbotWidget } from './components/ChatbotWidget.tsx';
import { Footer } from './components/Footer.tsx';

const AppContent: React.FC = () => {
  const { currentView } = useTravel();

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'buses':
        return <BusSearchPage />;
      case 'timetable':
        return <TimetablePage />;
      case 'compare':
        return <TransportComparisonPage />;
      case 'planner':
        return <TripPlannerPage />;
      case 'hotels':
        return <HotelsPage />;
      case 'local_transport':
        return <LocalTransportPage />;
      case 'offers':
        return <OffersPage />;
      case 'my_trips':
        return <MyTripsPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 lg:pb-0">
      {/* Top Navbar adhering to Top-Bar Contract */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Global Interactive Modals */}
      <SeatSelectionModal />
      <BookingCheckoutModal />
      <DigitalTicketModal />
      <ExtraToolsModal />

      {/* AI Travel Assistant Chatbot */}
      <ChatbotWidget />

      {/* Footer */}
      <Footer />

      {/* Mobile App-like Bottom Touch Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <TravelProvider>
      <AppContent />
    </TravelProvider>
  );
}
