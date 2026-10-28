/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DashboardShell } from './components/layout/DashboardShell';
import { DataAndModelView } from './components/views/DataAndModelView';
import { DemandMapView } from './components/views/DemandMapView';
import { ForecastsView } from './components/views/ForecastsView';
import { OverviewView } from './components/views/OverviewView';
import { SaccoPlanningView } from './components/views/SaccoPlanningView';
import { StageInsightsView } from './components/views/StageInsightsView';
import {
  CrowdSenseProvider,
  useCrowdSense,
} from './context/CrowdSenseContext';

const ActiveSectionRouter: React.FC = () => {
  const { activeSection } = useCrowdSense();

  switch (activeSection) {
    case 'overview':
      return <OverviewView />;
    case 'map':
      return <DemandMapView />;
    case 'stages':
      return <StageInsightsView />;
    case 'forecasts':
      return <ForecastsView />;
    case 'sacco':
      return <SaccoPlanningView />;
    case 'data':
      return <DataAndModelView />;
    default:
      return <OverviewView />;
  }
};

export default function App() {
  return (
    <CrowdSenseProvider>
      <DashboardShell>
        <ActiveSectionRouter />
      </DashboardShell>
    </CrowdSenseProvider>
  );
}
