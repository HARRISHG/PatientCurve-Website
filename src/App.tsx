import { ChatbotComparison } from "./components/ChatbotComparison";
import { DemoBookingForm } from "./components/DemoBookingForm";
import { FAQ } from "./components/FAQ";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { IntegrationDiagram } from "./components/IntegrationDiagram";
import { MeasurementDashboard } from "./components/MeasurementDashboard";
import { ProblemSection } from "./components/ProblemSection";
import { RecoveryMechanism } from "./components/RecoveryMechanism";
import { WorkflowSimulator } from "./components/WorkflowSimulator";

export function App() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroSection />
        <ProblemSection />
        <RecoveryMechanism />
        <ChatbotComparison />
        <WorkflowSimulator />
        <IntegrationDiagram />
        <MeasurementDashboard />
        <DemoBookingForm />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
