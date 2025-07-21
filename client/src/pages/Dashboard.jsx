import DepartmentForm from "../components/DepartmentForm";
import SectionForm from "../components/SectionForm";
import PatientForm from "../components/PatientForm";
import TestForm from "../components/TestForm";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <DepartmentForm />
        <SectionForm />
      </div>
      <div className="space-y-6">
        <PatientForm />
        <TestForm />
      </div>
    </div>
  );
}
