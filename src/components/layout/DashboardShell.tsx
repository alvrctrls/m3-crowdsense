import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  Bus,
  Database,
  LayoutDashboard,
  Map,
  Menu,
  X,
} from 'lucide-react';
import { useCrowdSense } from '../../context/CrowdSenseContext';
import { formatTimePeriodLabel } from '../../services/demandForecastService';
import { DashboardSection } from '../../types/transport';
import { DemandCategoryBadge } from '../common/DemandBadge';

interface NavItem {
  id: DashboardSection;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    subtitle: 'Network summary & AI insights',
    icon: LayoutDashboard,
  },
  {
    id: 'map',
    label: 'Demand Map',
    subtitle: 'Interactive Nairobi stages',
    icon: Map,
  },
  {
    id: 'stages',
    label: 'Stage Insights',
    subtitle: 'Sortable table & stage details',
    icon: BarChart3,
  },
  {
    id: 'forecasts',
    label: 'Forecasts',
    subtitle: '15 / 30 / 60m prediction model',
    icon: Activity,
  },
  {
    id: 'sacco',
    label: 'SACCO Planning',
    subtitle: 'Operational advisory actions',
    icon: Bus,
  },
  {
    id: 'data',
    label: 'Data & Model',
    subtitle: 'Pipeline, ethics & m3 status',
    icon: Database,
  },
];

export const DashboardShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    activeSection,
    setActiveSection,
    selectedStage,
    selectedStageForecast,
    selectedTimePeriod,
    selectedHorizon,
    providerStatus,
  } = useCrowdSense();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: DashboardSection) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f7f7f2] text-[#171717]">
      {/* Desktop Left Sidebar Rail (Fixed 248px) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[248px] lg:fixed lg:inset-y-0 bg-[#ffffff] border-r border-[#171717]/8 z-30 justify-between">
        <div>
          {/* Brand Lockup */}
          <div className="px-5 py-5 border-b border-[#171717]/8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center shrink-0">
                <span className="text-[#00e575] font-bold text-sm tracking-tight font-mono-tabular">
                  m3
                </span>
              </div>
              <div>
                <div className="text-base font-bold tracking-tight text-[#171717] leading-none">
                  m3 CrowdSense
                </div>
                <div className="text-[11px] text-[#6b7280] mt-1">
                  Nairobi Demand Intelligence
                </div>
              </div>
            </div>
          </div>

          {/* Primary Navigation Items */}
          <nav
            aria-label="Main dashboard navigation"
            className="p-3 space-y-1"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
              Intelligence Views
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all relative ${
                    isActive
                      ? 'bg-[#171717] text-[#ffffff] shadow-xs'
                      : 'text-[#6b7280] hover:bg-[#f3f4ee] hover:text-[#171717]'
                  }`}
                >
                  {isActive && (
                    <span
                      className="w-1 h-5 rounded-full bg-[#00e575] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-[#00e575]' : 'text-[#6b7280]'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold leading-tight truncate">
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] truncate mt-0.5 ${
                        isActive ? 'text-[#ffffff]/70' : 'text-[#6b7280]'
                      }`}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Persistent Shared State Summary & m3 Connection Status */}
        <div className="p-3.5 border-t border-[#171717]/8 space-y-3 bg-[#f7f7f2]/60">
          {/* Active Stage Context Card */}
          <div className="p-3 rounded-xl bg-[#ffffff] border border-[#171717]/8 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">
              <span>Active Stage Context</span>
              <span className="font-mono-tabular text-[#171717]">
                +{selectedHorizon}m
              </span>
            </div>
            <div className="text-xs font-bold text-[#171717] truncate">
              {selectedStage.name}
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-mono-tabular font-semibold text-[#171717]">
                {selectedStageForecast.predictedPassengers} pax
              </span>
              <DemandCategoryBadge
                category={selectedStageForecast.predictedCategory}
                size="sm"
              />
            </div>
          </div>

          {/* m3 Connection Mode Indicator */}
          <div className="px-3 py-2 rounded-lg bg-[#171717] text-[#ffffff] space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono-tabular font-bold text-[#00e575]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e575]" />
              <span>{providerStatus.displayBadge}</span>
            </div>
            <p className="text-[10px] text-[#ffffff]/75 leading-tight">
              Synthetic demonstration dataset · Separate from live m3 commuter
              app.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-[248px] flex flex-col min-w-0">
        {/* Top Context Bar (Follows 3-Zone Top Bar Contract) */}
        <header className="sticky top-0 z-20 h-14 bg-[#ffffff]/95 backdrop-blur-xs border-b border-[#171717]/8 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Zone 1: Mobile Menu Trigger + Breadcrumb / Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-lg bg-[#f3f4ee] text-[#171717]"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
            <div className="text-sm font-bold text-[#171717] whitespace-nowrap truncate">
              m3 CrowdSense{' '}
              <span className="text-[#6b7280] font-normal mx-1.5">/</span>
              <span className="text-[#006d34]">
                {NAV_ITEMS.find((n) => n.id === activeSection)?.label}
              </span>
            </div>
          </div>

          {/* Zone 2: Shared Context Readout */}
          <div className="hidden md:flex items-center gap-3 text-xs text-[#6b7280] whitespace-nowrap">
            <span>
              Window:{' '}
              <strong className="text-[#171717]">
                {formatTimePeriodLabel(selectedTimePeriod)}
              </strong>
            </span>
            <span>·</span>
            <span>
              Stage:{' '}
              <strong className="text-[#171717]">{selectedStage.name}</strong>
            </span>
            <span>·</span>
            <span className="font-mono-tabular text-[#171717] font-semibold">
              {providerStatus.displayBadge}
            </span>
          </div>

          {/* Zone 3: Primary Action to Switch between Map & Data Transparency */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                setActiveSection(activeSection === 'map' ? 'forecasts' : 'map')
              }
              className="px-3 py-1.5 rounded-lg bg-[#00e575] hover:bg-[#00cb68] text-[#171717] text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              {activeSection === 'map' ? 'Open Forecasts' : 'Open Demand Map'}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#ffffff] border-b border-[#171717]/12 px-4 py-3 space-y-1.5 z-20">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-[#171717] text-[#ffffff]'
                      : 'text-[#171717] hover:bg-[#f3f4ee]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#00e575]' : 'text-[#6b7280]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </span>
                  <span
                    className={`text-[10px] ${
                      isActive ? 'text-[#00e575]' : 'text-[#6b7280]'
                    }`}
                  >
                    {item.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active View Container */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1440px] w-full mx-auto">
          {children}
        </main>

        {/* Quiet Footer */}
        <footer className="px-6 py-4 border-t border-[#171717]/8 text-xs text-[#6b7280] flex flex-col sm:flex-row sm:items-center justify-between gap-2 max-w-[1440px] w-full mx-auto">
          <div>
            <strong className="text-[#171717]">m3 CrowdSense</strong> ·
            AI-Assisted Public Transport Demand Intelligence Concept for
            Nairobi, Kenya
          </div>
          <div className="font-mono-tabular text-[11px]">
            SYNTHETIC DEMO DATA · ADVISORY INSIGHTS ONLY
          </div>
        </footer>
      </div>
    </div>
  );
};
